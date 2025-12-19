import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from '../../components/ui';
import type { SpecialDate } from '../../types/couple';

interface UpdateSpecialDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string, date: Date, recurring: boolean) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  error: string;
  specialDate: SpecialDate | null;
}

export const UpdateSpecialDateModal: React.FC<UpdateSpecialDateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  isLoading,
  error,
  specialDate,
}) => {
  const [dateName, setDateName] = useState('');
  const [dateValue, setDateValue] = useState(''); // YYYY-MM-DD format
  const [isRecurring, setIsRecurring] = useState(true);

  useEffect(() => {
    if (isOpen && specialDate) {
      setDateName(specialDate.name);
      // Format date to YYYY-MM-DD for the input
      const d = new Date(specialDate.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      setDateValue(`${year}-${month}-${day}`);
      setIsRecurring(specialDate.recurring ?? true);
    } else if (!isOpen) {
      // Reset form when modal closes
      setDateName('');
      setDateValue('');
      setIsRecurring(true);
    }
  }, [isOpen, specialDate]);

  const handleSaveClick = () => {
    if (dateName && dateValue && specialDate) {
      const [year, month, day] = dateValue.split('-').map(Number);
      const newDate = new Date(Date.UTC(year, month - 1, day));
      onSave(specialDate.id, dateName, newDate, isRecurring);
    }
  };
  
  const handleDeleteClick = () => {
    if (specialDate) {
      onDelete(specialDate.id);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Special Date"
      confirmText="Save Changes"
      onConfirm={handleSaveClick}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="dateNameUpdate" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <Input
            id="dateNameUpdate"
            value={dateName}
            onChange={setDateName}
            placeholder="e.g., First Kiss, Proposal Day"
          />
        </div>
        <div>
          <label htmlFor="dateValueUpdate" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <Input
            id="dateValueUpdate"
            type="date"
            value={dateValue}
            onChange={setDateValue}
          />
        </div>
        <div className="flex items-center">
          <input
            id="recurringUpdate"
            name="recurringUpdate"
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="recurringUpdate" className="ml-2 block text-sm text-gray-900">
            Celebrate this date every year?
          </label>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="pt-4">
          <Button variant="danger" onClick={handleDeleteClick} disabled={isLoading}>
            Delete Date
          </Button>
        </div>
      </div>
    </Modal>
  );
};
