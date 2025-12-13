import { useAuthContext } from '../../context/AuthContext';
import { useGoals } from '../../hooks/useGoals';
import type { Goal, ChecklistItem } from '../../types/goals';

interface ChecklistProps {
  goal: Goal;
}

const Checklist = ({ goal }: ChecklistProps) => {
  const { user } = useAuthContext();
  const { updateGoal } = useGoals();

  const handleToggleChecklistItem = (itemToToggle: ChecklistItem) => {
    if (goal.type === 'personal' && user?.uid !== goal.createdBy) {
      return; // Partner cannot check personal goal items
    }

    const updatedChecklist = goal.checklist.map(item =>
      item.id === itemToToggle.id ? { ...item, completed: !item.completed } : item
    );
    
    if(goal.id) {
        updateGoal(goal.id, { checklist: updatedChecklist });
    }
  };

  const isChecklistDisabled = goal.type === 'personal' && user?.uid !== goal.createdBy;

  return (
    <div className="space-y-2">
      {goal.checklist.map(item => (
        <div key={item.id} className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => handleToggleChecklistItem(item)}
            disabled={isChecklistDisabled}
            className="h-4 w-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400 disabled:opacity-50"
          />
          <label className={`ml-3 block text-sm font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
            {item.text}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Checklist;
