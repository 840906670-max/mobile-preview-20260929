import React from 'react'
import { createRoot } from 'react-dom/client'
import { createPortal } from 'react-dom'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './styles.css'
import './components.css'
import GradientWaves from './GradientWaves'
import FlexCarousel from './FlexCarousel'
import TechText from './TechText'

import SpecularButton from './SpecularButton'
import TiltedCard from './TiltedCard'
import ProfileCard from './ProfileCard'
import DomeGallery from './DomeGallery'
import DriftWall from './DriftWall'
import CardSwap, { Card } from './CardSwap'
import GridMotion from './GridMotion'
import PixelCard from './PixelCard'
import HalftoneReveal from './HalftoneReveal'
import TrueFocus from './TrueFocus'
import PulseHeart from './PulseHeart'
import DepthText from '../DepthText'
import { selectedWorks } from './selectedWorks'
import './midgray-theme.css'
import './media-flat.css'
import './hero-tech.css'

const profile = {
  name: '视觉设计师',
  roles: ['美术视觉设计师', 'AI 设计师', '三维设计师', '平面设计师'],
  email: '840906670@qq.com',
  phone: '+86 000 0000 0000',
  location: '北京 / 上海',
  intro:
    '专注于品牌视觉、AIGC 影像、三维视觉与商业平面设计。擅长把概念、叙事与技术流程转化为具有高级质感的视觉系统，为品牌、产品与内容项目建立稳定而有辨识度的视觉表达。',
  introEn:
    'I turn concepts, stories, and tools into clear visual systems for brands, products, and content.',
}

// 最后一张人物卡的文字都集中在这里，改名字、职位、年份或联系方式只需要改这一段。
const resumeCard = {
  kicker: 'JS',
  year: '嘉盛',
  name: '嘉盛',
  role: 'VISUAL DESIGNER',
  intro:
    '2016级北京电影学院影视美术设计-新媒体艺术专业。2021年创立咬子弹美术工作室，累计完成300+项美术设计及相关落地项目，项目覆盖北京、上海、广州、杭州等城市的影视与展陈。具备成熟的美术执行与设计落地经验，能够准确把握甲方及客户的核心需求；在平衡预算与设计周期的前提下，稳妥、高效的推进完成每个项目，欢迎合作联系。',
  introClosing: '推进完成每个项目，欢迎合作联系。',
  email: profile.email,
  phone: profile.phone,
  location: profile.location,
  photo: '/optimized/resume-card-portrait-outline.jpg',
}

const stats = [
  { value: '6+', label: '年视觉经验' },
  { value: '80+', label: '商业项目' },
  { value: '30+', label: '品牌视觉方案' },
  { value: '4', label: '核心设计方向' },
]

const projects = [
  {
    title: 'AI Campaign Visual',
    type: 'AIGC / Art Direction',
    desc: '面向品牌传播的 AI 视觉主KV与延展资产。',
    tone: 'cyan',
  },
  {
    title: '3D Product Scene',
    type: '3D Design / Lookdev',
    desc: '融合材质、灯光与空间构图的产品视觉场景。',
    tone: 'violet',
  },
  {
    title: 'Brand Visual System',
    type: 'Graphic / Identity',
    desc: '从版式、色彩到图形语言的品牌视觉系统。',
    tone: 'amber',
  },
]

const strengths = [
  { title: '视觉风格定义', text: '能从品牌调性、受众与传播场景出发，建立克制、统一且有记忆点的视觉语言。' },
  { title: 'AI 创意生产', text: '熟悉 AIGC 图像工作流，可快速探索风格方向、生成概念稿并沉淀可复用资产。' },
  { title: '三维场景表达', text: '具备三维构图、材质、灯光与渲染审美，适合产品、空间与概念视觉呈现。' },
  { title: '商业落地能力', text: '兼顾创意表达与项目效率，可输出适配社媒、海报、KV、活动页等多种物料。' },
]

const mediaItems = [
  // 第一栏保留为可编辑拼贴：替换 images 中的单张素材即可，不需要重新合成图片。
  {
    images: [
      '/set-design-01.png',
      '/set-design-08.png',
      '/set-design-02.png',
      '/set-design-04.png',
      '/set-design-12.png',
      '/set-design-05.png',
      '/set-design-06.png',
      '/set-design-13.png',
    ],
    imageCaptions: [
      '谢可寅MV场景设计',
      'mosiimorii直播场景设计',
      '京东XGQ焕新季TVC场景设计',
      '短片《绿珠》戏台场景设计',
      'BOSE耳机TVC场景设计',
      '《崩坏3》版本发布会场景设计',
      'Reaction美容仪TVC场景设计',
      '《恋与制作人》场景设计',
    ],
    label: '影视场景设计 / SET DESIGN',
    alt: '影视场景设计六图拼贴',
  },
  {
    images: [
      '/stage-design-02.png',
      '/stage-design-03.png',
      '/stage-design-04.png',
      '/stage-design-05.png',
      '/stage-design-06.png',
      '/stage-design-07.png',
      '/stage-design-08.png',
      '/stage-design-09.png',
    ],
    imageCaptions: [
      'Ubras 礼盒秀舞美',
      '爱奇艺爱世纪音乐节',
      '《崩坏3》新春会',
      '快手马年春晚舞台美术',
      'magline 舞台美术',
      '北京戏曲节舞台美术',
      '《美的X 新浪脱口秀》舞台美术',
      '新春团拜会舞美设计',
    ],
    label: '舞台美术 / STAGE ART',
    alt: '舞台美术六图展示',
  },
  {
    images: [
      '/installation-13.png',
      '/installation-20.png',
      '/installation-11.png',
      '/installation-15.png',
      '/installation-21.png',
      '/installation-17.png',
      '/installation-18.png',
      '/installation-12.png',
    ],
    imageCaptions: [
      '爱慕内衣实验室',
      '平安保险装置空间',
      '非遗文化艺术空间',
      '《舞动》人物内心空间',
      '英特尔芯片空间',
      'De Beers戒指空间',
      '马场装置空间',
      '旋转装置空间',
    ],
    label: '装置艺术 / INSTALLATION',
    alt: '装置艺术八图展示',
  },
  {
    images: [
      '/outdoor-variety-01.png',
      '/outdoor-variety-02.png',
      '/outdoor-variety-03.png',
      '/outdoor-variety-04.png',
      '/outdoor-variety-05.jpg',
      '/outdoor-variety-06.png',
      '/outdoor-variety-07.png',
      '/outdoor-variety-08.png',
    ],
    imageCaptions: [
      '《乐野行动》海蛇岛设计',
      '《灿烂的市集》成都季综艺场景设计',
      '《灿烂的市集》长沙季综艺场景设计',
      '淘宝直播新年冰雪季综艺设计',
      '爱奇艺悦享会机场综艺设计',
      'Ubras小凉风直播综艺设计',
      '《星耀雪上》综艺直播设计',
      '青岛黄渤戏剧节场地设计',
    ],
    label: '外景综艺 / OUTDOOR VARIETY',
    alt: '外景综艺项目展示',
  },
  {
    images: [
      '/exhibition-miniature-01.png',
      '/exhibition-miniature-02.png',
      '/exhibition-miniature-03.png',
      '/exhibition-miniature-04.png',
      '/exhibition-miniature-05.png',
      '/exhibition-miniature-07.png',
      '/exhibition-miniature-08.png',
      '/exhibition-miniature-09.png',
    ],
    imageCaptions: [
      '极氪千里浩瀚智驾展台微缩模型设计',
      '极客微缩模型',
      '心动的信号·微缩场景',
      '美的上海大剧院展台展陈',
      '金风公司地产沙盘设计',
      '微博电器展展区设计',
      '《恋与制作人》手偶礼盒设计',
      '《恋与制作人》手偶礼盒设计',
    ],
    label: '展陈 微缩 / EXHIBITION MINIATURE',
    alt: '展陈微缩项目展示',
  },
]

