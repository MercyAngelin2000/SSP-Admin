import React, { useEffect, useState } from 'react';
import './Header.css';
import profileicon from '../Assets/profile.png';
import { getCurrentUser } from '../apiService/ApiService';
function Header() {

  const [user, setUser]= useState({});

  const getUserData=()=>{
    getCurrentUser().then((res)=>{
      if (res.status){
        setUser(res.data);
      }
    }).catch((err)=>{
      console.log(err);
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('access-token')
    window.location.href = '/';
  }

  useEffect(() => {
    getUserData();
  },[])
  return (
    <div className=''>
      <div className='d-flex justify-content-end align-items-center '>
        <div className='me-3 fw-bold'>
          {user?.name}
          <div className='text-secondary' style={{fontSize:'x-small'}}> {user?.role?.name} </div>
          {/* <p className='text-secondary small'> {user?.role?.name}</p> */}
        </div>
        <span className='me-3'>
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
          </svg> */}
          <div className="btn-group">
          <img src={profileicon} alt='profile' className="dropdown-toggle profile-icon" data-bs-toggle="dropdown" aria-expanded="false" />
            <ul className="dropdown-menu">
              <li className='p-2 dropdown-header'><span >{user?.name}</span></li>
              <li><hr className="dropdown-divider mt-0 mb-0" /></li>
              <li><span className="dropdown-item d-flex align-items-center p-2" > <i className='bx bx-user-circle me-2'></i> <span className='text-secondary'>Profile </span></span></li>
              <li onClick={()=>handleLogout()}><span className="dropdown-item d-flex align-items-center p-2" ><i className='bx bx-log-in-circle me-2'></i> <span className='text-secondary'>Logout</span></span></li>
            </ul>
          </div>
        </span>
        {/* <span onClick={()=>handleLogout()} role='button' title='Logout'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
          </svg>
        </span> */}
      </div>
    </div>
  )
}

export default Header