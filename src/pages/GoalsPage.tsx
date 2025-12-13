import { useState } from 'react';
import { useGoals } from '../hooks/useGoals';
import { useAuthContext } from '../context/AuthContext'; // Import useAuthContext
import { Spinner } from '../components/ui';
import GoalCard from '../components/goals/GoalCard';
import AddGoalModal from '../components/goals/AddGoalModal';

const GoalsPage = () => {
  const { personalGoals, coupleGoals, loading } = useGoals();
  const { couple } = useAuthContext(); // Get couple from context
  const [activeTab, setActiveTab] = useState<'personal' | 'couple'>('couple');
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  }

  return (
    <div className="p-4 md:p-6 text-white font-baloo">
      <h1 className="text-3xl font-bold mb-4 text-center font-fredoka">Duck Quests</h1>
      
      {/* Tabs */}
      <div className="mb-4 flex justify-center">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('couple')}
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'couple' ? 'bg-yellow-400 text-gray-800' : 'bg-gray-700'}`}
          >
            Our Goals
          </button>
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'personal' ? 'bg-yellow-400 text-gray-800' : 'bg-gray-700'}`}
          >
            Personal Goals
          </button>
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'couple' && (
          <div>
            {coupleGoals.length === 0 ? (
              <p className="text-center text-gray-400">No shared goals yet. Create one together!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupleGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'personal' && (
          <div>
            {personalGoals.length === 0 ? (
              <p className="text-center text-gray-400">No personal goals yet. Add something you're working on!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personalGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB to add goal */}
      <button 
        onClick={() => setAddModalOpen(true)}
        className="fixed bottom-20 right-6 bg-yellow-400 text-gray-800 p-4 rounded-full shadow-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 disabled:bg-gray-400"
        aria-label="Add new goal"
        disabled={!couple} // Disable button if couple is not loaded
        >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {isAddModalOpen && <AddGoalModal onClose={() => setAddModalOpen(false)} couple={couple} />}
    </div>
  );
};

export default GoalsPage;
