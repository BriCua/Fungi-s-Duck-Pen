import React from 'react';
import { Streak } from "./Streak";
import notifDefault from "../assets/icons/notif-default.webp";
import duck from "../assets/icons/duck.webp";
import profile from "../assets/icons/profile.webp";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Header: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <header className="top-0 z-40 bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Streak />
        </div>
        <nav className="flex gap-4">
          <button className="btn-ripple bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-lg w-12 h-12 flex items-center justify-center text-2xl">
            <img src={notifDefault} className="w-6 h-6" alt="Notifications" />
          </button>
          <button
            className="btn-ripple bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-lg w-12 h-12 flex items-center justify-center text-2xl"
            title="Inbox"
          >
            <img src={duck} alt="Duck" className="w-7 h-7" />
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="btn-ripple bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-lg w-12 h-12 flex items-center justify-center text-2xl"
            title="Profile"
          >
            <img src={profile} alt="Profile" className="w-6 h-6" />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
