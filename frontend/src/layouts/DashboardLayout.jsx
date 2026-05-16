import React from 'react';

const DashboardLayout = ({ children, sidebar, navbar }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar Area */}
      <div className="hidden md:flex">
        {sidebar}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {navbar}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
