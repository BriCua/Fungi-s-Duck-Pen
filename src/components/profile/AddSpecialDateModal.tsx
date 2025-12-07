import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from '../../components/ui';

interface AddSpecialDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, date: Date) => void;
  isLoading: boolean;
  error: string;
}

export const AddSpecialDateModal: React.FC<AddSpecialDateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
  error,
}) => {
  const [dateName, setDateName] = useState('');
  const [dateValue, setDateValue] = useState(''); // YYYY-MM-DD format

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setDateName('');
      setDateValue('');
    }
  }, [isOpen]);

  const handleSaveClick = () => {
    if (dateName && dateValue) {
      const [year, month, day] = dateValue.split('-').map(Number);
      // Create date in UTC to avoid timezone issues with `new Date().setUTCFullYear`
      const newDate = new Date(Date.UTC(year, month - 1, day));
      onSave(dateName, newDate);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Special Date"
      confirmText="Save Date"
      onConfirm={handleSaveClick}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="dateName" className="block text-sm font-medium text-gray-700 mb-1">Date Name</label>
          <Input
            id="dateName"
            value={dateName}
            onChange={setDateName}
            placeholder="e.g., First Kiss, Proposal Day"
          />
        </div>
        <div>
          <label htmlFor="dateValue" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <Input
            id="dateValue"
            type="date"
            value={dateValue}
            onChange={setDateValue}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </Modal>
  );
};
