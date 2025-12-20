import { useState } from 'react';
import { useGoals } from '../hooks/useGoals';
import { useAuthContext } from '../context/AuthContext';
import { Spinner } from '../components/ui';
import GoalCard from '../components/goals/GoalCard';
import AddGoalModal from '../components/goals/AddGoalModal';
import { PageHeader } from '../components/ui/PageHeader';
import type { Goal } from '../types/goals';

const GoalsPage = () => {
  const { goals, loading } = useGoals();
  const { user, couple, partner } = useAuthContext();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'us' | 'my' | 'partner'>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredGoals = goals.filter(goal => {
    const filterPasses = (
      filter === 'all' ||
      (filter === 'us' && goal.type === 'us') ||
      (filter === 'my' && goal.type === 'personal' && goal.createdBy === user?.uid) ||
      (filter === 'partner' && goal.type === 'personal' && goal.createdBy === partner?.uid)
    );
    
    if (!filterPasses) return false;

    return showArchived ? true : !goal.isArchived;
  });

  const getGoalOwnership = (goal: Goal) => {
    if (goal.type === 'us') return 'our';
    return goal.createdBy === user?.uid ? 'my' : 'partner';
  };

  const renderFilterButton = () => (
    <div className="relative">
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="btn-ripple bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-lg px-3 py-2 font-semibold text-gray-500 w-12 h-12 flex items-center justify-center text-2xl relative"
        aria-label="Filter quests"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
        </svg>
      </button>
      {isFilterOpen && (
        <div className="absolute top-14 right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-10">
          <button onClick={() => { setFilter('all'); setIsFilterOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">All Quests</button>
          <button onClick={() => { setFilter('us'); setIsFilterOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Our Quests</button>
          <button onClick={() => { setFilter('my'); setIsFilterOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">My Quests</button>
          {partner && (
            <button onClick={() => { setFilter('partner'); setIsFilterOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">{`${partner.displayName}'s Quests`}</button>
          )}
          <div className="border-t border-gray-200 my-1"></div>
            <button onClick={() => setShowArchived(!showArchived)} className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center justify-between">
              <span>Show Completed</span>
              {showArchived && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
            </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-1">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="font-baloo">
      <PageHeader title="Duck Quests" rightAction={renderFilterButton()} />

      <div className='p-6'>    
        {filteredGoals.length === 0 ? (
          <p className="text-center text-gray-400">No goals found for this filter.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGoals.map(goal => <GoalCard key={goal.id} goal={goal} ownership={getGoalOwnership(goal)} />)}
          </div>
        )}
      </div>

      {/* FAB to add goal */}
      <button 
        onClick={() => setAddModalOpen(true)}
        className=" bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-lg fixed bottom-8 right-6 text-gray-500 p-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 disabled:bg-gray-400"
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
