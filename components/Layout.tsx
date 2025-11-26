import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, Globe, Briefcase, GraduationCap,
  Handshake, MapPinned, Cpu, BookOpenCheck, UserCheck,
  Info, Menu, ChevronRight, Settings, LogOut
} from 'lucide-react';
import { AppRoute } from '../types';

const NAV_ITEMS = [
  { name: 'Home', path: AppRoute.DASHBOARD, icon: LayoutDashboard },
  { name: 'Study Abroad', path: AppRoute.STUDY_ABROAD, icon: Globe },
  { name: 'Jobs', path: AppRoute.JOBS, icon: Briefcase },
  { name: 'Internships', path: AppRoute.INTERNSHIPS, icon: GraduationCap },
  { name: 'Freelance', path: AppRoute.FREELANCE, icon: Handshake },
  { name: 'Country Explorer', path: AppRoute.COUNTRIES, icon: MapPinned },
  { name: 'AI Marketplace', path: AppRoute.AI_MARKETPLACE, icon: Cpu },
  { name: 'Learning', path: AppRoute.LEARNING, icon: BookOpenCheck },
  { name: 'Consultants', path: AppRoute.CONSULTANTS, icon: UserCheck },
  { name: 'About Us', path: AppRoute.ABOUT, icon: Info },
];

const HEADER_LINKS = [
  { name: 'Jobs', path: AppRoute.JOBS },
  { name: 'Freelance', path: AppRoute.FREELANCE },
  { name: 'Study Abroad', path: AppRoute.STUDY_ABROAD },
  { name: 'About Us', path: AppRoute.ABOUT },
];

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const current = NAV_ITEMS.find(item => item.path === location.pathname);
    if (location.pathname === AppRoute.ADMIN) return 'CMS Admin';
    if (location.pathname.startsWith('/p/')) return 'Page Viewer';
    return current ? current.name : '';
  };

  const handleNavClick = () => {
    // Close sidebar after any navigation item is clicked
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden relative selection:bg-[#FF9500]/30 font-sans text-gray-800">
     
      {/* Light Ash Grey Background with Subtle Animations */}
      <div className="fixed inset-0 z-0 bg-[#f8f9fa]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gray-300/20 rounded-full blur-[120px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gray-400/15 rounded-full blur-[120px] animate-pulse duration-[10000ms]" />
        <div className="absolute top-[20%] right-[30%] w-[30%] h-[30%] bg-gray-500/10 rounded-full blur-[100px] animate-pulse duration-[12000ms]" />
        <div className="absolute bottom-[20%] left-[20%] w-[25%] h-[25%] bg-gray-300/15 rounded-full blur-[80px]" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden by default, shows when clicked */}
      <aside className={`
        fixed inset-y-0 left-0 z-40
        w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-28 flex items-center justify-center px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center justify-center hover:opacity-80 transition-opacity" onClick={handleNavClick}>
            <img
              src="/assets/logo.png"
              alt="Sunshine Careers"
              className="h-20 w-48 object-contain"
              onError={(e) => {
                console.log('Logo failed to load');
                e.target.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'h-20 w-48 bg-gradient-to-r from-[#FF9500] to-orange-600 rounded-lg flex items-center justify-center text-white font-bold';
                placeholder.innerHTML = `
                  <div class="text-center">
                    <div class="text-2xl font-bold">SUNSHINE</div>
                    <div class="text-sm mt-1 font-medium">CAREERS</div>
                  </div>
                `;
                e.target.parentNode.appendChild(placeholder);
              }}
            />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden
                ${isActive
                  ? 'bg-gradient-to-r from-[#FF9500] to-orange-600 text-white shadow-lg shadow-orange-500/25'
                  : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800 transition-colors'} strokeWidth={2} />
                  <span className="relative z-10">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
         
          <div className="my-4 border-t border-gray-200/60 mx-2"></div>
         
          <NavLink
            to={AppRoute.ADMIN}
            onClick={handleNavClick}
            className={({ isActive }) => `
              flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group hover:bg-gray-100/80
              ${isActive
                ? 'bg-gray-800 text-white shadow-lg'
                : 'text-gray-700 hover:text-gray-900'}
            `}
          >
            <Settings size={20} />
            <span>CMS Admin</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden group cursor-pointer border border-gray-700/50">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe size={60} />
            </div>
            <h3 className="text-sm font-bold relative z-10">Go Premium</h3>
            <p className="text-xs text-gray-300 mt-1 relative z-10 mb-4 opacity-80">Unlock unlimited AI tools & scans</p>
            <button className="w-full text-xs bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]">
              Upgrade Now <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Transparent Header with Navigation Panel */}
        <header className="h-20 sticky top-0 z-30 transition-all">
          {/* Glass Navigation Panel */}
          <div className="bg-white/5 backdrop-blur-md border-b border-white/02 flex items-center justify-between px-6 lg:px-8 h-full">
            {/* Left Section - Menu Button and Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-600 hover:bg-gray-100/80 rounded-xl transition-colors active:scale-95"
              >
                <Menu size={24} />
              </button>
             
              {/* Logo in Header - Always Visible */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center justify-center hover:opacity-80 transition-opacity">
                  <img
                    src="/assets/logo.png"
                    alt="Sunshine Careers"
                    className="h-16 w-auto object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const placeholder = document.createElement('div');
                      placeholder.className = 'h-10 px-4 bg-gradient-to-r from-[#FF9500] to-orange-600 rounded-lg flex items-center justify-center text-white font-bold';
                      placeholder.innerHTML = `
                        <div class="text-center">
                          <div class="text-lg font-bold">SUNSHINE</div>
                        </div>
                      `;
                      e.target.parentNode.appendChild(placeholder);
                    }}
                  />
                </Link>
              </div>
            </div>
           
            {/* Center Section - Desktop Header Navigation */}
            <div className="hidden lg:flex items-center gap-1 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm mx-auto">
               {HEADER_LINKS.map(link => (
                 <NavLink
                   key={link.path}
                   to={link.path}
                   className={({ isActive }) => `
                     px-5 py-2 rounded-full text-sm font-bold transition-all duration-300
                     ${isActive
                       ? 'bg-gray-100 text-[#FF9500]'
                       : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}
                   `}
                 >
                   {link.name}
                 </NavLink>
               ))}
            </div>
           
            {/* Right Section - User Info */}
            <div className="flex items-center gap-6">
              <div className="h-8 w-px bg-gray-300/60 hidden md:block"></div>
              <button className="hidden sm:block text-sm font-medium text-gray-600 hover:text-[#FF9500] transition-colors">Help Center</button>
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden md:block leading-tight">
                  <p className="text-sm font-bold text-gray-800">Jane Doe</p>
                  <p className="text-[10px] font-semibold text-[#FF9500] uppercase tracking-wide">Pro Member</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#FF9500] to-orange-400 p-[2px] shadow-lg shadow-orange-500/20 cursor-pointer hover:scale-105 transition-transform group">
                   <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <span className="text-[#FF9500] font-bold text-sm group-hover:hidden">JD</span>
                      <UserCheck size={16} className="text-[#FF9500] hidden group-hover:block" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-0 scroll-smooth custom-scrollbar">
          <div className="w-full pb-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};