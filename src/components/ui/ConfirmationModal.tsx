import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full border-l-4 border-red-500">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-black mb-4 font-fredoka">{title}</h2>
          <div className="text-gray-700 mb-6">
            {message}
          </div>
          <div className="flex gap-3 justify-end">
            <Button onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button onClick={onConfirm} variant="danger">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
