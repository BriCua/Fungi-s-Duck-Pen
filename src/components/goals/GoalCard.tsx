import { useState } from 'react';
import type { Goal } from '../../types/goals';
import EditGoalModal from './EditGoalModal';
import ProgressBar from './ProgressBar';
import Checklist from './Checklist';
import Nudge from './Nudge';
import { useGoals } from '../../hooks/useGoals';
import { Modal } from '../ui/Modal';
import trashIcon from '../../assets/icons/trash-can.svg';
import triangleIcon from '../../assets/icons/triangle-down.svg'; // Import triangle icon

interface GoalCardProps {
  goal: Goal;
}

const GoalCard = ({ goal }: GoalCardProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const { deleteGoal } = useGoals();

  const calculateProgress = () => {
    if (goal.checklist.length === 0) {
      return 0;
    }
    const completed = goal.checklist.filter(item => item.completed).length;
    return (completed / goal.checklist.length) * 100;
  };

  const handleDelete = async () => {
    if (goal.id) {
      try {
        await deleteGoal(goal.id);
        setDeleteModalOpen(false);
      } catch (error) {
        console.error("Failed to delete goal:", error);
      }
    }
  };


  return (
    <>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col justify-between font-baloo">
        <div onClick={() => setExpanded(!isExpanded)} className="cursor-pointer">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-fredoka font-bold text-xl text-duck-yellow">{goal.title}</h3>
              <p className="text-sm text-gray-400 mb-2">Due: {goal.dueDate.toDate().toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={(e) => { e.stopPropagation(); setEditModalOpen(true); }} className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setDeleteModalOpen(true); }} className="text-gray-400 hover:text-red-500">
                <img src={trashIcon} alt="Delete" className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div>
            {goal.details && <p className="text-sm text-gray-300 mb-1">{goal.details}</p>}
            <div className="flex justify-start -ml-1.5"> {/* Container for the triangle, left-indented */}
              <img 
                src={triangleIcon} 
                alt="Expand/Collapse" 
                className={`w-7 h-7 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              />
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-1">
            {goal.checklist && goal.checklist.length > 0 && <Checklist goal={goal} />}
            <Nudge goal={goal} />
          </div>
        )}

        <div className="mt-2">
          <ProgressBar percentage={calculateProgress()} />
        </div>

        {isEditModalOpen && <EditGoalModal goal={goal} onClose={() => setEditModalOpen(false)} />}
      </div>
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Confirm Deletion"
          confirmText="Delete"
          variant="danger"
        >
          <p>Are you sure you want to delete the quest: "{goal.title}"?</p>
          <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
        </Modal>
      )}
    </>
  );
};

export default GoalCard;
