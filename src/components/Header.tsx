import React from "react";
import { Streak } from "./Streak";
import notifDefault from "../assets/icons/notif-default.webp";
import notifUnread from "../assets/icons/notif-unread.webp";
import { useNotifications } from "../hooks/useNotifications";
/* import duck from "../assets/icons/duck.webp"; */
import quests from "../assets/icons/notes.svg";
import profile from "../assets/icons/profile.webp";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Header: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { unreadCount } = useNotifications();

  return (
    <header className="top-0 z-40 bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Streak />
        </div>
        <nav className="flex gap-4">
          <button
            onClick={() => navigate("/notifications")}
            className="btn-ripple bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-lg w-12 h-12 flex items-center justify-center text-2xl relative" // Added relative for badge positioning
            title="Notifications"
          >
            <img
              src={unreadCount > 0 ? notifUnread : notifDefault}
              className="w-6 h-6"
              alt="Notifications"
            />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        {/*   <button
            className="btn-ripple bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-lg w-12 h-12 flex items-center justify-center text-2xl"
            title="Duck?"
          >
            <img src={duck} alt="Duck" className="w-7 h-7" />
          </button> */}
          <button
            onClick={()=>navigate("/goals")}
            className="btn-ripple bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-lg w-12 h-12 flex items-center justify-center text-2xl"
            title="Quests"
          >
            <img src={quests} alt="Quests" className="w-7 h-7" />
          </button>
          <button
            onClick={() => navigate("/profile")}
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
