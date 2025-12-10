import React from 'react';
import { useAuthContext } from '../../context/AuthContext';

interface AboutHeaderProps {}

export const AboutHeader: React.FC<AboutHeaderProps> = () => {
  const { user, partner } = useAuthContext();

  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-pond-blue-dark mb-4 font-fredoka">About Us</h1>
      <div className="flex items-center justify-center space-x-12">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-2xl font-bold mb-2">
            ?
          </div>
          <p className="text-lg font-semibold text-pond-blue-dark">{user?.displayName || 'You'}</p>
        </div>
        <span className="text-pond-blue-dark text-3xl font-bold">&</span>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-2xl font-bold mb-2">
            ?
          </div>
          <p className="text-lg font-semibold text-pond-blue-dark">{partner?.displayName || 'Partner'}</p>
        </div>
      </div>
    </div>
  );
};
