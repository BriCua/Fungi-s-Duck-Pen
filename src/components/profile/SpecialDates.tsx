import React from 'react';
import { Button } from '../../components/ui';
import type { Couple, SpecialDate } from '../../types';

interface SpecialDatesProps {
  couple: Couple | null;
  onAddSpecialDate: () => void; // Function to open the add special date modal
  onDateClick: (date: SpecialDate) => void; // New prop
}

// Helper function to get relative time description
const getRelativeDateDescription = (date: Date, recurring: boolean): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (!recurring) {
    if (diffDays >= 0) {
      return `In ${diffDays} days`;
    } else {
      const absDiffDays = Math.abs(diffDays);
      if (absDiffDays < 14) {
        return `${absDiffDays} day${absDiffDays !== 1 ? 's' : ''} ago`;
      }
      
      let years = today.getFullYear() - date.getFullYear();
      let months = today.getMonth() - date.getMonth();

      if (months < 0 || (months === 0 && today.getDate() < date.getDate())) {
        years--;
        months = (months + 12) % 12;
      }

      if (years > 0) {
        if (months > 0) {
          return `${years} year${years > 1 ? 's' : ''} and ${months} month${months > 1 ? 's' : ''} ago`;
        } else {
          return `${years} year${years > 1 ? 's' : ''} ago`;
        }
      } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
      } else {
        const weeks = Math.floor(absDiffDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
      }
    }
  }
  
  const originalDate = new Date(date);
  const originalMonth = originalDate.getMonth();
  const originalDay = originalDate.getDate();

  let targetDate = new Date(today.getFullYear(), originalMonth, originalDay);
  targetDate.setHours(0, 0, 0, 0);

  // If the date has already passed this year, set it to next year
  if (targetDate.getTime() < today.getTime()) {
    targetDate.setFullYear(today.getFullYear() + 1);
  }

  const upcomingDiffTime = targetDate.getTime() - today.getTime();
  const upcomingDiffDays = Math.ceil(upcomingDiffTime / (1000 * 60 * 60 * 24));

  if (upcomingDiffDays === 0) return 'Today';
  if (upcomingDiffDays === 1) return 'Tomorrow';
  
  const absUpcomingDiffDays = Math.abs(upcomingDiffDays);

  if (absUpcomingDiffDays <= 7) {
    return `Upcoming - ${absUpcomingDiffDays} days`;
  } else if (absUpcomingDiffDays <= 30) { // Approximately 1 month
    const weeks = Math.round(absUpcomingDiffDays / 7);
    return `Upcoming - ${weeks} week${weeks > 1 ? 's' : ''}`;
  } else { // More than 1 month
    const months = Math.round(absUpcomingDiffDays / 30);
    return `Upcoming - ${months} month${months > 1 ? 's' : ''}`;
  }
};

export const SpecialDates: React.FC<SpecialDatesProps> = ({ couple, onAddSpecialDate, onDateClick }) => {
  const recurringDates: SpecialDate[] = [];
  const nonRecurringDates: SpecialDate[] = [];

  if (couple?.anniversary) {
    recurringDates.push({
      id: 'anniversary',
      name: 'Anniversary',
      date: couple.anniversary,
      recurring: true,
    });
  }

  if (couple?.specialDates) {
    couple.specialDates.forEach(d => {
      const dateItem = {
        id: d.id,
        name: d.name,
        date: d.date,
        recurring: d.recurring ?? true,
      };
      if (dateItem.recurring) {
        recurringDates.push(dateItem);
      } else {
        nonRecurringDates.push(dateItem);
      }
    });
  }

  const getUpcomingDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let upcoming = new Date(today.getFullYear(), date.getMonth(), date.getDate());
    if (upcoming < today) {
      upcoming.setFullYear(today.getFullYear() + 1);
    }
    return upcoming;
  };

  // Sort recurring dates by upcoming earliest
  recurringDates.sort((a, b) => getUpcomingDate(a.date).getTime() - getUpcomingDate(b.date).getTime());

  // Sort non-recurring dates from oldest to most recent
  nonRecurringDates.sort((a, b) => a.date - b.date);

  const dates = [...recurringDates, ...nonRecurringDates];

  return (
    <div className="mb-8 p-6 bg-gradient-to-br from-blue-100 to-green-100 shadow rounded-lg">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-4 font-fredoka">Special Dates</h2>
      <div className="space-y-4">
        {dates.length > 0 ? (
          dates.map((item) => (
            <button
              key={item.id}
              onClick={() => onDateClick(item)}
              className="w-full text-left relative p-4 border border-blue-200 rounded-lg bg-white shadow-sm flex justify-between items-center hover:bg-blue-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-blue-700 text-lg font-baloo2">{item.name}</p>
                <p className="text-gray-600">{new Date(item.date).toLocaleDateString()}</p>
                {item.id === 'anniversary' && couple?.relationshipStatus && (
                  <p className="text-gray-500 text-sm mt-1">{couple.relationshipStatus}</p>
                )}
              </div>
              <span className="absolute top-2 right-2 text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                {getRelativeDateDescription(new Date(item.date), item.recurring ?? true)}
              </span>
            </button>
          ))
        ) : (
          <p className="text-center text-gray-500 font-baloo2">No special dates added yet.</p>
        )}
      </div>
      <div className="mt-6 text-center">
        <Button onClick={onAddSpecialDate} variant="primary" disabled={!couple}>
          Add Special Date
        </Button>
      </div>
    </div>
  );
};
