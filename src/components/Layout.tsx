import roomBg from "../assets/images/room.webp";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundColor: "#FFF8DC",
        backgroundImage: `url(${roomBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="w-full h-full absolute bg-[rgba(250,248,235,0.5)] pointer-events-none" />

      {/* Content wrapper - now directly renders children */}
      <div className="relative z-10 flex flex-col flex-1">
        {children}
      </div>
    </div>
  );
};
