import React, { useEffect, useState } from 'react';
import './Header.css';
import profileicon from '../assets/profile.png';
import sspLogo from '../assets/sspLogo.png'
import { Link } from 'react-router-dom';
import { getAPI } from '../apiService/ApiService';
import { useLocation, useNavigate } from 'react-router-dom';
import chatbot from '../assets/chatbot.jpg'
import crm from '../assets/crm.jpg'
import personalized from '../assets/personalized.jpg'
import push from '../assets/push.png'
import recommand from '../assets/recommand.png'
import smart from '../assets/smart.jpg'
import sms from '../assets/sms.jpg'
import vision from '../assets/vision.jpg'
import voice from '../assets/voice.jpg'
import analytics from '../assets/analytics.jpg'
import { setSessionStorageItem } from '../utils/Utils';
import { useContext } from 'react';
import { inputContext } from '../layout/DefaultLayout';
function Header({ Dropdown }) {
  const inputContextObj = useContext(inputContext);
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState({});
  const location = useLocation()
  const services = [
    { name: 'Region', path: '/region' },
    { name: 'Corporate', path: '/corporate' },
    { name: 'Campus', path: '/campus' },
    { name: 'School Account', path: '/schoolaccount' },
    { name: 'School Admin', path: '/schooladmin' },
  ]

  // useEffect(() => {
  //   if(Dropdown===true){
  //     setOpen(!open)
  //   }
  // },[Dropdown])
  const getUserData = () => {
    var url = `/users/currentuser/`
    getAPI(url).then((res) => {
      if (res.data?.status) {
        setUser(res?.data?.data);
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('access-token')
    // window.location.href = '/';
    navigate('/login')
  }

  useEffect(() => {
    getUserData();
  }, [])
  const handleClick = () => {
    setSessionStorageItem('inputBar', false);
    inputContextObj?.setInputObj({ from: "Header" })
  }
  return (
    <nav class="navbar navbar-expand-lg border border-bottom p-1 navbarhead bg-white">
      <div class="container-fluid">
        {/* <a class="navbar-brand" href="#">
          <img src={sspLogo} width={40} height={30} alt='logo' />
        </a> */}
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to='/dashboard'><span className='navText' title='Dashboard'>Dashboard</span> </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link"><span className='navText' title='Analytics'>Analytics</span> </Link>
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link" to='/corporate'><span className='navText' title='Corporate'>Corporate </span></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to='/campus'><span className='navText' title='Campus'>Campus </span></Link>
            </li> */}
            <li className="nav-item dropdown">
              <div className="tn-group">
                <Link className="nav-link" onClick={() => { setOpen(!open) }}><span className={open ? 'otherNav' : 'navText'} title='Other Services'>Other Services</span>
                  {!open ?
                    <span className={open ? 'otherNav p-2' : 'p-2'}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                      </svg>
                    </span> :
                    <span className={open ? 'otherNav p-2' : 'p-2'}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
                      </svg>
                    </span>
                  }
                </Link>
                {open && (
                  <>
                    {/* <div className='d-flex justify-content-end p-4'>
                      <span role='button' title='Close' onClick={() => { setOpen(!open) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg>
                      </span>
                    </div> */}
                    <div className="dropdown-content" onClick={() => { setOpen(!open) }}>
                      <DropdownItem label="Recommendation Systems" description="The best way to predict the future is to create it" img={recommand} />
                      <DropdownItem label="Data Analytics" description="The goal is to turn data into information, and information into insight" img={analytics} />
                      <DropdownItem label="Computer Vision" description="Seeing is believing, but with computer vision, believing is seeing" img={vision} />
                      <DropdownItem label="ChatBot" description="Chatbots are the bridge between humans and the vast world of digital information" img={chatbot} />
                      <DropdownItem label="SMS/Email" description="Effective communication can enhance customer engagement and loyalty" img={sms} />
                      <DropdownItem label="Voice" description="It's about creating a dialogue between humans and machines" img={voice} />
                      <DropdownItem label="Push Notifications" description="It can enhance user experience and drive retention" img={push} />
                      <DropdownItem label="CRM" description="CRM is the art of listening to your customers and responding with relevance" img={crm} />
                      <DropdownItem label="Personalized learning" description="Education becomes a collaborative journey between student, teacher, and technology" img={personalized} />
                      <DropdownItem label="Smart Content" description="Delivering the right message to the right person at the right time" img={smart} />
                    </div>
                  </>
                )}
                {/* <ul className="dropdown-menu">
                  {
                    services.map((service, index) => {
                      return <li key={index}>
                        <Link className={`dropdown-item d-flex align-items-center ${location?.pathname == service?.path ? 'active' : ''}`} to={service?.path}>
                          {service.name}
                        </Link>
                      </li>
                    })
                  }
                </ul> */}
              </div >
            </li>
          </ul>
          <div className="tn-group">
            <div className='d-flex align-items-center'>
              <div className='me-3 fw-bold'>
                <button className='btn globalSearchColour' title='Search' onClick={() => { handleClick() }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-opencollective" viewBox="0 0 16 16">
                  <path fill-opacity=".4" d="M12.995 8.195c0 .937-.312 1.912-.78 2.693l1.99 1.99c.976-1.327 1.6-2.966 1.6-4.683 0-1.795-.624-3.434-1.561-4.76l-2.068 2.028c.468.781.78 1.679.78 2.732z" />
                  <path d="M8 13.151a4.995 4.995 0 1 1 0-9.99c1.015 0 1.951.273 2.732.82l1.95-2.03a7.805 7.805 0 1 0 .04 12.449l-1.951-2.03a5.07 5.07 0 0 1-2.732.781z" />
                </svg></button>
              </div>
              {/* user name & role */}
              <div className='me-3 fw-bold'>
                {user?.name}
                <div className='text-secondary' style={{ fontSize: 'x-small' }}> {user?.role?.name} </div>
              </div>
              {/* user profile */}
              <div className="tn-group">
                <img src={profileicon} alt='profile' className="dropdown-toggle profile-icon" data-bs-toggle="dropdown" />
                <ul className="dropdown-menu dropdown-menu-end me-2">
                  <li className='p-2 dropdown-header'><span >{user?.name}</span></li>
                  <li><hr className="dropdown-divider mt-0 mb-0" /></li>
                  <li><span className="dropdown-item d-flex align-items-center p-2" > <i className='bx bx-user-circle me-2'></i> <span className='text-secondary'>Profile </span></span></li>
                  <li onClick={() => handleLogout()}><span className="dropdown-item d-flex align-items-center p-2" ><i className='bx bx-log-in-circle me-2'></i> <span className='text-secondary'>Logout</span></span></li>
                </ul>
              </div>
              <div />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header

const DropdownItem = ({ label, description, img, path }) => {
  return (
    <div className="dropdown-item">
      <Link className="nav-link" to={path}>
        <div className='row d-flex align-items-center p-2'>
          <div className='col-lg-4'>
            <img src={img} alt={label} height={50} width={60} />
          </div>
          <div className='col-lg-8'>
            <h4>{label}</h4>
            <p>{description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};