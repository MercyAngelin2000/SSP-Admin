import React, { useEffect, useState } from 'react';
import './Header.css';
import profileicon from '../Assets/profile.png';
import { Link } from 'react-router-dom';
import { getAPI } from '../apiService/ApiService';
import { useLocation } from 'react-router-dom';
function Header() {

  const [user, setUser] = useState({});
  const location=useLocation()
  const services = [
    { name: 'Region', path: '/region' },
    { name: 'Corporate', path: '/corporate' },
    { name: 'Campus', path: '/campus' },
  ]

  const getUserData=()=>{
    var url=`/users/currentuser/`
    getAPI(url).then((res)=>{
      if (res.data?.status){
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
    <nav class="navbar navbar-expand-lg border border-bottom p-1">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src={profileicon} width={30} alt='logo' />
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to='/dashboard'>Home </Link>
            </li>
            <li className="nav-item dropdown">
              <div className="tn-group">
                <Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown" >Services </Link>
                <ul className="dropdown-menu">
                  {
                    services.map((service, index) => {
                      return <li key={index}>
                        <Link className={`dropdown-item d-flex align-items-center ${location?.pathname == service?.path ? 'active' : ''}`} to={service?.path}>
                          {service.name}
                        </Link>
                      </li>
                    })
                  }
                </ul>
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