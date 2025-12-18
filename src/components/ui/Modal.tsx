import  { useEffect } from 'react'; // Import useEffect
import ReactDOM from 'react-dom'; // Import ReactDOM
import type { ModalProps } from '../../types'

export const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
}: ModalProps) => {
  useEffect(() => {
    // Create element to portal into
    const el = document.createElement('div');
    document.body.appendChild(el);

    return () => {
      document.body.removeChild(el);
    };
  }, []);

  if (!isOpen) return null;

  const variantStyles: Record<string, string> = {
    info: 'border-blue-500',
    warning: 'border-yellow-500',
    danger: 'border-red-500',
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full border-l-4 ${variantStyles[variant]}`}>
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-black mb-4 font-fredoka">{title}</h2>
          <div className="text-gray-700 mb-6">
            {children}
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-black hover:bg-gray-300 transition-colors"
            >
              {cancelText}
            </button>
            {onConfirm && (
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-pond-blue text-white hover:bg-pond-blue-dark transition-colors"
              >
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body // Render directly into body
  )
}
