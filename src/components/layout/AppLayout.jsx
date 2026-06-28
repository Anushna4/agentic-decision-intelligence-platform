import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { usePlatform } from '../../context/PlatformContext';

const AppLayout = () => {
  const { user, selectedRole } = usePlatform();
  const location = useLocation();

  // Redirect to login if user session doesn't exist
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to role selection if user has not selected a role (and is not already on that page)
  if (!selectedRole && location.pathname !== '/role-selection') {
    return <Navigate to="/role-selection" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-600 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
