import React from 'react';
import './Login.css';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';

function Login() {

  const { register, formState: { errors }, handleSubmit } = useForm();
  let base_url = process.env.REACT_APP_BASE_URL
  const login = (data) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    axios.post(`${base_url}/users/login/`, formData)
      .then((response) => {
        if (response.data.status) {
          localStorage.setItem('access-token', response.data.access_token);
          window.location.href = '/dashboard';
        } else {
          Swal.fire({
            toast: true,
            icon: "error",
            title: "Oops...",
            text: response.data.message,
        });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="main">
      <div className="container1">
        <center>
          <div className="middle">
            <div id="login">
              <form onSubmit={handleSubmit(login)}>
                <fieldset className="clearfix">
                  <p className='mb-4'>
                    <span className="fa fa-user">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                      </svg>
                    </span>
                    <input type="text" style={errors.username ? { border: '2px solid red' } : {}} placeholder="Username" {...register('username', { required: true })} />
                    {errors.username && <span style={{ color: 'red', fontSize: 'small' }}>Username field is required</span>}
                  </p>
                  <p className='mb-4'>
                    <span className="fa fa-lock">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
                      </svg>
                    </span>
                    <input type="password" placeholder="Password" {...register('password', { required: true })} />
                    {errors.password && <span style={{ color: 'red', fontSize: 'small' }}>Password field is required</span>}
                  </p>

                  <div>
                    <span style={{ width: '50%', textAlign: 'center', display: 'inline-block' }}>
                      <input type="submit" value="Sign In" />
                    </span>
                  </div>
                </fieldset>
                <div className="clearfix"></div>
              </form>
              <div className="clearfix"></div>
            </div>
            <div className="logo">
              LOGO
              <div className="clearfix"></div>
            </div>
          </div>
        </center>
      </div>
    </div>
  );
}

export default Login;