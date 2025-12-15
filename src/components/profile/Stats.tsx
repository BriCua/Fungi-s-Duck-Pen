import React, { useEffect, useState } from 'react';

import { useAuthContext } from '../../context/AuthContext';
import { subscribeToQuackCount } from '../../firebase/quackService';

interface StatsProps {}

export const Stats: React.FC<StatsProps> = () => {
  const { user, partner } = useAuthContext();
  const [myQuackz, setMyQuackz] = useState(0);
  const [partnerQuackz, setPartnerQuackz] = useState(0);
  const [streak, setStreak] = useState(0); 

  useEffect(() => {
    let unsubscribeMyQuackz: () => void = () => {};
    let unsubscribePartnerQuackz: () => void = () => {};

    if (user?.uid) {
      unsubscribeMyQuackz = subscribeToQuackCount(user.uid, setMyQuackz);
    }
    
    if (partner?.uid) {
      unsubscribePartnerQuackz = subscribeToQuackCount(partner.uid, setPartnerQuackz);
    }

    setStreak(10); // Placeholder

    return () => {
      unsubscribeMyQuackz();
      unsubscribePartnerQuackz();
    };
  }, [user, partner]);

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {/* My Quackz */}
      <div className="flex flex-col items-center justify-center p-4 bg-duck-yellow-dark rounded-lg shadow">
        <span className="text-4xl mb-2">🦆</span>
        <p className="text-2xl font-bold text-white">{myQuackz}</p>
        <h3 className="text-xs font-semibold text-duck-yellow-light mt-1">My Quackz</h3>
      </div>
      {/* Our Streak */}
      <div className="flex flex-col items-center justify-center p-4 bg-vibrant-orange rounded-lg shadow">
        <span className="text-4xl mb-2">🔥</span>
        <p className="text-2xl font-bold text-white">{streak}</p>
        <h3 className="text-xs font-semibold text-orange-100 mt-1">Our Streak</h3>
      </div>
      {/* Partner's Quackz */}
      <div className="flex flex-col items-center justify-center p-4 bg-duck-yellow-subtle rounded-lg shadow">
        <span className="text-4xl mb-2">🦆</span>
        <p className="text-2xl font-bold text-white">{partnerQuackz}</p>
        <h3 className="text-xs font-semibold text-yellow-50 mt-1">
          {partner ? `${partner.displayName}'s Quackz` : "Partner's Quackz"}
        </h3>
      </div>
    </div>
  );
};

