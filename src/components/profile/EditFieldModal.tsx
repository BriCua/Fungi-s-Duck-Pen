import React, { useState, useEffect } from 'react';
import { Modal, Input } from '../../components/ui';

interface EditFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newValue: string) => void;
  isLoading: boolean;
  error: string;
  title: string;
  label: string;
  initialValue: string;
  isTextArea?: boolean;
  options?: string[]; // New prop for dropdown options
}

export const EditFieldModal: React.FC<EditFieldModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
  error,
  title,
  label,
  initialValue,
  isTextArea = false,
  options, // Destructure new prop
}) => {
  const [fieldValue, setFieldValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setFieldValue(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleSaveClick = () => {
    onSave(fieldValue);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      confirmText="Save Changes"
      onConfirm={handleSaveClick}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="editField" className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          {options && options.length > 0 ? ( // Conditionally render select
            <select
              id="editField"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              className="block w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : isTextArea ? ( // Existing textarea logic
            <textarea
              id="editField"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          ) : ( // Existing input logic
            <Input
              id="editField"
              value={fieldValue}
              onChange={setFieldValue}
            />
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </Modal>
  );
};