const optimizedMediaItems = mediaItems.map((item) => ({
  ...item,
  images: item.images.map((image) => (
    /\.png$/i.test(image)
      ? `/media-optimized/${image.slice(1, -4)}.jpg`
      : image
  )),
}))

// Keep the order stable between reloads, but mix each category before placing
// one image from each of the five categories into every carousel round.
const shuffleMediaItems = (items, seed) => {
  const shuffled = [...items]
  let state = seed >>> 0
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0
    const swapIndex = state % (index + 1)
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled
}

const flexMediaGroups = optimizedMediaItems.map((group, groupIndex) => (
  shuffleMediaItems(
    group.images.map((image, imageIndex) => ({
      src: image,
      alt: group.imageCaptions?.[imageIndex] || group.alt,
      title: group.imageCaptions?.[imageIndex] || group.label,
      subtitle: group.label,
    })),
    20260929 + groupIndex * 977,
  )
))

const flexMediaItems = Array.from({
  length: Math.max(...flexMediaGroups.map((group) => group.length), 0),
}, (_, roundIndex) => (
  flexMediaGroups.flatMap((group) => (group[roundIndex] ? [group[roundIndex]] : []))
)).flat()

const processSteps = [
  { number: '01', title: '沟通需求', en: 'BRIEF', text: '明确目标、受众、场景与交付边界，让创意从真实问题开始。', textEn: 'Set the goal, audience, context, and scope.' },
  { number: '02', title: '探索方向', en: 'EXPLORE', text: '建立情绪板、视觉关键词与概念草案，快速确认最有潜力的方向。', textEn: 'Build moodboards and test the strongest direction.' },
  { number: '03', title: '视觉制作', en: 'BUILD', text: '进入 AI、三维、平面与动态的制作流程，持续打磨细节与质感。', textEn: 'Craft with AI, 3D, graphics, and motion.' },
  { number: '04', title: '交付落地', en: 'DELIVER', text: '整理完整资产与规范，输出适配品牌、空间、社媒和活动现场的成果。', textEn: 'Package the assets for brand, space, and social.' },
]

const driftWallItems = [
  { image: '/hero-js-3.jpg', title: '品牌视觉' },
  { image: '/hero-js.jpg', title: 'AI 影像' },
  { image: '/hero-js-4.jpg', title: '空间叙事' },
  { image: '/hero-js-2.jpg', title: '三维场景' },
  { image: '/hero-js-5.jpg', title: '动态海报' },
  { image: '/hero-js-2.jpg', title: '三维场景' },
  { image: '/hero-js-5.jpg', title: '动态海报' },
  { image: '/hero-js-3.jpg', title: '品牌视觉' },
  { image: '/hero-js.jpg', title: 'AI 影像' },
  { image: '/hero-js-4.jpg', title: '空间叙事' },
  { image: '/hero-js-4.jpg', title: '空间叙事' },
  { image: '/hero-js-3.jpg', title: '品牌视觉' },
  { image: '/hero-js.jpg', title: 'AI 影像' },
  { image: '/hero-js-5.jpg', title: '动态海报' },
  { image: '/hero-js-2.jpg', title: '三维场景' },
]

// 卡片切换版面的素材清单：换素材只改这里的 image 路径就行。
// 想放视频，把 video 填成 '/videos/xxx.mp4'；鼠标移到卡片上会自动播放，
// 移开后回到封面图。卡片上的标题栏文案也可以在 label / en 里改。
const swapCards = [
  {
    id: '01',
    label: '沟通与参考',
    en: 'ALIGN & RESEARCH',
    image: '/communication-reference.png',
    placeholder: '明确需求、方向与现场条件，让创意、预算与执行从一开始处于同一节奏。',
    placeholderEn: 'Clarify needs, direction, and site conditions.',
    tone: 'ai',
  },
  {
    id: '02',
    label: '设计与统筹',
    en: 'DESIGN & PLAN',
    image: '/design-planning.png',
    placeholder: '充分尊重导演与客户需求，从白模到完整效果图，提前沟通并平衡创意、预算与时间，做好美术统筹工作',
    placeholderEn: 'Align creative, budget, and time from the start.',
    tone: 'style',
  },
  {
    id: '03',
    label: '搭建与执行',
    en: 'BUILD',
    image: '/build-execution.png',
    placeholder: '监督工程质量与搭建成本，让每一处细节稳定落地。',
    placeholderEn: 'Control quality and cost, down to every detail.',
    tone: 'threeD',
  },
  {
    id: '04',
    label: '拍摄与应变',
    en: 'ON SET',
    image: '/shooting-contingency.png',
    placeholder: '确保场景安全，及时调整、快速部署，让美术部门各工种高效协同。',
    placeholderEn: 'Keep the set safe, fast, and coordinated.',
    tone: 'delivery',
  },
  {
    id: '05',
    label: '验收与反馈',
    en: 'HANDOVER',
    image: '/acceptance-feedback.png',
    placeholder: '完成清点、整合与安全回收，确保每一项产品准确交付。',
    placeholderEn: 'Check, integrate, and deliver every item.',
    tone: 'delivery',
  },
]

function BilingualCopy({ children, en, className = '' }) {
  return (
    <span className={`bilingualCopy${className ? ` ${className}` : ''}`}>
      <span className="bilingualCopyZh">{children}</span>
      <span className="bilingualCopyEn">{en}</span>
    </span>
  )
}

// Keep all scroll-driven UI on one animation-frame tick. Several rails listen
// to the same stream, so a long swipe produces one layout pass instead of one
// requestAnimationFrame and one browser listener per rail.
const viewportSubscribers = new Set()
let viewportFrame = 0
const scheduleViewportUpdate = () => {
  if (viewportFrame) return
  viewportFrame = window.requestAnimationFrame(() => {
    viewportFrame = 0
    viewportSubscribers.forEach((callback) => callback())
  })
}

function subscribeToViewport(callback) {
  const wasEmpty = viewportSubscribers.size === 0
  viewportSubscribers.add(callback)
  if (wasEmpty) {
    window.addEventListener('scroll', scheduleViewportUpdate, { passive: true })
    window.addEventListener('resize', scheduleViewportUpdate)
  }
  scheduleViewportUpdate()

  return () => {
    viewportSubscribers.delete(callback)
    if (!viewportSubscribers.size) {
      if (viewportFrame) window.cancelAnimationFrame(viewportFrame)
      viewportFrame = 0
      window.removeEventListener('scroll', scheduleViewportUpdate)
      window.removeEventListener('resize', scheduleViewportUpdate)
    }
  }
}

function App() {
  const isEmbeddedPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('viewportPreview') === '1'
  const isLocalPreview = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  // The export build is deliberately phone-only: it has no editing controls
  // and keeps the page at the approved 85% presentation scale.
  const isMobileDelivery = import.meta.env.VITE_MOBILE_DELIVERY === 'true'
  const isSmallViewport = typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [pageZoom, setPageZoom] = useState(() => {
    if (typeof window === 'undefined') return 1
    // The embedded device preview must always render at 1:1 so the frame width
    // (390 / 844 / 1440) is the real layout width.
    if (isEmbeddedPreview) return 1
    if (isMobileDelivery) return 0.85
    const saved = Number(window.localStorage.getItem('portfolio-page-zoom'))
    return Number.isFinite(saved) ? Math.min(Math.max(saved, 0.75), 1.3) : 1
  })

  useEffect(() => {
    document.documentElement.style.setProperty('--page-zoom', String(pageZoom))
    if (!isEmbeddedPreview && !isMobileDelivery) window.localStorage.setItem('portfolio-page-zoom', String(pageZoom))
  }, [pageZoom, isEmbeddedPreview, isMobileDelivery])

  return (
    <>
      <div className="pageScale" style={{ zoom: pageZoom }}>
        <div className="pageWaveBackground" aria-hidden="true">
          <GradientWaves
            horizonColor="#4d4d4d" waveColor="#a6a6a6" crestColor="#ffffff"
            speed={0.8} amplitude={2.5} waveScale={0.6} waveRatio={1.8}
            swell={35} turbulence={20} tilt={0.91} zoom={1} height={5.5}
            fogDepth={18} detail={isSmallViewport ? 'low' : 'medium'} brightness={1} opacity={1}
            mouseInteraction={!isSmallViewport && !prefersReducedMotion} parallaxStrength={0.5}
            grain={!isSmallViewport && !prefersReducedMotion} grainIntensity={0.05}
          />
        </div>
        <MotionDirector />
        <main>
          <Navigation />
          <Hero />
          <MediaGallery />
          <ThirdProject />
          <ZeroToHundred />
          <CardSwapSection />
          <ConceptToFinal />
          <Contact />
        </main>
      </div>
      {!isEmbeddedPreview ? <BackToTop /> : null}
      {!isEmbeddedPreview && isLocalPreview && !isMobileDelivery ? <ViewportPreview /> : null}
    </>
  )
}

