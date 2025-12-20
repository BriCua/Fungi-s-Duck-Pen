import type { ButtonProps } from '../../types/ui'

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) => {
  const baseStyles = 'font-semibold rounded transition-colors duration-200 flex items-center justify-center gap-2 border-none cursor-pointer'

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#FFD700',
      color: '#FFF8DC',
    },
    secondary: {
      backgroundColor: '#4A90E2',
      color: '#FFFFFF',
    },
    tertiary: {
      backgroundColor: '#F8F9FA',
      color: '#000000',
      border: '1px solid #D1D5DB',
    },
    duckdark:{
      backgroundColor: '#FFB600',
      color: 'rgb(50, 50, 50)',
    },
    navy:{
      backgroundColor: '#1C54B0',
      color: '#FFFFFF',
    },
    danger: {
      backgroundColor: '#EF4444',
      color: '#FFFFFF',
    },
  }

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-2.5 text-base',
  }

  const style = variantStyles[variant] || variantStyles.primary

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
      className={`${baseStyles} ${sizeClasses[size]} ${className}`}
      onMouseEnter={(e) => {
        if (disabled) return
        const el = e.currentTarget
        if (variant === 'primary') el.style.backgroundColor = '#FFC700'
        if (variant === 'secondary') el.style.backgroundColor = '#2E5C8A'
      }}
      onMouseLeave={(e) => {
        if (disabled) return
        const el = e.currentTarget
        if (variant === 'primary') el.style.backgroundColor = '#FFD700'
        if (variant === 'secondary') el.style.backgroundColor = '#4A90E2'
      }}
    >
      {loading && <span className="animate-spin">⏳</span>}
      {children}
    </button>
  )
}
