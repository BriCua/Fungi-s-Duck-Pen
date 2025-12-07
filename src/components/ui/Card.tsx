import type { CardProps } from '../../types'

export const Card = ({ children, className, onClick }: CardProps) => {
  const baseClasses = 'rounded-lg shadow';
  
  return (
    <div
      className={`${baseClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
