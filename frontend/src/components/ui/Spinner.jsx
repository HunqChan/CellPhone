export default function Spinner({ size = 'md', className = '' }) {
  return (
    <div
      className={`spinner ${size === 'lg' ? 'spinner-lg' : ''} ${className}`}
    />
  )
}

export function PageSpinner() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px',
      }}
    >
      <Spinner size="lg" />
    </div>
  )
}
