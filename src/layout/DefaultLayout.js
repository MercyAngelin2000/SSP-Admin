import React, { useState } from 'react';
import AppContent from '../component/AppContent';
import Footer from '../component/Footer';
import Header from '../component/Header';
import Menu from '../component/Menu';
import '../component/Header.css';
import '../App.css'

function DefaultLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className='header'>
        <Header />
      </div>
      <div className='content'>
        <div className='sidebarmenucol'>
          <Menu onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        <div className='addcontentcol p-0'>
          <AppContent />
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default DefaultLayout;
