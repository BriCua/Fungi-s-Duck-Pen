import React from 'react';
import profileIcon from '../assets/icons/profile.webp';
import duckIcon from '../assets/icons/duck.webp';
import fireIcon from '../assets/icons/fire.webp';
import notFireIcon from '../assets/icons/not-fire.webp';
import notifDefaultIcon from '../assets/icons/notif-default.webp';

const placeholderIcons = [
  profileIcon,
  duckIcon,
  fireIcon,
  notFireIcon,
  notifDefaultIcon,
];

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 flex justify-around items-center">
      {placeholderIcons.map((icon, index) => (
        <button
          key={index}
          className="btn-ripple bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-lg w-12 h-12 flex items-center justify-center text-2xl"
        >
          <img src={icon} alt={`Feature ${index + 1}`} className="w-8 h-8" />
        </button>
      ))}
    </footer>
  );
};

export default Footer;
