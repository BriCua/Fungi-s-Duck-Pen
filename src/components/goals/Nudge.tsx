import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useGoals } from '../../hooks/useGoals';
import type { Goal, ChecklistItem } from '../../types/goals';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

interface NudgeProps {
  goal: Goal;
  isOpen: boolean; // Controls modal visibility
  onClose: () => void;
}

const Nudge = ({ goal, isOpen, onClose }: NudgeProps) => {
  const { user, partner } = useAuthContext();
  const { sendNudgeNotification } = useGoals();
  const [nudgeMessage, setNudgeMessage] = useState('');
  const [selectedChecklistItems, setSelectedChecklistItems] = useState<string[]>([]); // Store item IDs
  const [selectAll, setSelectAll] = useState(false);

  const handleToggleChecklistItem = (itemId: string) => {
    setSelectedChecklistItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedChecklistItems([]);
    } else {
      setSelectedChecklistItems(goal.checklist.map(item => item.id));
    }
    setSelectAll(prev => !prev);
  };

  const handleSendNudge = async () => {
    if (!user || !partner) return;

    let itemsToNudge: ChecklistItem[] = [];

    if (selectAll) {
      itemsToNudge = goal.checklist;
    } else if (selectedChecklistItems.length > 0) {
      itemsToNudge = goal.checklist.filter(item => selectedChecklistItems.includes(item.id));
    }

    if (itemsToNudge.length > 0) {
      for (const item of itemsToNudge) {
        await sendNudgeNotification(
          partner.uid,
          user.displayName,
          goal.id!,
          goal.title,
          item.id,
          nudgeMessage || `Just checking in on "${item.text}"! ❤️`
        );
      }
    } else {
      // Send a general nudge if no specific items are selected
      await sendNudgeNotification(
        partner.uid,
        user.displayName,
        goal.id!,
        goal.title,
        null, // No specific checklist item
        nudgeMessage || `Just checking in on this goal! ❤️`
      );
    }

    onClose();
    setNudgeMessage('');
    setSelectedChecklistItems([]);
    setSelectAll(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSendNudge}
      title={`Nudge Partner for "${goal.title}"`}
      confirmText="Send Nudge"
      isLoading={false} // Add loading state if needed for sending nudges
    >
      <div className="space-y-4">
        <p className="text-gray-600">What do you want to nudge about?</p>
        
        <button
          onClick={handleSelectAll}
          className="w-full py-2 px-4 rounded-md text-sm font-semibold mb-4"
          style={{ backgroundColor: selectAll ? 'var(--color-duck-yellow-dark)' : 'var(--color-duck-yellow-subtle)', color: 'rgb(50, 50, 50)' }}
        >
          {selectAll ? 'Deselect All' : 'Select All Items'}
        </button>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-2"> {/* Scrollable checklist */}
          {goal.checklist.map(item => (
            <div key={item.id} className="flex items-center">
              <input
                type="checkbox"
                id={`nudge-item-${item.id}`}
                checked={selectedChecklistItems.includes(item.id) || selectAll}
                onChange={() => handleToggleChecklistItem(item.id)}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" // Use a standard color
              />
              <label htmlFor={`nudge-item-${item.id}`} className="ml-3 text-sm text-gray-700">
                {item.text}
              </label>
            </div>
          ))}
        </div>

        <Input
          label="Optional message"
          value={nudgeMessage}
          onChange={setNudgeMessage}
          placeholder="e.g., You've got this! ✨"
        />
      </div>
    </Modal>
  );
};

export default Nudge;