function BackToTop() {
  const [visible, setVisible] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches
  )

  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px)')
    const update = () => setVisible(query.matches)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      className="backToTop"
      aria-label="回到顶端"
      title="回到顶端"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 18V6M7.5 10.5 12 6l4.5 4.5" />
      </svg>
    </button>
  )
}

// This is deliberately a local-only inspection aid: it helps compare phone
// layouts while editing, but never becomes part of an exported website.
const previewModes = {
  desktop: { label: '电脑端', width: '1440px', height: '900px' },
  landscape: { label: '横屏手机', width: '844px', height: '390px' },
  portrait: { label: '竖屏手机', width: '440px', height: '956px' },
}

function ViewportPreview() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('desktop')
  const activeMode = previewModes[mode]
  const previewFrameRef = useRef(null)
  const previewUrl = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('viewportPreview', '1')
    url.hash = ''
    return url.toString()
  }

  return (
    <>
      <div className="viewportPreviewQuickModes" role="group" aria-label="直接打开设备预览">
        {Object.entries(previewModes).map(([key, item]) => (
          <button key={key} type="button" className={open && mode === key ? 'is-active' : ''} onClick={() => { setMode(key); setOpen(true) }}>
            {item.label}
          </button>
        ))}
      </div>
      {open ? (
        <div className="viewportPreviewOverlay" role="dialog" aria-modal="true" aria-label="设备预览">
          <div className="viewportPreviewToolbar">
            <div><strong>设备预览</strong><span>在网页内查看响应式差异</span></div>
            <div className="viewportPreviewModes" role="tablist" aria-label="设备尺寸">
              {Object.entries(previewModes).map(([key, item]) => (
                <button key={key} type="button" role="tab" aria-selected={mode === key} className={mode === key ? 'is-active' : ''} onClick={() => setMode(key)}>{item.label}</button>
              ))}
            </div>
            <button type="button" className="viewportPreviewClose" onClick={() => setOpen(false)} aria-label="关闭设备预览">×</button>
          </div>
          <div className={`viewportPreviewStage viewportPreviewStage--${mode}`}>
            <div className="viewportPreviewFrame" style={{ width: activeMode.width, height: activeMode.height }}>
              <iframe ref={previewFrameRef} title={`${activeMode.label}网页预览`} src={previewUrl()} />
              {mode === 'portrait' ? (
                <button
                  type="button"
                  className="viewportPreviewBackToTop"
                  aria-label="回到手机预览顶部"
                  onClick={() => previewFrameRef.current?.contentWindow?.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 18V6M7.5 10.5 12 6l4.5 4.5" /></svg>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function FirstNavDepthBrand({ condensed = false }) {
  return (
    <DepthText
      text={condensed ? 'JS' : 'JS 嘉盛'}
      layers={14}
      depth={1.35}
      faceColor="#ffffff"
      depthColor="#ee4f16"
      tilt={3.5}
      pointerTracking
      smoothing={0.13}
      perspective={950}
      autoOrbit
      orbitSpeed={0.18}
      fontSize="clamp(0.95rem, 2.1vw, 1.2rem)"
      fontWeight={900}
      shadow
      className="firstNavDepthText secondaryNavDepthText"
    />
  )
}

function Navigation() {
  const [navState, setNavState] = useState('full')
  const [navCopy, setNavCopy] = useState(null)

  useEffect(() => {
    const header = document.querySelector('.siteHeader.jsHero')
    const hero = document.querySelector('#top')
    if (!header || !hero) return undefined

    // Keep the fixed masthead in step with every in-flow rail. The original
    // hand-off list stopped at level 4, so the card wall, selected works, and
    // contact rails never got the same expand → compact animation.
    const rails = [
      { key: 'media', level: 2, sectionSelector: '#media', zh: '专业领域', en: 'EXPERTISE' },
      { key: 'third-project', level: 3, sectionSelector: '#third-project', zh: '从三维设计到真实成片', en: 'Concept | Final' },
      { key: 'zero-one-hundred', level: 4, sectionSelector: '#zero-one-hundred', zh: '从 0 到 1 到 100', en: 'FROM 0 TO 100' },
      { key: 'cards', level: 5, sectionSelector: '#cards', zh: '全程协同，精准交付', en: 'COORDINATE · DELIVER' },
      { key: 'concept-final', level: 6, sectionSelector: '#concept-final', zh: '作品延展', en: 'SELECTED WORKS' },
      { key: 'contact', level: 7, sectionSelector: '#contact', zh: '联系合作', en: 'CONTACT WITH ME' },
    ]
      .map((item) => ({ ...item, section: document.querySelector(item.sectionSelector) }))
      .filter((item) => item.section)

    let lastState = 'full'
    let lastCopyKey = ''
    const update = () => {
      const headerBottom = header.getBoundingClientRect().bottom
      const heroRect = hero.getBoundingClientRect()
      const heroProgress = (window.scrollY + headerBottom - (window.scrollY + heroRect.top)) / Math.max(heroRect.height, 1)
      let activeRail = null
      rails.forEach((rail) => {
        if (rail.section.getBoundingClientRect().top <= headerBottom) activeRail = rail
      })

      const activeRect = activeRail?.section.getBoundingClientRect()
      const activeProgress = activeRect
        ? (headerBottom - activeRect.top) / Math.max(activeRect.height, 1)
        : 0
      // Do not widen the JS mark when the next panel merely enters view. It
      // changes only when that panel reaches the fixed rail itself.
      const nextState = activeRail
        ? activeProgress >= 1 / 3 ? 'condensed' : 'expanded'
        : heroProgress >= 1 / 3 ? 'condensed' : 'full'
      const nextCopy = nextState === 'expanded' ? activeRail : null
      const nextCopyKey = nextCopy ? nextCopy.key : ''
      if (nextState !== lastState || nextCopyKey !== lastCopyKey) {
        lastState = nextState
        lastCopyKey = nextCopyKey
        setNavState(nextState)
        setNavCopy(nextCopy)
      }
    }

    return subscribeToViewport(update)
  }, [])

  return (
    <header className={`siteHeader editorialHero jsHero${navState === 'condensed' ? ' is-condensed' : ''}${navState === 'expanded' ? ' is-expanded' : ''}${navCopy?.level ? ` is-level-${navCopy.level}` : ''}`}>
      <nav className="nav shell">
        {navState === 'expanded' ? (
          <div className="navMergeCopy" aria-label={`${navCopy?.zh || ''} ${navCopy?.en || ''}`}>
            <span>{navCopy?.zh}</span>
            <span>{navCopy?.en}</span>
          </div>
        ) : (
          <>
            <a className="brand firstNavDepthBrand" href="#top">
              <FirstNavDepthBrand condensed={navState === 'condensed'} />
            </a>
            <div className="navLinks">
              <a href="#media">领域</a>
              <a href="#third-project">优势</a>
              <a href="#concept-nav">扩展</a>
              <a href="#contact-nav">合作</a>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}

function MotionDirector() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 700px)').matches
    const context = gsap.context(() => {
      const curtain = document.querySelector('.heroOpeningCurtain')
      const heroTitle = document.querySelector('.heroTitle')
      const heroTitleBlock = document.querySelector('.heroTitleBlock')
      const heroPortrait = document.querySelector('.heroPortrait')
      const heroRole = document.querySelector('.heroRoleStrip')
      const heroStatement = document.querySelector('.heroStatement')

      if (reduceMotion) {
        gsap.set([curtain, heroTitle, heroTitleBlock, heroPortrait, heroRole, heroStatement], { clearProps: 'all' })
        if (curtain) curtain.setAttribute('aria-hidden', 'true')
        return
      }

      if (isMobile) {
        // The phone preview is a scroll surface, not an intro animation. A
        // paused/hidden tab can leave the opening timeline at opacity:0, so
        // keep the complete lockup visible and let the user scroll immediately.
        gsap.set([heroTitle, heroTitleBlock, heroPortrait, heroRole, heroStatement], {
          clearProps: 'transform,opacity,clipPath,willChange',
          opacity: 1,
        })
        gsap.set(curtain, { autoAlpha: 0, clearProps: 'transform,willChange,clipPath' })
        if (curtain) curtain.setAttribute('aria-hidden', 'true')
      } else {
        const opening = gsap.timeline({ defaults: { ease: 'power4.out' } })
        opening
          .set([heroTitle, heroTitleBlock, heroPortrait, heroRole, heroStatement], { willChange: 'transform, opacity, clip-path' })
          .fromTo(curtain, { scaleY: 1, transformOrigin: 'top' }, { scaleY: 0, duration: 1.35, ease: 'power4.inOut' })
          .fromTo(heroTitleBlock, { x: -90, opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.05 }, '-=.72')
          .fromTo(heroTitle, { y: 54, scaleX: 1.16, scaleY: .86, transformOrigin: 'left bottom' }, { y: 0, scaleX: .78, scaleY: 1, duration: 1.25, ease: 'expo.out' }, '-=.82')
          .fromTo(heroPortrait, { y: 42, scale: 1.08, clipPath: 'inset(0 0 100% 0)' }, { y: 0, scale: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.35, ease: 'power4.inOut' }, '-=1.08')
          .fromTo(heroRole, { y: -28, opacity: 0, scaleX: .72 }, { y: 0, opacity: 1, scaleX: 1, duration: .7, ease: 'back.out(1.4)' }, '-=.7')
          .fromTo(heroStatement, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: .75 }, '-=.45')
          .set([heroTitle, heroTitleBlock, heroPortrait, heroRole, heroStatement], { clearProps: 'willChange,clipPath' })
      }

      const sections = gsap.utils.toArray('.mediaGallery, .domeGallerySection, .driftWallSection, .cardSwapSection, .about, .projects, .strengths, .processSection, .contactFinal')
      sections.forEach((section) => {
        const label = section.querySelector('.sectionLabel')
        const heading = section.querySelector('h2')
        // CardSwap owns its own 3D positioning timeline. Do not hide those
        // cards in the generic section reveal, otherwise a fast scroll can
        // skip the trigger and leave the stack invisible.
        const cards = section.querySelectorAll('.projectCard, .strengthCard, .processCard, .resumeCard, .drift-wall__tile')

        // Touch scrolling can skip over a ScrollTrigger start position in a
        // single gesture. Keep mobile content immediately visible so a fast
        // swipe can never leave a section stranded at opacity: 0.
        const animatedNodes = [label, heading, ...cards].filter(Boolean)
        if (isMobile) {
          if (animatedNodes.length) gsap.set(animatedNodes, { clearProps: 'all', opacity: 1 })
          return
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            once: true,
          },
        })

        if (label) timeline.fromTo(label, { x: -80, opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: .9, ease: 'power4.out' }, 0)
        if (heading) timeline.fromTo(heading, { y: 58, opacity: 0, scale: .92, transformOrigin: 'left bottom' }, { y: 0, opacity: 1, scale: 1, duration: 1.15, ease: 'expo.out' }, '<.08')
        if (cards.length) timeline.fromTo(cards, { y: 80, opacity: 0, scale: .94, rotateX: 7, transformOrigin: 'center bottom' }, { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.05, stagger: .12, ease: 'power3.out', clearProps: 'transform,opacity' }, '-=.55')
      })

      if (!isMobile) {
        const parallaxImages = gsap.utils.toArray('.projectImage, .resumeCardPortrait img, .swapCardMedia img, .drift-wall__inner img, .accordion-gallery img')
        parallaxImages.forEach((image) => {
          const trigger = image.closest('section') || image
          gsap.fromTo(image, { yPercent: -4, scale: 1.055 }, { yPercent: 4, scale: 1.015, ease: 'none', scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: 1.25 } })
        })
      }

      ScrollTrigger.refresh()
    })

    return () => context.revert()
  }, [])

  return null
}

