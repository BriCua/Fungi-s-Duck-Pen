import React from 'react';
import { Link } from 'react-router-dom';
import profileIcon from '../assets/icons/profile.webp';
import duckIcon from '../assets/icons/duck.webp';
import fireIcon from '../assets/icons/fire.webp';
import notFireIcon from '../assets/icons/not-fire.webp';
import notes from '../assets/icons/notes.svg';

const footerIcons = [
  {alt: 'Profile', src: profileIcon, to: '/profile'},
  {alt: 'Duck', src: duckIcon, to: '/'},
  {alt: 'Fire', src: fireIcon, to: ''},
  {alt: 'Not Fire', src: notFireIcon, to: ''},
  {alt: 'Duck Quests', src: notes, to: '/goals'},
];

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 flex justify-around items-center">
      {footerIcons.map((icon, index) => (
        icon.to ? (
          <Link
            key={index}
            to={icon.to}
            className="btn-ripple bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-lg w-12 h-12 flex items-center justify-center text-2xl"
          >
            <img src={icon.src} alt={icon.alt} className="w-8 h-8" />
          </Link>
        ) : (
          <button
            key={index}
            className="btn-ripple bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-lg w-12 h-12 flex items-center justify-center text-2xl"
          >
            <img src={icon.src} alt={icon.alt} className="w-8 h-8" />
          </button>
        )
      ))}
    </footer>
  );
};

export default Footer;
