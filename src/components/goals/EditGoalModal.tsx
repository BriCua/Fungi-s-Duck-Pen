import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useGoals } from '../../hooks/useGoals';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import type { Goal, GoalType, ChecklistItem } from '../../types/goals';
import crossCloseIcon from '../../assets/icons/cross-close.svg';

interface EditGoalModalProps {
  goal: Goal;
  onClose: () => void;
}

const EditGoalModal = ({ goal, onClose }: EditGoalModalProps) => {
  const { updateGoal } = useGoals();
  const [title, setTitle] = useState(goal.title);
  const [details, setDetails] = useState(goal.details || '');
  const [dueDate, setDueDate] = useState(goal.dueDate.toDate().toISOString().split('T')[0]);
  const [type, setType] = useState<GoalType>(goal.type);
  const [checklist, setChecklist] = useState<string[]>(goal.checklist ? goal.checklist.map(item => item.text) : ['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
    if (!title || !dueDate) {
      setError('Please fill out all required fields: Title and Due Date.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const finalChecklist: ChecklistItem[] = checklist
      .filter(text => text.trim() !== '')
      .map((text, index) => {
        const existingItem = goal.checklist?.[index];
        return { 
          id: existingItem?.id || `temp-${Math.random()}`, 
          text, 
          completed: existingItem?.completed || false 
        };
      });

    const updatedData: Partial<Goal> = {
      title,
      details,
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      type,
      checklist: finalChecklist,
    };

    try {
      if(goal.id) {
        await updateGoal(goal.id, updatedData);
      }
      onClose();
    } catch (err) {
      setError('There was an error saving the quest. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      onConfirm={handleSubmit}
      title="Edit Duck Quest"
      confirmText="Save Changes"
      isLoading={isSubmitting}
    >
      <div className="space-y-6 font-baloo">
        {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}
        <div className="flex items-center space-x-4">
            <label htmlFor="title" className="text-lg font-semibold font-fredoka text-gray-700">Title:</label>
            <Input
              id="title"
              value={title}
              onChange={setTitle}
              className="text-lg"
            />
        </div>
        <Textarea
          label="Details"
          value={details}
          onChange={setDetails}
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
                    className={`px-4 py-2 text-sm font-semibold rounded-l-md transition-colors w-1/2 ${type === 'us' ? 'bg-contrast-pink text-pink-50' : 'bg-gray-200 text-gray-600'}`}
                >
                    Our Quest
                </button>
                <button
                    type="button"
                    onClick={() => setType('personal')}
                    className={`px-4 py-2 text-sm font-semibold rounded-r-md transition-colors w-1/2 ${type === 'personal' ? 'bg-duck-yellow-dark text-duck-yellow-light' : 'bg-gray-200 text-gray-600'}`}
                >
                    My Quest
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
                  className="absolute right-0 top-0 bottom-0 px-2 flex items-center justify-center bg-red-500 text-white rounded-r-md hover:bg-red-600 transition-colors"
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

export default EditGoalModal;
