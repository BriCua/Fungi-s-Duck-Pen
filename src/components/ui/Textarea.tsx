interface TextareaProps {
  id?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
  rows?: number;
}

export const Textarea = ({
  id,
  placeholder = '',
  value = '',
  onChange,
  disabled = false,
  error = '',
  label = '',
  className = '',
  rows = 4,
}: TextareaProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-700 uppercase tracking-wide font-fredoka">
          {label}
        </label>
      )}
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        rows={rows}
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
