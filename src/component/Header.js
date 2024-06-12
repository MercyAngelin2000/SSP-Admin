import React, { useEffect, useState } from 'react';
import './Header.css';
import profileicon from '../Assets/profile.png';
import sspLogo from '../Assets/sspLogo.png'
import { Link } from 'react-router-dom';
import { getAPI } from '../apiService/ApiService';
import { useLocation } from 'react-router-dom';
function Header() {
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
    window.location.href = '/';
  }

  useEffect(() => {
    getUserData();
  }, [])
  return (
    <nav class="navbar navbar-expand-lg border border-bottom p-1 navbarhead">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src={sspLogo} width={40} height={30} alt='logo' />
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to='/dashboard'><span className='navText' title='Dashboard'>Dashboard</span> </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to='/region'><span className='navText' title='Region'>Analytics</span> </Link>
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
                      <DropdownItem label="Region" description="Description goes here" img={sspLogo} path='/region' />
                      <DropdownItem label="Corporate" description="Description goes here" img={sspLogo} path={'/corporate'} />
                      <DropdownItem label="Campus" description="Description goes here" img={sspLogo} path={'/campus'} />
                      <DropdownItem label="School Account" description="Description goes here" img={sspLogo} path={'/schoolaccount'} />
                      <DropdownItem label="School Admin" description="Description goes here" img={sspLogo} path={'/schooladmin'} />
                      <DropdownItem label="Others" description="Description goes here" img={sspLogo} />
                      <DropdownItem label="Others" description="Description goes here" img={sspLogo} />
                      <DropdownItem label="Others" description="Description goes here" img={sspLogo} />
                      <DropdownItem label="Others" description="Description goes here" img={sspLogo} />
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
        <div className='row p-4'>
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