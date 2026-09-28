import './SpecularButton.css';

export default function SpecularButton({
  children = 'Get Started', size = 'lg', radius = 18, tint = '#ffffff',
  tintOpacity = 0, blur = 0, textColor = '#f5f5f5', lineColor = '#ffffff',
  intensity = 1, disabled = false, onClick, className = '', type = 'button',
  as = 'button', ...rest
}) {
  const Element = as;
  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty('--sb-mx', `${Math.max(0, Math.min(100, x))}%`);
    event.currentTarget.style.setProperty('--sb-my', `${Math.max(0, Math.min(100, y))}%`);
    event.currentTarget.style.setProperty('--sb-hot-opacity', `${Math.max(.35, Math.min(1, intensity))}`);
  };
  const handlePointerLeave = (event) => {
    event.currentTarget.style.setProperty('--sb-hot-opacity', '0');
  };

  return (
    <Element
      {...(Element === 'button' ? { type, disabled } : {})}
      {...rest}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`specular-button specular-button--${size}${className ? ` ${className}` : ''}`}
      style={{
        ...rest.style,
        '--sb-radius': `${radius}px`, '--sb-tint': tint,
        '--sb-tint-opacity': tintOpacity, '--sb-blur': `${blur}px`,
        '--sb-text-color': textColor, '--sb-line-color': lineColor,
        '--sb-hot-opacity': 0
      }}
    >
      <span className="specular-button__fx" aria-hidden="true" />
      <span className="specular-button__label">{children}</span>
    </Element>
  );
}
