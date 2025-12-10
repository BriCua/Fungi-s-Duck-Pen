import { useState, useRef, useEffect, useCallback } from 'react';
import duckImage1 from '../assets/images/bebekz-1.webp';
import duckImage2 from '../assets/images/bebekz-2.webp';
import './DuckClicker.css';
import { SoundButton } from './ui/SoundButton';
import { useAuthContext } from '../context/AuthContext';
import { subscribeToQuackCount, incrementQuackCount } from '../firebase/quackService';
import { Spinner } from './ui/Spinner';
import Header from './Header'; // Import Header
import Footer from './Footer'; // Import Footer

const quacks = [
  "Quackz!", "Quackkk!!!", "quacks?", "Qweeekk!", "Quackers!", 
  "Quack.", "Quack...", "Quack Quack", "Quack Attack!"
];

const BATCH_INTERVAL = 2000; // 2 seconds

// Key generator functions
const getTotalKey = (uid: string) => `quackCount_${uid}`;
const getPendingKey = (uid: string) => `pendingQuacks_${uid}`;

const DuckClicker = () => {
  const { user, couple, loading: isLoading } = useAuthContext();
  
  // State for individual and partner counts
  const [myQuackCount, setMyQuackCount] = useState(0);
  const [partnerQuackCount, setPartnerQuackCount] = useState(0);

  // Other UI state
  const [buttonText, setButtonText] = useState("Quackz!");
  const [isScaled, setIsScaled] = useState(false);
  const [isAltImage, setIsAltImage] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpinningGlow, setIsSpinningGlow] = useState(false);

  const isAnimatingRef = useRef(false);
  const duckImgRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Effect to manage all data loading and subscriptions
  useEffect(() => {
    if (!user) {
      setMyQuackCount(0);
      setPartnerQuackCount(0);
      return;
    }
    
    // 1. Initialize my count from localStorage
    const myTotalKey = getTotalKey(user.uid);
    const savedMyQuacks = localStorage.getItem(myTotalKey);
    setMyQuackCount(savedMyQuacks ? parseInt(savedMyQuacks, 10) : 0);

    // 2. Subscribe to my own quack count from Firestore
    const unsubscribeMyCount = subscribeToQuackCount(user.uid, (serverCount) => {
      const pendingKey = getPendingKey(user.uid);
      const pending = parseInt(localStorage.getItem(pendingKey) || '0', 10);
      const newTotal = serverCount + pending;
      setMyQuackCount(newTotal);
      localStorage.setItem(myTotalKey, newTotal.toString());
    });

    // 3. Find partner from context and subscribe to their count
    let unsubscribePartnerCount = () => {};
    if (couple?.userIds) {
      const partnerId = couple.userIds.find((id: string) => id !== user.uid);
      if (partnerId) {
        unsubscribePartnerCount = subscribeToQuackCount(partnerId, (count) => {
          setPartnerQuackCount(count);
        });
      } else {
        setPartnerQuackCount(0);
      }
    } else {
        setPartnerQuackCount(0); // No partner, so their count is 0
    }

    return () => {
      unsubscribeMyCount();
      unsubscribePartnerCount();
    };
  }, [user, couple]);

  // Logic for batch saving my pending quacks
  const savePendingQuacks = useCallback(() => {
    if (!user) return;
    const pendingKey = getPendingKey(user.uid);
    const pending = parseInt(localStorage.getItem(pendingKey) || '0', 10);
    if (pending > 0) {
      localStorage.setItem(pendingKey, '0');
      incrementQuackCount(user.uid, pending)
        .catch(error => {
          console.error("Failed to save quacks, re-adding to pending:", error);
          const currentPending = parseInt(localStorage.getItem(pendingKey) || '0', 10);
          localStorage.setItem(pendingKey, (currentPending + pending).toString());
        });
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(savePendingQuacks, BATCH_INTERVAL);
    return () => clearInterval(interval);
  }, [savePendingQuacks]);

  useEffect(() => {
    window.addEventListener('beforeunload', savePendingQuacks);
    return () => window.removeEventListener('beforeunload', savePendingQuacks);
  }, [savePendingQuacks]);


  const handleButtonQuack = () => {
    if (!user) return;
    
    if (duckImgRef.current) {
      const img = duckImgRef.current;
      // Reset animation
      img.style.animation = 'none';
      void img.offsetWidth; // Trigger reflow
      img.style.animation = 'sink-rise 0.3s ease-in-out';
      
      // Reset animation after it completes
      const handler = () => {
        img.style.animation = '';
        img.removeEventListener('animationend', handler);
      }
      img.addEventListener('animationend', handler);
    }

    let newQuack = buttonText;
    while (newQuack === buttonText) {
      const randomIndex = Math.floor(Math.random() * quacks.length);
      newQuack = quacks[randomIndex];
    }
    setButtonText(newQuack);

    setMyQuackCount(prev => prev + 1);

    const totalKey = getTotalKey(user.uid);
    const pendingKey = getPendingKey(user.uid);
    localStorage.setItem(pendingKey, (parseInt(localStorage.getItem(pendingKey) || '0', 10) + 1).toString());
    localStorage.setItem(totalKey, (myQuackCount + 1).toString());

    if (!isMuted) {
        const quackSound = new Audio('/sounds/quack.mp3');
        quackSound.play().catch(err => console.log('Audio play failed:', err));
    }
  };
  
  const combinedTotal = myQuackCount + partnerQuackCount;

  const toggleMute = () => setIsMuted(prev => !prev);
  
  const handleDuckClick = () => {
    const img = duckImgRef.current;
    if (!img || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setIsScaled(true);
    setIsAltImage(true);
    setIsSpinningGlow(true);

    setTimeout(() => {
      setIsSpinningGlow(false);
      isAnimatingRef.current = false;
      setIsScaled(false);
      setIsAltImage(false);
    }, 800);
  };

  return (
    <>
      <Header />
      <main className="flex-1 w-full flex flex-col items-center justify-center pb-24">
        <audio ref={audioRef} src="/sounds/quack.mp3" />
        <div 
          style={{
            position: 'relative',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '20px',
            border: '2px solid rgba(255,255,255,0.4)',
            padding: '32px',
            width: '92dvw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '',
          }}
          className='backdrop-blur-sm'
        >
          <div className="absolute top-2 right-2">
            <SoundButton isMuted={isMuted} onToggle={toggleMute} />
          </div>
          <div className='text-5xl font-bold drop-shadow-lg text-[#FFFFFF] text-shadow-sm font-baloo2'>
            {isLoading ? (
              <Spinner size="lg" />
            ) : (
              <span>{combinedTotal} <span className='text-3xl'>Total Quacks!</span></span>
            )}
          </div>
          
          <button
            onClick={handleDuckClick}
            disabled={isAnimatingRef.current}
            className="focus:outline-none "
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: isAnimatingRef.current ? 'not-allowed' : 'pointer',
            }}
          >
            <img
              ref={duckImgRef}
              src={isAltImage ? duckImage2 : duckImage1}
              alt="Click the duck"
              className={`w-72 h-72 select-none ${isScaled ? 'scaled' : ''} ${isSpinningGlow ? 'spin-glow' : ''}`}
              style={{
                transition: isScaled ? 'none' : 'transform 0.3s ease-out',
              }}
            />
          </button>

          <button
            onClick={handleButtonQuack}
            className="quack-button-3d"
            disabled={!user || isLoading}
          >
            {buttonText}
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default DuckClicker;
