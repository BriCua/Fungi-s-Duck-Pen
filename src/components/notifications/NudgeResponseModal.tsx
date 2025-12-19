import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { useAuthContext } from '../../context/AuthContext';
import { useGoals } from '../../hooks/useGoals';
import type { Notification } from '../../types/notification';

interface NudgeResponseModalProps {
  notification: Notification;
  onClose: () => void;
}

const NudgeResponseModal = ({ notification, onClose }: NudgeResponseModalProps) => {
  const { user, partner } = useAuthContext();
  const { sendNudgeResponseNotification, updateChecklistFromNudge } = useGoals();
  const [customResponse, setCustomResponse] = useState('');

  const handleResponse = async (response: string) => {
    if (!user || !partner || !response.trim()) return;

    const { goalTitle, goalId, checklistItemId } = notification.data || {};

    sendNudgeResponseNotification(partner.uid, user.displayName, goalTitle ?? '', response);

    if (response === 'Done!' && goalId) {
      updateChecklistFromNudge(goalId, checklistItemId || null);
    }

    onClose();
  };
  
  const responseOptions = ["Not quite yet...", "On it!", "Almost there!", "Done!"];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Response to nudge for "${notification.data?.goalTitle}"`}
    >
      <div className="space-y-4">
        <p className="text-gray-600 font-baloo2">Your partner asked: "{notification.data?.nudgeMessage}"</p>
        <div className="grid grid-cols-2 gap-4">
          {responseOptions.map(option => (
            <Button
              key={option}
              onClick={() => handleResponse(option)}
              variant="duckdark"
              className="" 
            >
              {option}
            </Button>
          ))}
        </div>
        <div className="pt-4 border-t border-gray-200">
            <Textarea
                placeholder="Or write a custom response..."
                value={customResponse}
                onChange={setCustomResponse}
                rows={3}
            />
            <Button
                onClick={() => handleResponse(customResponse)}
                disabled={!customResponse.trim()}
                variant="navy"
                className="mt-2 w-full"
            >
                Send Custom Response
            </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NudgeResponseModal;
