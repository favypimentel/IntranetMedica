import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ToastContainer from '../ui/Toast';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-primary-100 selection:text-primary-900">
      <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 lg:ml-64 flex flex-col justify-between">
          <div className="max-w-7xl w-full mx-auto animate-fade-in">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Layout;