function Hero() {
  return (
    <section className="hero editorialHero jsHero" id="top">
      <div className="heroPoster shell">
        <div className="heroOpeningCurtain" aria-hidden="true"><span /><i /></div>
        <div className="heroDots" />
        <div className="heroSerial">001</div>
        <div className="heroOrangeBand" />
        <div className="heroOrangeBlock" />
        <div className="heroPortrait" aria-label="个人照片素材">
          <div className="heroRoleStrip">
            <span>DESIGN-BUILDER</span>
            <i className="heroRoleMark" aria-hidden="true" />
          </div>
          <TiltedCard
             imageSrc="/optimized/portrait-current.jpg"
            altText="嘉盛的美术设计师个人照片"
            containerWidth="100%"
            containerHeight="100%"
            imageWidth="100%"
            imageHeight="100%"
            scaleOnHover={1.02}
            rotateAmplitude={8}
          />
          <div className="heroJsBox" aria-label="JS 个人标识">JS</div>
        </div>

        <div className="heroTitleBlock">
          <h1 className="heroTitle">
            <i className="heroDesignWord">
              <b className="heroDesignMeasure" aria-hidden="true">DESIGN</b>
              <TechText
                text="DESIGN"
                fontFamily='"Bahnschrift Condensed", "Arial Narrow", "Helvetica Neue", Arial, sans-serif'
                fontWeight={990}
                fontSize={1000}
                letterSpacing={-0.08}
                color="#1b1b19"
                accentColor="#ee3f12"
                reveal="letter"
                dashLength={4}
                dashGap={2}
                specks={15}
                selection
                labels
                draggable={false}
                sweep
                speed={0.85}
                className="heroDesignTechText"
              />
            </i>
            <span>BUILD</span>
          </h1>
          <div className="heroCreatorLockup" aria-label="Visual Creator">
            <div className="heroVisualCreator" aria-label="Visual Creator">
              <i className="heroVisualCreatorMark" aria-hidden="true" />
              <span className="heroVisualCreatorLabel">VISUAL CREATOR</span>
            </div>
          </div>
          <p className="heroChineseSlogan">
            <span className="heroChineseWord"><i>设</i><i className="heroChineseChar--offset">计</i></span>
            <strong className="heroChineseWord"><i>营</i><i className="heroChineseChar--offset">造</i></strong>
          </p>
        </div>

        <aside className="heroVisualCreator heroConceptCreator" aria-label="Concept to Set, Frame by Frame">
          <i className="heroVisualCreatorMark" aria-hidden="true" />
          <span className="heroVisualCreatorLabel">
            <span>CONCEPT TO SET</span>
            <span>FRAME BY FRAME</span>
          </span>
        </aside>
        <aside className="heroStatement" aria-label="创作理念">
          <p>从概念到现场 打磨每一帧</p>
        </aside>

        <div className="heroInfoPanel">
          <span className="panelLine" />
          <p>Personal resume website for art direction, visual systems and spatial storytelling.</p>
        </div>

        <div className="heroResumeTag">
          <strong>美术视觉设计师</strong>
          <span>Film Art · Scene · Stage · Exhibition · Pop-up · 3D · Graphic · AI · Web Design</span>
          <em>影视美术 · 场景 · 舞台 · 展馆 · 快闪 · 三维 · 平面 · AI · 网站设计</em>
        </div>
        <div className="scrollHint">SCROLL TO EXPLORE</div>
      </div>
    </section>
  )
}

