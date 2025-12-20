import { useState } from 'react';
import type { Goal } from '../../types/goals';
import EditGoalModal from './EditGoalModal';
import ProgressBar from './ProgressBar';
import Checklist from './Checklist';
import Nudge from './Nudge';
import { useGoals } from '../../hooks/useGoals';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface GoalCardProps {
  goal: Goal;
  ownership: 'my' | 'partner' | 'our';
}


const GoalCard = ({ goal, ownership }: GoalCardProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const [isNudgeModalOpen, setIsNudgeModalOpen] = useState(false);
  const { deleteGoal, updateGoal } = useGoals();

  const calculateProgress = () => {
    if (goal.done) return 100;
    if (!goal.checklist || goal.checklist.length === 0) {
      return 0;
    }
    const completed = goal.checklist.filter(item => item.completed).length;
    return (completed / goal.checklist.length) * 100;
  };

  const handleMarkAsDone = async () => {
    if (goal.id) {
      try {
        await updateGoal(goal.id, { done: true });
      } catch (error) {
        console.error("Failed to mark goal as done:", error);
      }
    }
  };

  const handleUnmarkAsDone = async () => {
    if (goal.id) {
      try {
        await updateGoal(goal.id, { done: false });
      } catch (error) {
        console.error("Failed to unmark goal as done:", error);
      }
    }
  };

  const handleArchive = async () => {
    if (goal.id) {
      try {
        await updateGoal(goal.id, { isArchived: true });
      } catch (error) {
        console.error("Failed to archive goal:", error);
      }
    }
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

  let cardColor;
  let titleColor;
  let textColor;
  let iconColor; // For the color value itself

  switch (ownership) {
    case 'my':
      cardColor = 'var(--color-duck-yellow-dark)';
      titleColor = 'var(--color-duck-yellow-light)';
      textColor = 'var(--color-duck-yellow-light)';
      iconColor = 'var(--color-duck-yellow-light)';
      break;
    case 'partner':
      cardColor = 'var(--color-duck-yellow-subtle)';
      titleColor = 'var(--color-white)';
      textColor = 'var(--color-white)';
      iconColor = 'var(--color-white)';
      break;
    case 'our':
      cardColor = 'var(--color-contrast-pink)';
      titleColor = 'var(--color-pink-50)';
      textColor = 'var(--color-pink-50)';
      iconColor = 'var(--color-pink-200)';
      break;
  }

  // Define a theme object to pass to children if needed
  const cardTheme = {
    titleColor,
    textColor,
    iconColor,
    cardColor,
  };

  const progress = calculateProgress();
  const isComplete = progress === 100;

  return (
    <>
      <div 
        className={`p-4 rounded-lg shadow-md flex flex-col justify-between font-baloo ${goal.isArchived ? 'opacity-50' : ''}`}
        style={{ backgroundColor: cardColor }}
      >
        <div onClick={() => !goal.isArchived && setExpanded(!isExpanded)} className={!goal.isArchived ? "cursor-pointer" : ""}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-fredoka font-bold text-xl" style={{ color: titleColor }}>{goal.title}</h3>
              <p className="text-md mb-2 font-baloo2" style={{ color: textColor }}>Due - {goal.dueDate.toDate().toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-2">
              {isComplete && !goal.isArchived && (ownership === 'my' || ownership === 'our') && (
                <button onClick={(e) => { e.stopPropagation(); handleArchive(); }} style={{ color: cardTheme.iconColor }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColor}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
              {ownership === 'partner' && !goal.isArchived && ( // Nudge button for partner's goals
                <button onClick={(e) => { e.stopPropagation(); setIsNudgeModalOpen(true); }} style={{ color: cardTheme.iconColor }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.986L2 17l1.338-3.123C2.547 11.92 2 10.054 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              {(ownership === 'my' || ownership === 'our') && !goal.isArchived && ( // Edit button for my and our goals
                <button onClick={(e) => { e.stopPropagation(); setEditModalOpen(true); }} style={{ color: cardTheme.iconColor }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              {(ownership === 'my' || ownership === 'our') && ( // Delete button for my and our goals
                <button onClick={(e) => { e.stopPropagation(); setDeleteModalOpen(true); }} style={{ color: cardTheme.iconColor }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke={cardTheme.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div>
            {goal.details && <p className="text-sm mb-1" style={{ color: textColor }}>{goal.details}</p>}
            {(!goal.checklist || goal.checklist.length === 0 || goal.isArchived) ? null : (
                <div className="flex justify-start -ml-2.5">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  className={`w-9 h-9 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  style={{ fill: iconColor }}
                >
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {isExpanded && goal.checklist && goal.checklist.length > 0 && (
          <div className="mt-1">
            <Checklist goal={goal} cardTheme={cardTheme} isArchived={goal.isArchived} />
          </div>
        )}

        {(!goal.checklist || goal.checklist.length === 0) && (ownership === 'my' || ownership === 'our') && !goal.isArchived && (
          <div className="mt-4">
            {isComplete ? (
              <Button onClick={handleUnmarkAsDone} variant="danger">
                Unmark
              </Button>
            ) : (
              <Button onClick={handleMarkAsDone} variant="primary">
                Mark as Done
              </Button>
            )}
          </div>
        )}
        <div className="mt-2">
          <ProgressBar percentage={progress} cardTheme={cardTheme} />
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
      {isNudgeModalOpen && (
        <Nudge
          goal={goal}
          isOpen={isNudgeModalOpen}
          onClose={() => setIsNudgeModalOpen(false)}
        />
      )}
    </>
  );
};

export default GoalCard;
