import React, { useState, ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';



interface LayoutProps {
  children: ReactNode; 
}


const Layout: React.FC<LayoutProps> = ({ children }) => { // Desestructura 'children'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children} {/* Renderiza los hijos pasados al Layout */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;