function ThirdProject() {
  return (
    <section className="thirdProjectSection halftoneSection section" id="third-project" aria-label="三维设计与现场实拍对照">
      <div className="shell">
        <SectionNav level={3} className="tertiarySiteHeader" zh="从三维设计到真实成片" en="Concept | Final" />
        <HalftoneReveal
          firstImage="/third-project-live-desktop-layout2.jpg"
          secondImage="/third-project-3d-desktop-layout2.jpg"
          mobileFirstImage="/third-project-live-mobile.jpg"
          mobileSecondImage="/third-project-3d-mobile.jpg"
          firstLabel="FINAL SHOT"
          secondLabel="3D DESIGN"
          firstAlt="三组项目的现场实拍拼图"
          secondAlt="三组项目的三维设计拼图"
        />
        <div className="thirdProjectStatement">
          <TrueFocus
            sentence="让设计不止停在图上｜落地还原度｜90%+"
            blurAmount={1.25}
            borderColor="#ee4f16"
            glowColor="rgba(238, 79, 22, .45)"
            animationDuration={.55}
            pauseBetweenAnimations={1.4}
          />
          <p className="thirdProjectStatementEn">BEYOND THE IMAGE · 90%+ ON-SITE FIDELITY</p>
        </div>
      </div>
    </section>
  )
}

function ZeroToHundred() {
  const stages = [
    { key: 'story', label: '0 / STORYBOARD', copy: '草图分镜', src: '/optimized/zero-storyboard-shot01.jpg', alt: '咖啡馆场景分镜图' },
    { key: 'design', label: '1 / 3D', copy: '三维设计', src: '/optimized/zero-3d.jpg', alt: '项目三维设计图' },
    { key: 'live', label: '100 / FINAL', copy: '现场成片', src: '/optimized/zero-live.jpg', alt: '项目现场画面' },
  ]
  const [stageIndex, setStageIndex] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const reduceMotion = useReducedMotion()
  const advance = () => setStageIndex((index) => (index + 1) % stages.length)
  const advanceManually = () => {
    setHasInteracted(true)
    advance()
  }

  useEffect(() => {
    if (hasInteracted || reduceMotion) return undefined
    const timer = window.setInterval(advance, 3600)
    return () => window.clearInterval(timer)
  }, [hasInteracted, reduceMotion])

  const activeStage = stages[stageIndex]

  return (
    <section className="section zeroOneSection" id="zero-one-hundred" aria-label="从零到一到一百的项目过程">
      <div className="shell">
        <SectionNav level={4} className="secondarySiteHeader" zh="从 0 到 1 到 100" en="FROM 0 TO 100" />
        <div
          className="zeroOneFlip"
          role="button"
          tabIndex={0}
          aria-label="点击或轻触，依次查看草图、三维设计和现场成片"
          onClick={advanceManually}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              advanceManually()
            }
          }}
        >
          <div className="zeroOneFlipViewport">
            <AnimatePresence mode="sync" initial={false}>
              <motion.figure
                key={activeStage.key}
                className="zeroOneFlipCard"
                initial={reduceMotion ? { opacity: 0 } : { x: '105%', rotate: 7, scale: .94, opacity: .55 }}
                animate={reduceMotion ? { opacity: 1 } : { x: 0, rotate: 0, scale: 1, opacity: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { x: '-58%', rotate: -5, scale: .98, opacity: 0 }}
                transition={{ duration: reduceMotion ? .22 : .58, ease: [0.22, 0.8, 0.2, 1] }}
              >
                <img src={activeStage.src} alt={activeStage.alt} loading="lazy" decoding="async" />
                <div className="zeroOneFlipShade" aria-hidden="true" />
                <span className="zeroOneFlipStage">{activeStage.label}</span>
                <strong className="zeroOneFlipName">
                  <span>{activeStage.copy}</span>
                  <em>{activeStage.label.replace(/^\d+\s*\/\s*/, '')}</em>
                </strong>
                <span className="zeroOneFlipHint">
                  <span className="zeroOneFlipHintCn">点击切换</span>
                  <span className="zeroOneFlipHintEn">TAP FOR NEXT</span>
                </span>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="zeroOneFlipSteps" aria-hidden="true">
            {stages.map((stage, index) => <span key={stage.key} className={index === stageIndex ? 'is-active' : ''}>{stage.label}</span>)}
          </div>
          <p className="zeroOneFlipCopy">
            <BilingualCopy en="8 YEARS OF ART DIRECTION, FROM IDEA TO SET.">
              8年美术师经验，让构想长成现场。
            </BilingualCopy>
          </p>
        </div>
      </div>
    </section>
  )
}

