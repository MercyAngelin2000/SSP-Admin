import React, { useEffect } from 'react';
import './Login.css';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import background from '../../Assets/background.jpeg';
import { addUpdateAPI } from '../../apiService/ApiService';

function Login() {
  const navigate = useNavigate();
  const { register, formState: { errors }, handleSubmit } = useForm();

  const login = (data) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    var method="POST"
    var url=`/users/login/`
    addUpdateAPI(method,url,formData).then((response) => {
        if (response?.data?.status) {
          localStorage.setItem('access-token', response?.data?.access_token);
          window.location.href = '/dashboard';
        } else {
          Swal.fire({
            toast: true,
            icon: "error",
            title: "Oops...",
            text: response?.data?.detail,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    var token = localStorage.getItem('access-token')
    if (token) {
      navigate('/dashboard')
    }
    // eslint-disable-next-line
  }, [])
  return (
    <div className="main login-background" style={{ backgroundImage: `url(${background})` }}>
        <div className="login-container">
          <div id="login">
            <h5 className="text-center fw-bold mb-3">Sign in</h5>
          <form onSubmit={handleSubmit(login)}>
            <fieldset>
              <p className='input-container' style={errors.username ? { outline: '2px solid red' } : {}}>
                <span className="fa fa-user">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                  </svg>
                </span>
                <input type="text" placeholder="Username" {...register('username', { required: true })} />
              </p>
              {errors.username && <div style={{ color: '#a30000', fontSize: 'smaller' }}>Username field is required</div>}

              <p className='input-container mt-4' style={errors.password ? { outline: '2px solid red' } : {}}>
                <span className="fa fa-lock">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
                  </svg>
                </span>
                <input type="password" placeholder="Password" {...register('password', { required: true })} />
              </p>
              {errors.password && <div style={{ color: '#a30000', fontSize: 'smaller' }}>Password field is required</div>}

              <div className='text-center mt-4'>
                <input type="submit" value="Sign In" />
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;