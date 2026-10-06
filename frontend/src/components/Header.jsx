import React, { useState, useRef, useEffect } from 'react';

export default function Header({ currentPath, navigateTo, activeTicketsCount, authUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleNav = (path) => {
    navigateTo(path);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isStudent = authUser?.userType === 'student' || authUser?.role === 'student';
  const isAdmin = authUser?.userType === 'admin' || authUser?.role?.includes('admin');
  const roleLabel = isStudent ? 'Student' : (authUser?.department?.code ? `Admin (${authUser.department.code})` : 'Staff Admin');

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#fdf8f8]/90 backdrop-blur-md border-b border-[#e5e2e1]">
      <div className="h-14 max-w-[1120px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left section: Brand & Desktop Nav */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleNav('student-home')}
            className="flex items-center gap-2 text-left text-[#1c1b1c] hover:opacity-80 transition-opacity focus:outline-none cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#1b1b1e] text-white flex items-center justify-center font-bold text-sm tracking-tighter shadow-xs">
              CAI
            </div>
            <span className="font-headline-sm font-semibold tracking-tight text-[#1c1b1c] text-base">
              CampusAI
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-5">
            <button
              onClick={() => handleNav('student-home')}
              className={`transition-colors font-body-sm text-sm cursor-pointer ${
                currentPath === 'student-home'
                  ? 'text-[#1c1b1c] font-medium border-b-2 border-[#1b1b1e] pb-0.5'
                  : 'text-[#47464b] hover:text-[#1c1b1c]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('my-reports')}
              className={`flex items-center gap-1.5 transition-colors font-body-sm text-sm cursor-pointer ${
                currentPath === 'my-reports'
                  ? 'text-[#1c1b1c] font-medium border-b-2 border-[#1b1b1e] pb-0.5'
                  : 'text-[#47464b] hover:text-[#1c1b1c]'
              }`}
            >
              <span>My Reports</span>
              {activeTicketsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#f1eded] text-[#47464b] text-[10px] font-semibold border border-[#c8c5cb]">
                  {activeTicketsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNav('admin-portal')}
              className={`flex items-center gap-1 transition-colors font-body-sm text-sm px-2.5 py-0.5 rounded-full cursor-pointer ${
                currentPath === 'admin-portal'
                  ? 'bg-[#1b1b1e] text-white font-medium'
                  : 'bg-[#f7f3f2] text-[#39618c] font-semibold hover:bg-[#e5e2e1] border border-[#a2cafb]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">shield_person</span>
              <span>Admin Portal</span>
            </button>
          </nav>
        </div>

        {/* Right section: Action button & Profile & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav('report-a-problem')}
            className="inline-flex items-center justify-center h-8 px-3 font-label-md text-xs sm:text-sm rounded-md border border-[#c8c5cb] bg-white text-[#1c1b1c] hover:bg-[#f7f3f2] hover:text-[#1c1b1c] active:scale-[0.98] transition-all shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] mr-1 hidden xs:inline">add</span>
            <span>Report a Problem</span>
          </button>

          {/* User Profile Menu Dropdown */}
          <div className="relative pl-1" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-[#f7f3f2] border border-transparent hover:border-[#e5e2e1] transition-all focus:outline-none cursor-pointer"
              title={`${authUser?.name || 'User'} (${roleLabel})`}
            >
              {authUser?.avatar ? (
                <img
                  alt={authUser?.name || 'User Profile'}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#c8c5cb]/60 shadow-2xs"
                  src={authUser.avatar}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#1b1b1e] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {authUser?.name ? authUser.name.charAt(0) : 'U'}
                </div>
              )}
              <span className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-[#1c1b1c]">
                <span className="max-w-[100px] truncate">{authUser?.name?.split(' ')[0] || 'User'}</span>
                <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                  isStudent ? 'bg-blue-100 text-blue-800' : 'bg-slate-800 text-white'
                }`}>
                  {isStudent ? 'Student' : 'Staff'}
                </span>
              </span>
            </button>

            {/* Profile Dropdown Panel */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e5e2e1] p-3 text-left z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2.5 bg-[#f7f3f2] rounded-xl mb-2 flex items-center gap-3">
                  {authUser?.avatar ? (
                    <img
                      alt={authUser?.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-[#c8c5cb]"
                      src={authUser.avatar}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1b1b1e] text-white flex items-center justify-center font-bold text-sm">
                      {authUser?.name ? authUser.name.charAt(0) : 'U'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#1c1b1c] truncate">{authUser?.name || 'Logged User'}</h4>
                    <p className="text-[11px] text-[#77767b] truncate">{authUser?.email}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded uppercase tracking-wider ${
                        isStudent ? 'bg-blue-100 text-[#39618c]' : 'bg-[#1b1b1e] text-white'
                      }`}>
                        {roleLabel}
                      </span>
                      {authUser?.rollNumber && (
                        <span className="text-[10px] text-[#77767b] font-mono">#{authUser.rollNumber}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <button
                    onClick={() => handleNav('student-home')}
                    className="w-full px-3 py-2 rounded-xl text-[#1c1b1c] hover:bg-[#f7f3f2] text-left flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">home</span>
                    <span>Student Dashboard</span>
                  </button>

                  <button
                    onClick={() => handleNav('admin-portal')}
                    className="w-full px-3 py-2 rounded-xl text-[#1c1b1c] hover:bg-[#f7f3f2] text-left flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">shield_person</span>
                    <span>Admin Staff Desk</span>
                  </button>

                  <div className="my-1 border-t border-[#e5e2e1]"></div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-semibold text-left flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1.5 text-[#47464b] hover:text-[#1c1b1c] rounded-md hover:bg-[#f1eded] transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-2xl select-none">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#fdf8f8] border-b border-[#e5e2e1] px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 bg-[#f7f3f2] rounded-xl flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-bold text-[#1c1b1c]">{authUser?.name}</p>
              <p className="text-[10px] text-[#77767b]">{roleLabel}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold"
            >
              Sign Out
            </button>
          </div>

          <button
            onClick={() => handleNav('student-home')}
            className={`w-full text-left px-3 py-2 rounded-md font-medium text-sm flex items-center justify-between ${
              currentPath === 'student-home'
                ? 'bg-[#f1eded] text-[#1c1b1c]'
                : 'text-[#47464b] hover:bg-[#f7f3f2]'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">home</span>
              Home
            </span>
          </button>
          
          <button
            onClick={() => handleNav('my-reports')}
            className={`w-full text-left px-3 py-2 rounded-md font-medium text-sm flex items-center justify-between ${
              currentPath === 'my-reports'
                ? 'bg-[#f1eded] text-[#1c1b1c]'
                : 'text-[#47464b] hover:bg-[#f7f3f2]'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">assignment</span>
              My Reports
            </span>
            {activeTicketsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#1b1b1e] text-white text-xs font-semibold">
                {activeTicketsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNav('report-a-problem')}
            className={`w-full text-left px-3 py-2 rounded-md font-medium text-sm flex items-center gap-2 ${
              currentPath === 'report-a-problem'
                ? 'bg-[#1b1b1e] text-white'
                : 'bg-[#f7f3f2] text-[#1c1b1c] border border-[#c8c5cb]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Report New Problem
          </button>

          <button
            onClick={() => handleNav('admin-portal')}
            className={`w-full text-left px-3 py-2 rounded-md font-semibold text-sm flex items-center gap-2 ${
              currentPath === 'admin-portal'
                ? 'bg-[#1b1b1e] text-white'
                : 'bg-[#d1e4ff] text-[#001d36] border border-[#a2cafb]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">shield_person</span>
            Department Admin Portal
          </button>
        </div>
      )}
    </header>
  );
}

