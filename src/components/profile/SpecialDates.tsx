import React from 'react';
import { Card, Button } from '../../components/ui';
import type { Couple } from '../../types';

interface SpecialDatesProps {
  couple: Couple | null;
  onAddSpecialDate: () => void; // Function to open the add special date modal
  onDateClick: (date: SpecialDate) => void; // New prop
}

// Helper function to get relative time description
const getRelativeDateDescription = (date: Date, recurring: boolean): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  if (!recurring) {
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 0) {
      return `In ${diffDays} days`;
    }
    return `Was ${Math.abs(diffDays)} days ago`;
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

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  
  const absDiffDays = Math.abs(diffDays);

  if (absDiffDays <= 7) {
    return `Upcoming - ${absDiffDays} days`;
  } else if (absDiffDays <= 30) { // Approximately 1 month
    const weeks = Math.round(absDiffDays / 7);
    return `Upcoming - ${weeks} week${weeks > 1 ? 's' : ''}`;
  } else { // More than 1 month
    const months = Math.round(absDiffDays / 30);
    return `Upcoming - ${months} month${months > 1 ? 's' : ''}`;
  }
};

export const SpecialDates: React.FC<SpecialDatesProps> = ({ couple, onAddSpecialDate, onDateClick }) => {
  const dates: SpecialDate[] = [];

  if (couple?.anniversary) {
    dates.push({
      id: 'anniversary',
      name: 'Anniversary',
      date: new Date(couple.anniversary),
      recurring: true,
    });
  }

  if (couple?.specialDates) {
    couple.specialDates.forEach(d => {
      dates.push({
        id: d.id,
        name: d.name,
        date: new Date(d.date),
        recurring: d.recurring ?? true,
      })
    })
  }

  const getUpcomingDate = (date: Date, recurring: boolean) => {
    if (!recurring) {
      return date;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let upcoming = new Date(today.getFullYear(), date.getMonth(), date.getDate());
    if (upcoming < today) {
      upcoming.setFullYear(today.getFullYear() + 1);
    }
    return upcoming;
  }

  // Sort dates by upcoming earliest
  dates.sort((a, b) => getUpcomingDate(a.date, a.recurring ?? true).getTime() - getUpcomingDate(b.date, b.recurring ?? true).getTime());

  return (
    <Card className="mb-8 p-6 bg-gradient-to-br from-blue-100 to-green-100 shadow-lg rounded-xl">
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
                <p className="text-gray-600">{item.date.toLocaleDateString()}</p>
                {item.id === 'anniversary' && couple?.relationshipStatus && (
                  <p className="text-gray-500 text-sm mt-1">{couple.relationshipStatus}</p>
                )}
              </div>
              <span className="absolute top-2 right-2 text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                {getRelativeDateDescription(item.date, item.recurring ?? true)}
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
    </Card>
  );
};
