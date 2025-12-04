import React from 'react';
import Sidebar from './Sidebar';
import { MobileNav } from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar currentView={currentView} onNavigate={onNavigate} />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden h-full w-full bg-slate-50/50">
        {/* Content Padding Wrapper: extra bottom padding for mobile nav */}
        <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto min-h-full animate-fade-in">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentView={currentView} onNavigate={onNavigate} />
    </div>
  );
};