function IdentityReveal() {
  const [progress, setProgress] = useState(0)
  const [hovered, setHovered] = useState(false)
  const pointerRef = useRef({ id: null, startX: 0, startProgress: 0, moved: false, touch: false })
  const revealProgress = hovered ? 1 : progress

  const setFromPointer = (event) => {
    const node = event.currentTarget
    const width = node.getBoundingClientRect().width || 1
    const delta = (pointerRef.current.startX - event.clientX) / width
    setProgress(Math.max(0, Math.min(1, pointerRef.current.startProgress + delta)))
    pointerRef.current.moved = true
  }

  const onPointerDown = (event) => {
    pointerRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startProgress: progress,
      moved: false,
      touch: event.pointerType === 'touch',
    }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (pointerRef.current.id !== event.pointerId) return
    if (pointerRef.current.touch) setFromPointer(event)
  }

  const finishPointer = (event) => {
    if (pointerRef.current.id !== event.pointerId) return
    const { moved, touch } = pointerRef.current
    if (touch && moved) setProgress((value) => (value > .38 ? 1 : 0))
    pointerRef.current.id = null
  }

  const toggleWithClick = () => {
    if (pointerRef.current.moved) {
      pointerRef.current.moved = false
      return
    }
    setProgress((value) => (value > .5 ? 0 : 1))
  }

  return (
    <section className="identityRevealSection" id="identity" aria-label="设计师身份展示">
      <SectionNav level={4} className="tertiarySiteHeader" />
      <div className="identityRevealSticky shell">
        <div
          className={`identityRevealFrame${revealProgress > .5 ? ' is-revealed' : ''}`}
          style={{ '--identity-reveal-progress': `${revealProgress * 100}%` }}
          tabIndex={0}
          role="button"
          aria-label="悬停或滑动查看项目落地执行"
          onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(true) }}
          onPointerLeave={(event) => { if (event.pointerType === 'mouse') setHovered(false) }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishPointer}
          onPointerCancel={finishPointer}
          onClick={toggleWithClick}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setProgress((value) => (value > .5 ? 0 : 1))
            }
          }}
        >
          <div className="identityRevealImage identityRevealImage--first">
            <img src="/hero-js-5.jpg" alt="美术视觉设计工作影像" loading="lazy" decoding="async" />
          </div>
          <div className="identityRevealImage identityRevealImage--second" aria-hidden={revealProgress <= .5}>
            <img src="/hero-js-2.jpg" alt="项目落地执行影像" loading="lazy" decoding="async" />
          </div>
          <div className="identityRevealShade" aria-hidden="true" />
          <div className="identityRevealMeta">
            <span>02 / DESIGNER IDENTITY</span>
            <span>HOVER / SWIPE TO REVEAL</span>
          </div>
          <div className="identityRevealCopy identityRevealCopy--first" style={{ opacity: 1 - revealProgress, transform: `translateY(${-42 * revealProgress}px)` }}>
            <p>VISUAL DESIGNER / EXPERIENCE</p>
            <h2 className="bilingualHeading">8年美术视觉设计经验 <span className="headingEn">EXPERIENCE</span></h2>
          </div>
          <div className="identityRevealCopy identityRevealCopy--second" style={{ opacity: revealProgress, transform: `translateY(${42 * (1 - revealProgress)}px)` }}>
            <p>FROM CONCEPT TO DELIVERY</p>
            <h2 className="bilingualHeading">完整的项目落地与执行 <span className="headingEn">DELIVERY</span></h2>
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionNav({ level = 2, className = '', zh = '从三维设计到真实成片', en = 'Concept | Final', id = '', children }) {
  const navRef = useRef(null)
  const [condensed, setCondensed] = useState(false)
  const [superseded, setSuperseded] = useState(false)

  useEffect(() => {
    const node = navRef.current
    const section = node?.closest('section')
    if (!node || !section) return undefined

    const update = () => {
      const rect = section.getBoundingClientRect()
      const fixedHeader = document.querySelector('header.siteHeader.jsHero:not([data-section-nav-level])')
      const headerBottom = fixedHeader?.getBoundingClientRect().bottom || 68
      const nextRail = document.querySelector(`[data-section-nav-level="${level + 1}"]`)
      const nextSection = nextRail?.closest('section')
      const reachedFixedRail = level === 7 ? false : rect.top <= headerBottom
      // This in-flow rail stays visible until it physically reaches the
      // fixed rail. The fixed rail then becomes this same title, so there is
      // never a duplicated long bar or a duplicated JS badge.
      setCondensed((current) => (current ? false : current))
      setSuperseded((current) => (current === reachedFixedRail ? current : reachedFixedRail))
    }

    update()
    return subscribeToViewport(update)
  }, [level])

  useEffect(() => {
    const body = document.body
    const key = `sectionNav${level}`
    body.dataset[key] = condensed ? 'condensed' : 'full'
    body.dataset[`${key}Superseded`] = superseded ? 'true' : 'false'
    const activeLevels = [2, 3, 4].filter((item) => body.dataset[`sectionNav${item}`] === 'condensed' && body.dataset[`sectionNav${item}Superseded`] !== 'true')
    if (activeLevels.length) body.dataset.activeSectionNav = String(Math.max(...activeLevels))
    else delete body.dataset.activeSectionNav
    window.dispatchEvent(new Event('section-nav-state-change'))
    return () => {
      delete body.dataset[key]
      delete body.dataset[`${key}Superseded`]
      const remaining = [2, 3, 4].filter((item) => body.dataset[`sectionNav${item}`] === 'condensed' && body.dataset[`sectionNav${item}Superseded`] !== 'true')
      if (remaining.length) body.dataset.activeSectionNav = String(Math.max(...remaining))
      else delete body.dataset.activeSectionNav
      window.dispatchEvent(new Event('section-nav-state-change'))
    }
  }, [condensed, superseded, level])

  return (
    <div ref={navRef} id={id || undefined} data-section-nav-level={level} className={`sectionNav siteHeader editorialHero jsHero ${className}${condensed ? ' is-condensed' : ''}${superseded ? ' is-superseded' : ''}`} aria-label={`第${level}版面导航栏`}>
      <nav className="nav shell">
        {condensed ? (
          <span className="sectionNavCollapsedMark" aria-label="JS">
            <DepthText
              text="JS"
              layers={14}
              depth={1.35}
              faceColor="#ffffff"
              depthColor="#ee4f16"
              tilt={3.5}
              pointerTracking
              smoothing={0.13}
              perspective={950}
              autoOrbit
              orbitSpeed={0.18}
              fontSize="clamp(0.95rem, 2.1vw, 1.2rem)"
              fontWeight={900}
              shadow
              className="sectionNavCollapsedDepthText secondaryNavDepthText"
            />
          </span>
        ) : (
          <div className="secondaryNavCopy sectionNavCopy" aria-label={`${zh} ${en}`}>
            <span className="secondaryNavCopyZh secondaryNavDepthWrap" aria-label={zh}>
              <DepthText text={zh} layers={14} depth={1.35} faceColor="#ffffff" depthColor="#ee4f16" tilt={3.5} pointerTracking smoothing={0.13} perspective={950} autoOrbit orbitSpeed={0.18} fontSize="clamp(0.95rem, 2.1vw, 1.2rem)" fontWeight={900} shadow className="secondaryNavDepthText" />
            </span>
            <span className="secondaryNavCopyEn secondaryNavDepthWrap" aria-label={en}>
              <DepthText text={en} layers={14} depth={1.35} faceColor="#ffffff" depthColor="#ee4f16" tilt={3.5} pointerTracking smoothing={0.13} perspective={950} autoOrbit orbitSpeed={0.18} fontSize="clamp(0.78rem, 1.65vw, 0.95rem)" fontWeight={900} shadow className="secondaryNavDepthText" />
            </span>
          </div>
        )}
        {children}
      </nav>
    </div>
  )
}

function ConceptToFinal() {
  const items = selectedWorks.map((work) => (
    <article
      key={work.index}
      className={`workflowGridTile workflowGridTile--image workflowGridTile--${work.tone} workflowGridTile--${work.layout}`}
      style={{ '--workflow-image': `url("${work.image}")` }}
    >
      <span className="workflowGridIndex">{work.index}</span>
      <strong>{work.title}</strong>
      {work.subtitle ? <p>{work.subtitle}</p> : null}
    </article>
  ))

  return (
    <section className="halftoneSection selectedWorksSection section" id="concept-final" aria-label="作品延展">
      <div className="shell">
        <SectionNav id="concept-nav" level={6} className="secondarySiteHeader" zh="作品延展" en="SELECTED WORKS" />
        <GridMotion items={items} gradientColor="#e45830" />
        <p className="selectedWorksSlogan">
          <BilingualCopy en="DIFFERENT PROJECTS. DIVERSE DESIGN. DISTINCT RESULTS.">
            <span className="selectedWorksSloganZhText">不同项目，不同需求，多样设计，多元呈现。</span>
          </BilingualCopy>
        </p>
      </div>
    </section>
  )
}

