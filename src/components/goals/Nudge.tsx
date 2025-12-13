import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useGoals } from '../../hooks/useGoals';
import type { Goal, ChecklistItem } from '../../types/goals';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

interface NudgeProps {
  goal: Goal;
}

const Nudge = ({ goal }: NudgeProps) => {
  const { user, partner } = useAuthContext();
  const { sendNudgeNotification } = useGoals();
  const [nudgeModalOpen, setNudgeModalOpen] = useState(false);
  const [nudgeMessage, setNudgeMessage] = useState('');
  const [nudgedChecklistItem, setNudgedChecklistItem] = useState<ChecklistItem | null>(null);

  const openNudgeModal = (item: ChecklistItem | null) => {
    setNudgedChecklistItem(item);
    setNudgeModalOpen(true);
  };

  const handleSendNudge = () => {
    if (!user || !partner) return;

    sendNudgeNotification(
      partner.uid,
      user.displayName,
      goal.id!,
      goal.title,
      nudgedChecklistItem?.id || null,
      nudgeMessage || `Just checking in on this goal! ❤️`
    );
    setNudgeModalOpen(false);
    setNudgeMessage('');
  };
  
  // A partner can only nudge on a personal goal of the other user
  if (goal.type !== 'personal' || user?.uid === goal.createdBy) {
    return null;
  }

  return (
    <div className="mt-4">
        <h4 className="font-semibold text-sm text-gray-400 mb-2">Nudge your partner</h4>
        <div className="space-y-2">
            {goal.checklist.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                    <span className="text-gray-300">{item.text}</span>
                    <button onClick={() => openNudgeModal(item)} className="text-xs bg-yellow-400 text-gray-800 px-2 py-1 rounded-md">Nudge</button>
                </div>
            ))}
            <button onClick={() => openNudgeModal(null)} className="w-full text-sm bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-600">Send a general nudge</button>
        </div>

        {nudgeModalOpen && (
            <Modal
                isOpen={true}
                onClose={() => setNudgeModalOpen(false)}
                onConfirm={handleSendNudge}
                title={`Nudge for "${goal.title}"`}
                confirmText="Send Nudge"
            >
                <Input
                    label={`Optional message for ${nudgedChecklistItem ? `"${nudgedChecklistItem.text}"` : 'the goal'}`}
                    value={nudgeMessage}
                    onChange={(e) => setNudgeMessage(e.target.value)}
                    placeholder="e.g., You've got this! ✨"
                />
            </Modal>
        )}
    </div>
  );
};

export default Nudge;
