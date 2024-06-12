import React, { useState } from 'react';
import AppContent from '../component/AppContent';
import Footer from '../component/Footer';
import Header from '../component/Header';
import Menu from '../component/Menu';
import '../component/Header.css';
import '../App.css'

function DefaultLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className={sidebarOpen ? "header fixed-top" : "headerMenuClose fixed-top" }>
        <Header />
      </div>
      <div className='content'>
        <div className={`sidebarmenucol ${sidebarOpen ? 'open':''}`}>
          <Menu onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} barStatus={sidebarOpen} />
        </div>
        <div className='addcontentcol px-4 pt-4 mt-5'>
          <AppContent />
        </div>
      </div>
      {/* <div>
        <Footer />
      </div> */}
    </div>
  );
}

export default DefaultLayout;
