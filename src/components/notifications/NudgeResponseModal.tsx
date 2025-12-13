import { Modal } from '../ui/Modal';
import { useAuthContext } from '../../context/AuthContext';
import { useGoals } from '../../hooks/useGoals';
import type { Notification } from '../../types';

interface NudgeResponseModalProps {
  notification: Notification;
  onClose: () => void;
}

const NudgeResponseModal = ({ notification, onClose }: NudgeResponseModalProps) => {
  const { user, partner } = useAuthContext();
  const { sendNudgeResponseNotification, updateChecklistFromNudge } = useGoals();

  const handleResponse = async (response: string) => {
    if (!user || !partner) return;

    const { goalTitle, goalId, checklistItemId } = notification.data || {};

    // 1. Send a notification back to the nudger
    sendNudgeResponseNotification(partner.uid, user.displayName, goalTitle, response);

    // 2. If the response is "Done!", update the checklist
    if (response === 'Done!' && goalId) {
      // This is where we need the goal object to update the checklist.
      // The `updateChecklistFromNudge` function in `goalService` is a placeholder.
      // We will implement the logic here, where we have the `goals` from `useGoals`.
      
      // For now, let's call the placeholder and log a warning.
      updateChecklistFromNudge(goalId, checklistItemId || null);
      console.log("Updating checklist for goal:", goalId, "item:", checklistItemId);
    }

    onClose();
  };
  
  const responseOptions = ["On it!", "Almost done!", "Need help", "Done!"];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Response to nudge for "${notification.data?.goalTitle}"`}
    >
      <div className="space-y-4">
        <p className="text-gray-600">Your partner asked: "{notification.data?.nudgeMessage}"</p>
        <p className="font-semibold">How's it going?</p>
        <div className="grid grid-cols-2 gap-4">
          {responseOptions.map(option => (
            <button
              key={option}
              onClick={() => handleResponse(option)}
              className="p-4 bg-yellow-400 text-gray-800 font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default NudgeResponseModal;
