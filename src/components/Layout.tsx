import roomBg from "../assets/images/room.webp";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div
      className="relative flex flex-col min-h-screen"
      style={{
        backgroundColor: "#FFF8DC",
        backgroundImage: `url(${roomBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Keep background fixed during scroll
      }}
    >
      {/* Semi-transparent overlay - FIXED to viewport */}
      <div className="fixed inset-0 bg-[rgba(250,248,235,0.5)] pointer-events-none z-0" />

      {/* Content wrapper - scrolls over the fixed background/overlay */}
      <div className="relative z-10 flex flex-col flex-1">
        {children}
      </div>
    </div>
  );
};
