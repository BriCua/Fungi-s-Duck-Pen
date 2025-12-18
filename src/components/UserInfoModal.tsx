import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAuthContext } from '../context/AuthContext';
import { coupleService } from '../firebase/coupleService';

export interface ProfileData {
  displayName: string;
  birthdate: Date | null;
  relationshipStatus: string;
  anniversary: Date | null;
  meetStory: string;
}

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void; // This is the "onSkip" handler
  onSubmit: (data: ProfileData) => void;
  initialDisplayName: string;
  skipText?: string;
  isPartner: boolean;
}

export const UserInfoModal: React.FC<UserInfoModalProps> = ({ isOpen, onClose, onSubmit, initialDisplayName, skipText, isPartner }) => {
  const { user } = useAuthContext();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Step 1 state
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');

  // Step 2 state
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [anniversaryDay, setAnniversaryDay] = useState('');
  const [anniversaryMonth, setAnniversaryMonth] = useState('');
  const [anniversaryYear, setAnniversaryYear] = useState('');
  const [meetStory, setMeetStory] = useState('');
  const [isLoadingCoupleData, setIsLoadingCoupleData] = useState(false);


  useEffect(() => {
    setDisplayName(initialDisplayName);
  }, [initialDisplayName]);

  // Fetch existing couple data when modal opens or user changes
  useEffect(() => {
    if (isOpen && user?.coupleId) {
      setError(''); // Clear error on open
      setIsLoadingCoupleData(true);
      coupleService.getCoupleData(user.coupleId)
        .then(data => {
          if (data) {
            setRelationshipStatus(data.relationshipStatus || '');
            if (data.anniversary) {
              const annivDate = new Date(data.anniversary);
              setAnniversaryDay(String(annivDate.getUTCDate()));
              setAnniversaryMonth(String(annivDate.getUTCMonth() + 1));
              setAnniversaryYear(String(annivDate.getUTCFullYear()));
            }
            setMeetStory(data.meetStory || '');
          }
        })
        .finally(() => {
          setIsLoadingCoupleData(false);
        });
    }
  }, [isOpen, user?.coupleId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const birthdate = (birthDay && birthMonth && birthYear)
      ? new Date(Number(birthYear), Number(birthMonth) - 1, Number(birthDay))
      : null;
    
    // Check if the date components were provided but resulted in an invalid date
    if (birthDay && birthMonth && birthYear && birthdate && (isNaN(birthdate.getTime()) || birthdate.getDate() !== Number(birthDay))) {
      setError('Please enter a valid birthdate.');
      return;
    }
    
    const anniversary = (anniversaryDay && anniversaryMonth && anniversaryYear)
      ? new Date(Number(anniversaryYear), Number(anniversaryMonth) - 1, Number(anniversaryDay))
      : null;
      
    if (!isPartner && anniversaryDay && anniversaryMonth && anniversaryYear && anniversary && (isNaN(anniversary.getTime()) || anniversary.getDate() !== Number(anniversaryDay))) {
        setError('Please enter a valid anniversary date.');
        return;
    }

    onSubmit({
      displayName,
      birthdate,
      relationshipStatus,
      anniversary,
      meetStory,
    });
  };

  const currentYear = new Date().getFullYear();
  const birthYears = Array.from({ length: 80 - 10 + 1 }, (_, i) => currentYear - 10 - i);
  const anniversaryYears = Array.from({ length: 80 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  const relationshipStatuses = ["Dating", "Engaged", "Married", "It's Complicated"];

  return (
    <Modal isOpen={isOpen} onClose={onClose} cancelText={skipText || 'Skip'} title={isPartner ? "About You" : (step === 1 ? "About You (1/2)" : "About Your Relationship (2/2)")}>
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="mb-4">
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <Input id="displayName" type="text" value={displayName} onChange={setDisplayName} placeholder="Enter your display name" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                  <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)} className="block w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="" disabled>Day</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} className="block w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="" disabled>Month</option>
                    {months.map(m => <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'short' })}</option>)}
                  </select>
                  <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className="block w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="" disabled>Year</option>
                    {birthYears.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <div className="flex justify-end mt-4">
                {isPartner ? (
                  <Button type="submit">Save and Continue</Button>
                ) : (
                  <Button type="button" onClick={() => setStep(2)}>Next</Button>
                )}
              </div>
            </>
          )}

          {!isPartner && step === 2 && (
            <>
              {isLoadingCoupleData ? <p>Loading...</p> : <>
                <div className="mb-4">
                  <label htmlFor="relationshipStatus" className="block text-sm font-medium text-gray-700 mb-1">Relationship Status</label>
                  <select id="relationshipStatus" value={relationshipStatus} onChange={(e) => setRelationshipStatus(e.target.value)} className="block w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="" disabled>Select status...</option>
                    {relationshipStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Anniversary</label>
                  <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                    <select value={anniversaryDay} onChange={(e) => setAnniversaryDay(e.target.value)} className="block w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option value="" disabled>Day</option>
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={anniversaryMonth} onChange={(e) => setAnniversaryMonth(e.target.value)} className="block w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option value="" disabled>Month</option>
                      {months.map(m => <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'short' })}</option>)}
                    </select>
                    <select value={anniversaryYear} onChange={(e) => setAnniversaryYear(e.target.value)} className="block w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option value="" disabled>Year</option>
                      {anniversaryYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="meetStory" className="block text-sm font-medium text-gray-700 mb-1">How did you meet?</label>
                  <textarea id="meetStory" value={meetStory} onChange={(e) => setMeetStory(e.target.value)} rows={3} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Tell us your story..."></textarea>
                </div>
              </>}

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              
              <div className="flex justify-between mt-4">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit">Save and Continue</Button>
              </div>
            </>
          )}
        </form>
      </div>
    </Modal>
  );
};

// Removed the extra closing parenthesis here
// export default UserInfoModal; // No default export