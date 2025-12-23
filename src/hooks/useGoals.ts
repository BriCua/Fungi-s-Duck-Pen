import { useState, useEffect, useMemo } from 'react';
import {
  createGoal,
  subscribeToGoals,
  updateGoal,
  deleteGoal,
  sendNudgeNotification,
  sendNudgeResponseNotification,
  updateChecklistFromNudge as updateChecklistFromNudgeService,
} from '../firebase/goalService';
import type { Goal } from '../types/goals';
import { useAuthContext } from '../context/AuthContext';

export const useGoals = () => {
  const { couple } = useAuthContext();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!couple?.coupleId) {
      console.log("useGoals: No coupleId found, skipping subscription.");
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log(`useGoals: Subscribing to goals with coupleId: ${couple.coupleId}`);
    const unsubscribe = subscribeToGoals(couple.coupleId, (fetchedGoals) => {
      setGoals(fetchedGoals);
      setLoading(false);
    });

    return () => {
      console.log("useGoals: Unsubscribing from goals.");
      unsubscribe();
    }
  }, [couple?.coupleId]);

  const personalGoals = useMemo(() =>
    goals.filter(g => g.type === 'personal'),
    [goals]
  );

  const coupleGoals = useMemo(() =>
    goals.filter(g => g.type === 'us'),
    [goals]
  );

  const updateChecklistFromNudge = async (goalId: string, checklistItemId: string | null) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    let updatedChecklist;
    if (checklistItemId) {
      updatedChecklist = goal.checklist.map(item =>
        item.id === checklistItemId ? { ...item, completed: true } : item
      );
    } else {
      updatedChecklist = goal.checklist.map(item => ({ ...item, completed: true }));
    }

    // Optimistic UI update
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, checklist: updatedChecklist } : g));

    try {
      await updateChecklistFromNudgeService(goalId, checklistItemId, true);
    } catch (err) {
      console.error('updateChecklistFromNudge: transaction failed, reload will reconcile', err);
    }
  };

  return {
    goals,
    personalGoals,
    coupleGoals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    sendNudgeNotification,
    sendNudgeResponseNotification,
    updateChecklistFromNudge,
  };
};
