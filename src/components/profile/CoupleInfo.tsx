import React from 'react';

import { useAuthContext } from '../../context/AuthContext';

const PencilIcon = ({ onClick }: { onClick: () => void }) => (
  <span className="mr-2 cursor-pointer text-gray-500 hover:text-purple-700" onClick={onClick}>✏️</span>
);

interface CoupleInfoProps {
  onEditRelationshipStatus: (currentStatus: string) => void;
  onEditMeetStory: (currentStory: string) => void;
}

export const CoupleInfo: React.FC<CoupleInfoProps> = ({ onEditRelationshipStatus, onEditMeetStory }) => {
  const { couple } = useAuthContext();

  return (
    <div className="mb-8 p-6 bg-gradient-to-br from-purple-100 to-pink-100 shadow-lg rounded-xl rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center text-purple-800 mb-4 font-fredoka">Our Journey</h2>
      {couple ? (
        <div className="space-y-4 text-gray-700 font-baloo2">
          <div> {/* Container for Relationship Status */}
            <p className="font-semibold text-purple-700 mb-1 text-lg">Relationship Status:</p>
            <div className="flex items-center">
              <PencilIcon onClick={() => onEditRelationshipStatus(couple.relationshipStatus || '')} />
              <p className="text-md font-fresca">{couple.relationshipStatus || 'Not set'}</p>
            </div>
          </div>
          <div> {/* Container for Our Story */}
            <p className="font-semibold text-purple-700 mb-1 text-lg">Our Story:</p>
            <div className="flex items-start"> {/* Use items-start for multiline text */}
              <PencilIcon onClick={() => onEditMeetStory(couple.meetStory || '')} />
              <p className="whitespace-pre-wrap text-md font-fresca">{couple.meetStory || 'No story yet. Share your journey!'}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 font-baloo2">No couple information available.</p>
      )}
    </div>
  );
};