function MediaGallery() {
  const sectionRef = useRef(null)
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const [zoomedMediaIndex, setZoomedMediaIndex] = useState(null)
  const activeMedia = flexMediaItems[activeMediaIndex] || flexMediaItems[0]
  const zoomedMedia = zoomedMediaIndex === null ? null : flexMediaItems[zoomedMediaIndex]

  useEffect(() => {
    if (zoomedMediaIndex === null) return undefined
    document.body.classList.add('media-lightbox-open')
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setZoomedMediaIndex(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('media-lightbox-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [zoomedMediaIndex])

  useEffect(() => {
    const header = document.querySelector('.siteHeader')
    const onScroll = () => {
      const el = sectionRef.current?.querySelector('.mediaSiteHeader')
      if (!el) return
      const navHeight = header ? header.offsetHeight : 96
      document.body.classList.toggle(
        'gallery-in-view',
        el.getBoundingClientRect().top <= navHeight
      )
    }
    const unsubscribe = subscribeToViewport(onScroll)
    return () => {
      unsubscribe()
      document.body.classList.remove('gallery-in-view')
    }
  }, [])

  return (
    <section className="section mediaGallery" id="media" ref={sectionRef}>
      <SectionNav
        level={2}
        className="mediaSiteHeader"
        zh="专业领域"
        en="EXPERTISE"
      />
      <div className="shell mediaGalleryCarouselShell">
        <div className="mediaGalleryImageMeta" aria-live="polite">
          <span className="mediaGalleryImageCategory">{activeMedia?.subtitle}</span>
          <strong className="mediaGalleryImageTitle">{activeMedia?.title}</strong>
        </div>
        <div className="mediaFlexCarouselFrame">
          <FlexCarousel
            items={flexMediaItems}
            preset="ribbon"
            intro="rise"
              cardHeight={0.88}
            gap={12}
              radius={26}
            focusOnClick={false}
            captions={false}
            lensWidth={0.86}
            tilt={0}
            bend={0}
            reach={0}
            dispersion={0}
            squeeze={0}
            captureWheel={false}
            onChange={(index) => setActiveMediaIndex(index)}
            onSelect={(index) => setZoomedMediaIndex(index)}
            autoplay
          />
        </div>
      </div>
      <div className="shell">
        <p className="zeroOneFlipCopy mediaGalleryBottomCopy">
          <BilingualCopy en="VERSATILE SKILLS, CREATIVE SOLUTIONS.">
            多元能力协同，回应不同创作需求。
          </BilingualCopy>
        </p>
      </div>
      {zoomedMedia ? createPortal(
        <div
          className="mediaImageLightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${zoomedMedia.title} 大图`}
          onClick={() => setZoomedMediaIndex(null)}
        >
          <div className="mediaImageLightboxCard">
            <button
              type="button"
              className="mediaImageLightboxClose"
              aria-label="收起大图"
              onClick={() => setZoomedMediaIndex(null)}
            >
              ×
            </button>
            <img
              src={zoomedMedia.src}
              alt={zoomedMedia.alt || zoomedMedia.title}
              onClick={() => setZoomedMediaIndex(null)}
            />
            <div className="mediaImageLightboxMeta">
              <strong>{zoomedMedia.title}</strong>
              <span>{zoomedMedia.subtitle}</span>
            </div>
          </div>
        </div>
      , document.body) : null}
    </section>
  )
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="shell aboutGrid">
        <div className="portraitCard">
          <div className="portraitGlow" />
          <div className="portraitFigure">
            <div className="head" />
            <div className="body" />
            <div className="scanLine" />
          </div>
          <span>PROFILE IMAGE / AVATAR</span>
        </div>
        <div className="aboutContent">
          <p className="sectionLabel">DESIGNER IDENTITY</p>
          <h2>视觉设计师，连接概念、技术与最终落地。</h2>
          <p className="aboutText">{profile.intro}</p>
          <div className="contactRows">
            <span>{profile.email}</span>
            <span>{profile.phone}</span>
            <span>{profile.location}</span>
          </div>
          <div className="statsGrid">
            {stats.map((item) => (
              <div className="stat" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section className="section projects" id="projects">
      <div className="shell">
        <div className="sectionHead">
          <div>
            <p className="sectionLabel">SELECTED WORKS</p>
            <h2>精选项目</h2>
          </div>
          <p>当前为基础占位版本，后续可替换为你的真实作品图、视频与项目详情。</p>
        </div>
        <div className="projectGrid">
          {projects.map((project, index) => (
            <article className={`projectCard ${project.tone}`} key={project.title}>
              <div className="projectImage">
                <div className="orb one" />
                <div className="orb two" />
                <div className="projectIndex">0{index + 1}</div>
              </div>
              <div className="projectMeta">
                <span>{project.type}</span>
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Strengths() {
  return (
    <section className="section strengths" id="strengths">
      <div className="shell">
        <p className="sectionLabel">CAPABILITY</p>
        <h2>个人优势</h2>
        <div className="strengthGrid">
          {strengths.map((item, index) => (
            <article className="strengthCard" key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="section processSection" id="process">
      <div className="shell">
        <div className="processHead">
          <div>
            <p className="sectionLabel">PROJECT PROCESS</p>
            <h2 className="bilingualHeading">项目流程 <span className="headingEn">PROCESS</span></h2>
          </div>
          <p>
            <BilingualCopy en="FROM A ROUGH IDEA TO A CLEAR, USABLE RESULT.">
              从一个模糊的想法开始，逐步把它变成可被看见、使用和传播的视觉成果。
            </BilingualCopy>
          </p>
        </div>
        <div className="processTrack">
          {processSteps.map((step) => (
            <PixelCard
              key={step.number}
              className="processCard"
              gap={8}
              speed={24}
              colors="#fff7ef,#ffc09b,#f05a1a"
            >
              <article className="processCardContent">
                <div className="processCardTopline">
                  <span>{step.number}</span>
                  <i aria-hidden="true" />
                  <small>{step.en}</small>
                </div>
                <h3>{step.title}</h3>
                <p><BilingualCopy en={step.textEn}>{step.text}</BilingualCopy></p>
                <div className="processCardArrow" aria-hidden="true">↗</div>
              </article>
            </PixelCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [wechatOpen, setWechatOpen] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)

  return (
    <section className="contactFinal" id="contact">
      <div className="contactFinalStack">
        <div className="shell contactNavShell">
          <SectionNav id="contact-nav" level={7} className="secondarySiteHeader" zh="联系合作" en="CONTACT WITH ME" />
        </div>
        <div className="shell contactInner">
        <article className="resumeCard" aria-label={`${resumeCard.name}的个人简历卡片`}>
          <header className="resumeCardHeader">
            <div className="resumeCardStamp">
              <DepthText
                text={`${resumeCard.kicker} ${resumeCard.year}`}
                layers={14}
                depth={1.35}
                faceColor="#ffffff"
                depthColor="#ee4f16"
                tilt={3.5}
                pointerTracking
                smoothing={0.13}
                perspective={950}
                autoOrbit
                orbitSpeed={0.18}
                fontSize="clamp(1.445rem, 3.194vw, 1.825rem)"
                fontWeight={900}
                shadow
                className="resumeCardStampDepthText"
              />
            </div>
            <div className="resumeCardRail" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </header>

          <div className="resumeCardFrame">
            <div className="resumeCardPortraitColumn">
              <div className="resumeCardPortraitTilted" aria-label={`${resumeCard.name}的人物照片`}>
                <ProfileCard
                  className="resumeProfileCard"
                  avatarUrl={resumeCard.photo}
                  name=""
                  title=""
                  showUserInfo={false}
                  enableTilt
                  enableMobileTilt={false}
                  behindGlowEnabled
                  behindGlowColor="rgba(102, 210, 255, .42)"
                  behindGlowSize="42%"
                  innerGradient="linear-gradient(145deg, rgba(36,48,78,.32), rgba(238,79,22,.12))"
                />
              </div>
              <div className="resumeCardContactLinks" aria-label="联系入口">
                <a
                  className="resumeCardXinpianchang"
                  href="https://www.xinpianchang.com/u10864400?from=share&xpcApp=xpc&channel=wx&type=URL"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="打开新片场主页"
                >
                  <img className="resumeCardXinpianchangMark" src="/xinpianchang-logo-white.png" alt="新片场" />
                </a>
                <a
                  className="resumeCardWechat"
                  href="#wechat-qr"
                  onClick={(event) => {
                    event.preventDefault()
                    setWechatOpen((open) => !open)
                  }}
                  aria-expanded={wechatOpen}
                  aria-haspopup="dialog"
                  aria-label="打开微信二维码"
                >
                  <img className="resumeCardWechatIcon" src="/wechat-logo-white.png" alt="微信" />
                  {wechatOpen ? (
                    <span className="resumeCardWechatPopover" role="dialog" aria-label="微信二维码">
                      <img src="/wechat-qr.png" alt="微信二维码" />
                    </span>
                  ) : null}
                </a>
                <a
                  className="resumeCardMail"
                  href="#email-contact"
                  onClick={(event) => {
                    event.preventDefault()
                    setEmailOpen((open) => !open)
                  }}
                  aria-expanded={emailOpen}
                  aria-haspopup="dialog"
                  aria-label={`查看邮箱 ${resumeCard.email}`}
                >
                  <svg className="resumeCardMailIcon" viewBox="0 0 48 48" aria-hidden="true">
                    <rect x="5" y="9" width="38" height="30" rx="4" />
                    <path d="m7 13 17 14 17-14" />
                    <path d="m7 35 12-12M41 35 29 23" />
                  </svg>
                  <span className="resumeCardMailLabel">邮箱</span>
                  {emailOpen ? (
                    <span className="resumeCardEmailPopover" role="dialog" aria-label="邮箱地址">
                      {resumeCard.email}
                    </span>
                  ) : null}
                </a>
              </div>
            </div>

            <div className="resumeCardDetails">
              <p className="resumeCardIntro">
                {resumeCard.intro}
              </p>

              <dl className="resumeCardFacts">
                <div>
                  <dt>BASE</dt>
                  <dd>{resumeCard.location}</dd>
                </div>
                <div className="resumeCardLikeFact">
                  <PulseHeart
                    className="resumeCardLikeButton"
                    label="点赞"
                    count={672}
                    showCount
                    size={22}
                    likedColor="#ff7a3d"
                    idleColor="rgba(246,243,237,.58)"
                    pillColor="rgba(255,255,255,.045)"
                  />
                </div>
              </dl>
            </div>
          </div>

        </article>
      </div>
      </div>
    </section>
  )
}

function DomeGallerySection() {
  const sectionRef = useRef(null)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const header = document.querySelector('.siteHeader')
    const onScroll = () => {
      const el = sectionRef.current?.querySelector('.domeGalleryBar')
      if (!el) return
      const navHeight = header ? header.offsetHeight : 96
      document.body.classList.toggle('dome-in-view', el.getBoundingClientRect().top <= navHeight)
    }
    const unsubscribe = subscribeToViewport(onScroll)
    return () => {
      unsubscribe()
      document.body.classList.remove('dome-in-view')
    }
  }, [])

  const allImages = selectedWorks.map((work) => ({ src: work.image, alt: work.title }))

  return (
    <section className="section domeGallerySection" id="dome" ref={sectionRef}>
      <div className="domeGalleryBar">
        <div className="shell domeGalleryBarInner">
          <div className="domeGalleryBarTitle">
            <p className="sectionLabel">DOME GALLERY</p>
            <h2 className="bilingualHeading">穹顶视图 <span className="headingEn">DOME</span></h2>
          </div>
          <div className="domeGalleryTabs" role="tablist" aria-label="作品分类">
            {['all', 'image', 'video'].map((tab) => (
              <SpecularButton
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={activeTab === tab ? 'is-active' : ''}
                size="sm"
                radius={999}
                tint="#ffffff"
                tintOpacity={0.12}
                blur={10}
                textColor="#673525"
                lineColor="#f05a1a"
                baseColor={activeTab === tab ? "#ffffff" : "#d4d2cb"}
                intensity={0.8}
                shineSize={10}
                shineFade={30}
                thickness={1.2}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' ? '全部' : tab === 'image' ? '图片' : '视频'}
              </SpecularButton>
            ))}
          </div>
        </div>
      </div>
      <div className="shell domeStage">
        <DomeGallery
          images={allImages}
          fit={0.71}
          fitBasis="auto"
          minRadius={320}
          maxRadius={2400}
          padFactor={0.08}
          segmentsX={14}
          segmentsY={14 * 16 / 9}
          maxVerticalRotationDeg={8}
          grayscale={false}
          openedImageWidth={null}
          openedImageHeight={null}
          imageBorderRadius="24px"
          openedImageBorderRadius="24px"
        />
      </div>
    </section>
  )
}

function DriftWallSection() {
  return (
    <section className="section driftWallSection" id="drift-wall">
      <div className="shell driftWallIntro">
        <div className="driftWallIntroTitle">
          <p className="sectionLabel">DRIFT WALL</p>
          <h2 className="bilingualHeading">漂移图墙 <span className="headingEn">DRIFT</span></h2>
        </div>
        <p className="driftWallIntroLead">
          <BilingualCopy en="PROJECT FRAGMENTS DRIFT; MOVE TO SHIFT THE VIEW.">
            作品切片以不同速度持续漂移，移动指针可以改变观看角度。
          </BilingualCopy>
        </p>
      </div>
      <div className="shell driftWallStage">
        <DriftWall
          items={driftWallItems}
          columns={5}
          tileWidth={244}
          tileHeight={137}
          gap={18}
          radius={18}
          tilt={11}
          turn={-9}
          perspective={1320}
          depth={110}
          speed={34}
          direction="up"
          variance={0.34}
          parallax={0.34}
          pauseOnHover={false}
          lift={54}
          fade={0.62}
          dim={0.72}
          overlayColor="#34231d"
        />
      </div>
    </section>
  )
}

function GridMotionSection() {
  const items = Array.from({ length: 28 }, (_, index) => {
    const phase = swapCards[index % swapCards.length]
    return (
      <article className={`workflowGridTile workflowGridTile--${phase.tone}`} key={`workflow-grid-${index}`}>
        <span className="workflowGridIndex">{phase.id}</span>
        <strong>{phase.label}</strong>
        <p>{phase.placeholder}</p>
      </article>
    )
  })

  return (
    <section className="section gridMotionSection" id="workflow-grid" aria-label="完整项目流程网格方案">
      <div className="shell">
        <SectionNav
          level={5}
          className="secondarySiteHeader"
          zh="全程协同，精准交付"
          en="COORDINATE · DELIVER"
        />
        <GridMotion items={items} gradientColor="#e45830" />
      </div>
    </section>
  )
}

function CardSwapSection() {
  return (
    <section className="section cardSwapSection" id="cards">
      <div className="shell">
        <SectionNav
          level={5}
          className="secondarySiteHeader"
          zh="全程协同，精准交付"
          en="COORDINATE · DELIVER"
        />
      </div>
      <div className="shell cardSwapGrid">
        <div className="cardSwapStage">
          <CardSwap
            width={426}
            height={682}
            cardDistance={22}
            verticalDistance={70}
            dropDistance={220}
            delay={3000}
            pauseOnHover
            skewAmount={1}
            easing="elastic"
          >
            {swapCards.map((card) => (
              <Card key={card.id} customClass="swapCard">
                <div className="swapCardBar">
                  <span className="swapCardBarDot" aria-hidden="true" />
                  <span className="swapCardBarLabel">{Number(card.id)}. {card.label}</span>
                  <span className="swapCardBarEn">{card.en}</span>
                </div>
                <SwapCardMedia card={card} />
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
      <div className="shell">
        <p className="zeroOneFlipCopy cardSwapCopyBelow">
          <BilingualCopy en="FROM BRIEF TO DELIVERY, ALWAYS ON TRACK.">
            从需求梳理到最终交付，项目全程有序可控。
          </BilingualCopy>
        </p>
      </div>
    </section>
  )
}

function SwapCardMedia({ card }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const startVideo = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    const started = video.play()
    if (started && typeof started.then === 'function') {
      started.then(() => setPlaying(true)).catch(() => {})
    } else {
      setPlaying(true)
    }
  }

  const stopVideo = () => {
    const video = videoRef.current
    setPlaying(false)
    if (!video) return
    video.pause()
    video.currentTime = 0
  }

  return (
    <div className={`swapCardMedia${card.image && card.placeholder ? ' swapCardMedia--withCopy' : ''}${card.id === '05' ? ' swapCardMedia--softPoster' : ''}`} onMouseEnter={startVideo} onMouseLeave={stopVideo}>
      {card.image ? (
        <img className="swapCardPoster" src={card.image} alt={card.label} loading="lazy" decoding="async" />
      ) : card.placeholder ? (
        <div className={`swapCardPlaceholder swapCardPlaceholder--${card.tone}`} aria-label={`${card.label}素材占位`}>
          <span className="swapCardPlaceholderGrid" aria-hidden="true" />
          <strong>{card.label}</strong>
          <p><BilingualCopy en={card.placeholderEn}>{card.placeholder}</BilingualCopy></p>
          <em>素材待加入</em>
        </div>
      ) : null}
      {card.image && card.placeholder ? (
        <div className="swapCardImageCopy" aria-label={`${card.label}说明`}>
          <strong>{card.label}</strong>
          <p><BilingualCopy en={card.placeholderEn}>{card.placeholder}</BilingualCopy></p>
        </div>
      ) : null}
      {card.video ? (
        <>
          <video
            ref={videoRef}
            className={playing ? 'is-playing' : ''}
            src={card.video}
            muted
            loop
            playsInline
            preload="metadata"
          />
          <span className="swapCardHint">悬停播放</span>
        </>
      ) : null}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)













