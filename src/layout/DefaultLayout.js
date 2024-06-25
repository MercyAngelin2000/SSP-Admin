import React, { createContext, useEffect, useState } from 'react';
import AppContent from '../component/AppContent';
import Footer from '../component/Footer';
import Header from '../component/Header';
import Menu from '../component/Menu';
import '../component/Header.css';
import '../App.css'
import InputForms from '../component/InputForms';
import '../component/InputForms.css';
import GlobalSearch from '../component/GlobalSearch';

const inputContext = createContext(null);

function DefaultLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  sessionStorage.setItem('inputBar', false)
  const [inputBar, setInputBar] = useState(JSON.parse(sessionStorage.getItem('inputBar')) || false);
  const [inputObj, setInputObj] = useState({});

  useEffect(() => {
    const handleStorageChange = () => {
      setInputBar(JSON.parse(sessionStorage.getItem('inputBar')));
    };
    window.addEventListener('sessionStorageChanged', handleStorageChange);
    return () => {
      window.removeEventListener('sessionStorageChanged', handleStorageChange);
    };
  }, []);

  const handleClose = () => {
    setInputBar(false)
    setInputObj({})
  }
  useEffect(() => {
    if (inputBar || (inputObj?.from === "Header")) {
      setSidebarOpen(false)
    }
  }, [inputBar, inputObj]);
  return (
    <div className='wrapper'>
      <inputContext.Provider value={{ inputObj, setInputObj }}>
        <div className={`sidebarmenucol ${sidebarOpen ? 'open' : ''}`}>
          <Menu onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} barStatus={sidebarOpen} />
        </div>

        <div className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-close'}`}>
          {/* <div className={`${sidebarOpen ? "header fixed-top" : "headerMenuClose fixed-top"} ${inputBar ? "headerInput fixed-top" : ""}`}>
            <Header />
          </div> */}
          <div className='header'>
            <Header />
          </div>
          <div className='addcontentcol px-4 pt-2 mt-5 '>
            <div className={`content-inner ${inputBar ? 'open_inner' : ''}`}>
              {
                (inputObj?.from === "Header") ? <GlobalSearch />
                  :
                  <AppContent />
              }
            </div>
            <div className={`inputForms ${inputBar ? 'open' : ''}`}>
              <InputForms handleClose={handleClose} />
            </div>
          </div>

        </div>

      </inputContext.Provider>
      {/* <div>
        <Footer />
      </div> */}
    </div>
  );
}
export { inputContext };
export default DefaultLayout;
