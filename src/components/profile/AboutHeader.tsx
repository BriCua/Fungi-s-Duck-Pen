import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { authService } from '../../firebase/authService';
import type { User } from '../../types';

interface AboutHeaderProps {}

export const AboutHeader: React.FC<AboutHeaderProps> = () => {
  const { user, couple } = useAuthContext();
  const [partnerUser, setPartnerUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchPartner = async () => {
      if (user?.uid && couple?.userIds && couple.userIds.length > 1) {
        const partnerId = couple.userIds.find((id) => id !== user.uid);
        console.log('Partner ID:', partnerId); // Debugging
        if (partnerId) {
          try {
            const fetchedPartner = await authService.getUserProfile(partnerId);
            console.log('Fetched Partner:', fetchedPartner); // Debugging
            setPartnerUser(fetchedPartner);
          } catch (error) {
            console.error("Failed to fetch partner's profile:", error); // Debugging
          }
        }
      } else {
        setPartnerUser(null);
        console.log('No user, couple, or partner found'); // Debugging
      }
    };
    fetchPartner();
  }, [user, couple]);

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
          <p className="text-lg font-semibold text-pond-blue-dark">{partnerUser?.displayName || 'Partner'}</p>
        </div>
      </div>
    </div>
  );
};
