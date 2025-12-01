import type { InputProps } from '../../types'

export const Input = ({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  disabled = false,
  error = '',
  label = '',
  className = '',
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`
          px-3 py-2 rounded border text-sm
          ${error ? 'border-red-500' : 'border-gray-300 focus:border-pond-blue'}
          ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white text-black'}
          focus:outline-none focus:ring-1 focus:ring-pond-blue/50
          ${className}
        `}
      />
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  )
}
