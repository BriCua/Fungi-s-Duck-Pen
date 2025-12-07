import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui';
import { useAuthContext } from '../../context/AuthContext';
import { subscribeToQuackCount } from '../../firebase/quackService';
import { authService } from '../../firebase/authService';
import type { User } from '../../types';

interface StatsProps {}

export const Stats: React.FC<StatsProps> = () => {
  const { user, couple } = useAuthContext();
  const [myQuackz, setMyQuackz] = useState(0);
  const [partnerQuackz, setPartnerQuackz] = useState(0);
  const [partnerUser, setPartnerUser] = useState<User | null>(null);
  const [streak, setStreak] = useState(0); 

  useEffect(() => {
    let unsubscribeMyQuackz: () => void = () => {};
    let unsubscribePartnerQuackz: () => void = () => {};

    if (user?.uid) {
      unsubscribeMyQuackz = subscribeToQuackCount(user.uid, setMyQuackz);
    }

    const fetchPartner = async () => {
      if (couple?.userIds && user?.uid) {
        const partnerId = couple.userIds.find((id) => id !== user.uid);
        if (partnerId) {
          unsubscribePartnerQuackz = subscribeToQuackCount(partnerId, setPartnerQuackz);
          try {
            const fetchedPartner = await authService.getUserProfile(partnerId);
            setPartnerUser(fetchedPartner);
          } catch (error) {
            console.error("Failed to fetch partner's profile:", error);
          }
        }
      }
    };
    
    fetchPartner();
    setStreak(10); // Placeholder

    return () => {
      unsubscribeMyQuackz();
      unsubscribePartnerQuackz();
    };
  }, [user, couple]);

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {/* My Quackz */}
      <Card className="flex flex-col items-center justify-center p-4 bg-duck-yellow-subtle">
        <span className="text-4xl mb-2">🦆</span>
        <p className="text-2xl font-bold text-white">{myQuackz}</p>
        <h3 className="text-xs font-semibold text-yellow-50 mt-1">My Quackz</h3>
      </Card>
      {/* Our Streak */}
      <Card className="flex flex-col items-center justify-center p-4 bg-vibrant-orange">
        <span className="text-4xl mb-2">🔥</span>
        <p className="text-2xl font-bold text-white">{streak}</p>
        <h3 className="text-xs font-semibold text-orange-100 mt-1">Our Streak</h3>
      </Card>
      {/* Partner's Quackz */}
      <Card className="flex flex-col items-center justify-center p-4 bg-duck-yellow-dark">
        <span className="text-4xl mb-2">🦆</span>
        <p className="text-2xl font-bold text-white">{partnerQuackz}</p>
        <h3 className="text-xs font-semibold text-duck-yellow-light mt-1">
          {partnerUser ? `${partnerUser.displayName}'s Quackz` : "Partner's Quackz"}
        </h3>
      </Card>
    </div>
  );
};

