import bebekz1 from '../../assets/images/bebekz-1.webp';

export const Spinner = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={bebekz1}
        alt="Loading..."
        className={`${sizeClasses[size]} animate-subtle-float`}
      />
    </div>
  )
}