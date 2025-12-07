import { useState } from "react";
import fire from "../assets/icons/fire.webp";
import notFire from "../assets/icons/not-fire.webp";

export const Streak = () => {
  const [streaked, setStreaked] = useState(false);
  const [streak, setStreak] = useState(0);

  const handleClick = () => {
    setStreaked(!streaked);
    setStreak(streaked ? 0 : 100); // Reset to 0 if un-streaking, else start at 1
  };

  return (
    <button
      className={
        streaked
          ? "bg-vibrant-orange backdrop-blur-xs rounded-xl border border-white/40 shadow-lg w-fit h-12 flex items-center justify-center pl-3 pr-4 text-2xl"
          : "bg-disabled-grey backdrop-blur-xs rounded-xl border border-white/40 shadow-lg w-fit h-12 flex items-center justify-center pl-3 pr-4 text-2xl"
      }
      title="Streak"
      onClick={handleClick} // Example interaction
    >
      <img
        src={streaked ? fire : notFire}
        alt="Streak Fire"
        className={
          streaked
            ? "w-6 h-6  mr-2 flame-glow"
            : "w-6 h-6  mr-2 "
        }
      ></img>
      <span
        className={streaked ? "streaked font-fredoka" : "not-streaked font-fredoka"}
        id="streak-count"
      >
        {streak}
      </span>
    </button>
  );
};
