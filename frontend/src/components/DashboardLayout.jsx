import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ArrowLeft } from 'lucide-react';

const DashboardLayout = ({ isAdmin = false }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <Sidebar isAdmin={isAdmin} />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background text-foreground transition-all duration-300 relative">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 px-3 py-1.5 bg-background/50 hover:bg-background border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all shadow-sm text-sm"
          >
            <ArrowLeft size={16} />
            <span className="font-medium">Go Back</span>
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
