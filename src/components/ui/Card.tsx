import type { CardProps } from '../../types'

export const Card = ({ children, className, onClick }: CardProps) => {
  const baseClasses = 'p-6 bg-white rounded-lg shadow';
  
  return (
    <div
      className={`${baseClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
