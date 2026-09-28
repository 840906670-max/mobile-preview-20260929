import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    scale: 1,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

export default function CardSwap({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  dropDistance = 500,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children
}) {
  const config = useMemo(() =>
    easing === 'elastic'
      ? { ease: 'elastic.out(0.6,0.9)', durDrop: 2, durMove: 2, durReturn: 2, promoteOverlap: 0.9, returnDelay: 0.05 }
      : { ease: 'power1.inOut', durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.45, returnDelay: 0.2 },
    [easing]
  );

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(() => childArr.map(() => React.createRef()), [childArr.length]);
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const timerRef = useRef(0);
  const interactionTimerRef = useRef(0);
  const hoveredRef = useRef(false);
  const pressedRef = useRef(false);
  const activateRef = useRef(null);
  const advanceRef = useRef(null);
  const container = useRef(null);

  useEffect(() => {
    const total = refs.length;
    const elements = () => refs.map((r) => r.current).filter(Boolean);
    order.current = Array.from({ length: total }, (_, i) => i);

    const clearTimer = () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = 0;
      }
    };

    const clearInteractionTimer = () => {
      if (interactionTimerRef.current) {
        window.clearTimeout(interactionTimerRef.current);
        interactionTimerRef.current = 0;
      }
    };

    let isVisible = false;
    let isPageVisible = !document.hidden;
    let visibilityObserver = null;

    const stopCurrent = () => {
      tlRef.current?.kill();
      tlRef.current = null;
      gsap.killTweensOf(elements());
    };

    const isBlocked = () => hoveredRef.current || pressedRef.current;

    const scheduleNext = () => {
      clearTimer();
      if (total < 2 || isBlocked() || !isVisible || !isPageVisible) return;
      timerRef.current = window.setTimeout(() => {
        timerRef.current = 0;
        if (!isBlocked() && isVisible && isPageVisible) rotate();
      }, delay);
    };

    const pauseAuto = () => {
      clearTimer();
      clearInteractionTimer();
      tlRef.current?.pause();
    };

    const resumeAuto = () => {
      clearInteractionTimer();
      if (isBlocked() || !isVisible || !isPageVisible) return;
      if (tlRef.current) {
        tlRef.current.play();
      } else {
        scheduleNext();
      }
    };

    const scheduleAfterInteraction = () => {
      clearInteractionTimer();
      interactionTimerRef.current = window.setTimeout(() => {
        interactionTimerRef.current = 0;
        resumeAuto();
      }, Math.max(2600, delay * 0.65));
    };

    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    function rotate(force = false) {
      if (order.current.length < 2 || (!force && isBlocked())) return;
      clearTimer();
      stopCurrent();
      const [front, ...rest] = order.current;
      const nextOrder = [...rest, front];
      order.current = nextOrder;
      const elFront = refs[front].current;
      const tl = gsap.timeline({
        onComplete: () => {
          tlRef.current = null;
          scheduleNext();
        }
      });
      tlRef.current = tl;
      tl.to(elFront, { y: `+=${dropDistance}`, duration: config.durDrop, ease: config.ease });
      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, `promote+=${i * 0.15}`);
      });
      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => { gsap.set(elFront, { zIndex: backSlot.zIndex }); }, undefined, 'return');
      tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease }, 'return');
    }

    advanceRef.current = () => rotate(true);

    const promote = (index) => {
      const current = order.current;
      if (!current.includes(index)) return;
      pauseAuto();
      // A manual selection becomes the new starting point, but the following
      // cards always stay in their authored 1 → 2 → 3 → 4 → 5 order.
      const nextOrder = Array.from({ length: total }, (_, offset) => (index + offset) % total);
      const alreadyInPlace = current.every((item, position) => item === nextOrder[position]);
      if (alreadyInPlace) {
        scheduleAfterInteraction();
        return;
      }

      stopCurrent();
      order.current = nextOrder;
      const tl = gsap.timeline();
      tlRef.current = tl;

      nextOrder.forEach((cardIndex, slotIndex) => {
        const slot = makeSlot(slotIndex, cardDistance, verticalDistance, refs.length);
        const el = refs[cardIndex].current;
        tl.set(el, { zIndex: slot.zIndex }, 0);
        tl.to(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          scale: slotIndex === 0 ? 1.035 : 1,
          duration: config.durMove,
          ease: config.ease
        }, slotIndex === 0 ? 0.05 : 0);
        if (slotIndex === 0) {
          tl.to(el, { scale: 1, duration: 0.35, ease: 'power2.out' }, '>-0.22');
        }
      });

      tl.call(() => { tlRef.current = null; });
      scheduleAfterInteraction();
    };

    activateRef.current = promote;
    // Keep the first project stage visible on arrival; the rotation begins
    // only after the first delay so the numbered sequence reads 1 → 5.
    scheduleNext();

    const node = container.current;
    const pointerEnter = (event) => {
      if (event.pointerType !== 'mouse') return;
      hoveredRef.current = true;
      pauseAuto();
    };
    const pointerLeave = (event) => {
      if (event.pointerType !== 'mouse') return;
      hoveredRef.current = false;
      if (!pressedRef.current) resumeAuto();
    };
    const pointerDown = () => {
      pressedRef.current = true;
      pauseAuto();
    };
    const pointerUp = (event) => {
      pressedRef.current = false;
      if (event.pointerType === 'touch' || event.pointerType === 'pen') {
        scheduleAfterInteraction();
      } else if (!hoveredRef.current) {
        resumeAuto();
      }
    };
    const pointerCancel = () => {
      pressedRef.current = false;
      scheduleAfterInteraction();
    };

    if (node) {
      node.addEventListener('pointerdown', pointerDown);
      node.addEventListener('pointerup', pointerUp);
      node.addEventListener('pointercancel', pointerCancel);
      if (pauseOnHover) {
        node.addEventListener('pointerenter', pointerEnter);
        node.addEventListener('pointerleave', pointerLeave);
      }
      visibilityObserver = typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible && isPageVisible) scheduleNext();
            else clearTimer();
          }, { threshold: 0 });
      visibilityObserver?.observe(node);
    }
    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible && isVisible) scheduleNext();
      else clearTimer();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (node) {
        node.removeEventListener('pointerdown', pointerDown);
        node.removeEventListener('pointerup', pointerUp);
        node.removeEventListener('pointercancel', pointerCancel);
        if (pauseOnHover) {
          node.removeEventListener('pointerenter', pointerEnter);
          node.removeEventListener('pointerleave', pointerLeave);
        }
      }
      clearTimer();
      clearInteractionTimer();
      visibilityObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      advanceRef.current = null;
      stopCurrent();
    };
  }, [cardDistance, verticalDistance, dropDistance, delay, pauseOnHover, skewAmount, config]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          role: child.props.role ?? 'button',
          tabIndex: child.props.tabIndex ?? 0,
          onClick: (e) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
            // The delivery stack is a sequential story: one tap always
            // advances it to the next authored card instead of selecting a
            // card from the visible stack.
            advanceRef.current?.();
          },
          onKeyDown: (e) => {
            child.props.onKeyDown?.(e);
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onCardClick?.(i);
              advanceRef.current?.();
            }
          }
        })
      : child
  );

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
}
