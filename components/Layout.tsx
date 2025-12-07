import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full scifi-bg relative text-slate-200 flex flex-col p-6">
      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
      
      {/* Horizontal Scanning Line Animation */}
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20 blur-sm animate-[scan_4s_ease-in-out_infinite] pointer-events-none"></div>

      {children}
    </div>
  );
};
