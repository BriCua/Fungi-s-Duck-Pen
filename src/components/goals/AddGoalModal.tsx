import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useAuthContext } from '../../context/AuthContext';
import { useGoals } from '../../hooks/useGoals';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import type { Goal, GoalType, ChecklistItem } from '../../types/goals';
import type { Couple } from '../../types/couple';
import crossCloseIcon from '../../assets/icons/cross-close.svg';


interface AddGoalModalProps {
  onClose: () => void;
  couple: Couple | null;
}
const AddGoalModal = ({ onClose, couple }: AddGoalModalProps) => {
  const { user } = useAuthContext();
  const { createGoal } = useGoals();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState<GoalType>('us');
  const [checklist, setChecklist] = useState<string[]>(['']); // Changed state

  const handleChecklistChange = (index: number, value: string) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index] = value;
    setChecklist(updatedChecklist);
  };

  const addChecklistItem = () => {
    setChecklist([...checklist, '']);
  };

  const removeChecklistItem = (index: number) => {
    const updatedChecklist = checklist.filter((_, i) => i !== index);
    setChecklist(updatedChecklist);
  };
  
  const handleSubmit = async () => {
    if (!title || !dueDate || !user || !couple?.coupleId) {
      console.error("Client-side validation failed: Missing required fields (title, dueDate, user, or couple).");
      return;
    }
    
    const finalChecklist: ChecklistItem[] = checklist
      .filter(text => text.trim() !== '')
      .map(text => ({ id: `temp-${Math.random()}`, text, completed: false }));

    const goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      details,
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      type,
      checklist: finalChecklist,
      coupleId: couple.coupleId,
      createdBy: user.uid,
    };

    try {
      await createGoal(goalData);
      onClose();
    } catch (error) {
      console.error("Error calling createGoal in modal:", error);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      onConfirm={handleSubmit}
      title="Add a New Duck Quest"
      confirmText="Add Quest"
    >
      <div className="space-y-6 font-baloo">
        <div className="flex items-center space-x-4">
            <label htmlFor="title" className="text-lg font-semibold font-fredoka text-gray-700">Title:</label>
            <Input
              id="title"
              value={title}
              onChange={setTitle}
              placeholder="e.g., Plan a surprise date night"
              className="text-lg"
            />
        </div>
        <Textarea
          label="Details"
          value={details}
          onChange={setDetails}
          placeholder="Any extra info about the goal"
          rows={3}
        />
        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={setDueDate}
        />
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-fredoka">Goal Type</label>
            <div className="flex rounded-md shadow-sm">
                <button
                    type="button"
                    onClick={() => setType('us')}
                    className={`px-4 py-2 text-sm font-semibold rounded-l-md transition-colors w-1/2 ${type === 'us' ? 'bg-brighter-pink text-pink-50' : 'bg-gray-200 text-gray-600'}`}
                >
                    For Us
                </button>
                <button
                    type="button"
                    onClick={() => setType('personal')}
                    className={`px-4 py-2 text-sm font-semibold rounded-r-md transition-colors w-1/2 ${type === 'personal' ? 'bg-duck-yellow-dark text-yellow-50' : 'bg-gray-200 text-gray-600'}`}
                >
                    For Me
                </button>
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 font-fredoka">Checklist</label>
          <div className="space-y-2">
            {checklist.map((item, index) => (
              <div key={index} className="relative flex items-center">
                <Input
                  value={item}
                  onChange={(value) => handleChecklistChange(index, value)}
                  placeholder="Add a step"
                  className="bg-gray-100 pr-10" // Add padding to the right for the button
                />
                <button 
                  onClick={() => removeChecklistItem(index)} 
                  className="absolute right-0 top-0 bottom-0 px-2 flex items-center justify-center bg-red-500 border-t border-r border-b border-gray-300 text-white rounded-r-sm hover:bg-red-600 transition-colors"
                >
                  <img src={crossCloseIcon} alt="Remove item" className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addChecklistItem} className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-400 font-bold text-center hover:border-pond-blue hover:text-pond-blue transition-colors">
            +
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddGoalModal;
