import { useState, useRef } from 'react'
import duckImage1 from '../assets/images/bebekz-1.webp'
import duckImage2 from '../assets/images/bebekz-2.webp'
import './DuckClicker.css'
import { SoundButton } from './ui/SoundButton';

const quacks = [
  "Quackz!",
  "Quackkk!!!",
  "quacks?",
  "Qweeekk!",
  "Quackers!",
  "Quack.",
  "Quack...",
  "Quack Quack",
  "Quack Attack!"
];

const DuckClicker = () => {
  const [quackCount, setQuackCount] = useState(0)
  const [buttonText, setButtonText] = useState("Quackz!");
  const [isScaled, setIsScaled] = useState(false)
  const [isAltImage, setIsAltImage] = useState(false)
  const [isMuted, setIsMuted] = useState(false);
  const [isSpinningGlow, setIsSpinningGlow] = useState(false); // New state for spin and glow
  const isAnimatingRef = useRef(false)
  const duckImgRef = useRef<HTMLImageElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleDuckClick = () => {
    const img = duckImgRef.current
    if (!img || isAnimatingRef.current) return

    isAnimatingRef.current = true
    setIsScaled(true)
    setIsAltImage(true)
    setIsSpinningGlow(true); // Start spin and glow

    // Stop spin and glow after animation duration
    setTimeout(() => {
      setIsSpinningGlow(false);
      isAnimatingRef.current = false;
      setIsScaled(false);
      setIsAltImage(false);
    }, 800); // 0.s is the duration of spin-smooth
  }

  const handleButtonQuack = () => {
    if (duckImgRef.current) {
      const img = duckImgRef.current
      // Reset animation
      img.style.animation = 'none'
      void img.offsetWidth // Trigger reflow
      img.style.animation = 'sink-rise 0.3s ease-in-out'
      
      // Reset animation after it completes
      const handler = () => {
        img.style.animation = ''
        img.removeEventListener('animationend', handler)
      }
      img.addEventListener('animationend', handler)
    }

    let newQuack = buttonText;
    while (newQuack === buttonText) {
      const randomIndex = Math.floor(Math.random() * quacks.length);
      newQuack = quacks[randomIndex];
    }
    setButtonText(newQuack);

    setQuackCount(prev => prev + 1)
    if (!isMuted) {
      // Create new audio instance for spammable playback
      const quackSound = new Audio('/sounds/quack.mp3')
      quackSound.play().catch(err => console.log('Audio play failed:', err))
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-12 w-full h-full">
      {/* Audio placeholder */}
      <audio ref={audioRef} src="/sounds/quack.mp3" />


      {/* Duck Section */}
      <div 
        style={{
          position: 'relative', // Set position context for the button
          backgroundColor: '#FFFACDCF',
          borderRadius: '16px',
          border: '3px solid #FFD580',
          padding: '32px',
          width: '95dvw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '',
        }}
      >
        <div className="absolute top-4 right-4">
          <SoundButton isMuted={isMuted} onToggle={toggleMute} />
        </div>
        <div className='text-5xl font-bold drop-shadow-lg text-[#F2AE27] font-baloo2'>
          {quackCount} <span className='text-3xl'>Quacks!</span>
        </div>
        
        {/* Duck Image - Click to spin */}
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

        {/* Quack Counter Button */}
        <button
          onClick={handleButtonQuack}
          className="quack-button-3d"
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}

export default DuckClicker
