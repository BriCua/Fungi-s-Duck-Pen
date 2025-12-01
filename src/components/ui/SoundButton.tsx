interface SoundButtonProps {
  isMuted: boolean;
  onToggle: () => void;
}

export const SoundButton = ({ isMuted, onToggle }: SoundButtonProps) => {
  const ORANGE_COLOR = '#FF8C42'; // The hex code for vibrant-orange

  // Volume On Icon with hardcoded orange color
  const VolumeOnIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="28" 
      height="28" 
      viewBox="0 0 24 24" 
      fill={ORANGE_COLOR}
      stroke={ORANGE_COLOR}
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );

  // Volume Off Icon
  const VolumeOffIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="28" 
      height="28" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-gray-500"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );

  return (
    <button 
      onClick={onToggle} 
      className="bg-transparent p-1 transition-all duration-200 hover:opacity-70 active:scale-90 focus:outline-none"
      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      title={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
    </button>
  );
};