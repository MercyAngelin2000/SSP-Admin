import React from 'react'
import AppContent from '../component/AppContent'
import Footer from '../component/Footer'
import Header from '../component/Header'
import Menu from '../component/Menu'
import '../component/Header.css'

function Defaultlayout() {
  return (
    <div className="wrapper">
      <div className='header'>
        <Header />
      </div>
      <span className='row'>
        <div className='sidebarmenucol'>
          <Menu />
        </div>
        <div className='addcontentcol p-0'>
          <AppContent />
        </div>
      </span>
      <div>
        <Footer />
      </div>
    </div>
  )
}

export default Defaultlayout