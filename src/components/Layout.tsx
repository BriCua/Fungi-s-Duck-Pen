import roomBg from "../assets/images/room.webp";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundColor: "#FFF8DC",
        backgroundImage: `url(${roomBg})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      {/* Semi-transparent overlay */}
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 248, 220, 0.7)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 shadow-md bg-duck-yellow-dark border-b-2 border-duck-yellow-subtle">
          <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🦆</span>
            </div>
            <nav className="flex gap-6">
              {/* Inbox */}
              <button
                className="text-2xl hover:opacity-70 transition"
                title="Inbox"
              >
                📬
              </button>
              {/* Points/Rewards */}
              <button
                className="text-2xl hover:opacity-70 transition"
                title="Points"
              >
                ⭐
              </button>
              {/* Streak */}
              <button
                className="text-2xl hover:opacity-70 transition"
                title="Streak"
              >
                🔥
              </button>
              {/* Profile/Settings */}
              <button
                className="text-2xl hover:opacity-70 transition"
                title="Profile"
              >
                👤
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full flex items-center justify-center">
          {children}
        </main>

        {/* Footer */}
        <footer
          className="shadow-md"
          style={{
            backgroundColor: "#FFC700", // Solid duck-yellow-dark color
            borderTop: "2px solid #FFD580",
          }}
        >
          <div className="max-w-7xl mx-auto text-center p-6">
            <p style={{ color: "#FF8C42", fontWeight: "500" }}>
              🦆 Quack quack! Your relationship sanctuary. © 2025 Fungi's Duck
              Pen
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
