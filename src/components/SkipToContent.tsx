// src/components/SkipToContent.tsx
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        background: '#fff',
        color: '#222',
        padding: '0.5em 1em',
        zIndex: 1000,
        transform: 'translateY(-120%)',
        transition: 'transform 0.2s',
      }}
      onFocus={e => (e.currentTarget.style.transform = 'translateY(0)')}
      onBlur={e => (e.currentTarget.style.transform = 'translateY(-120%)')}
      className="skip-to-content"
    >
      Skip to main content
    </a>
  );
}
