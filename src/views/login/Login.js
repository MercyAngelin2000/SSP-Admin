import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './Login.css';

export default function Login() {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const navigate = useNavigate();

    const [otpRequired, setOtpRequired] = useState(false);

    const loginFormSchema = yup.object().shape({
        loginId: yup.string().required("Username/Email ID/Mobile Number is required *"),
        password: yup.string().required("Password is required *"),
        otp: yup.string().when('otpRequired', {
            is: true,
            then: yup.string().required("OTP is required *")
        })
    });

    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm({
        resolver: yupResolver(loginFormSchema)
    });

    // useEffect(() => {
    //     setOtpRequired(loginType !== 'username');
    // }, [loginType]);
    const generateOtp = async (loginId) => {
        let logintype = 'email'
        if (/^[\d]+$/.test(loginId)) {
            logintype = 'mobile';
        }
        // } else if (/\S+@\S+\.\S+/.test(value)) {
        //     setLoginType('email');
        // } else {
        //     setLoginType('username');
        // }

        try {
            const response = await axios.post(`${baseUrl}/users/generateotp`, {
                username: loginId,
                method: logintype
            });

            if (response.data.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'OTP Sent',
                    text: 'Please check your email or SMS for the OTP',
                    position: 'center', // Use 'top-end' for top-right positioning
                    timer: 3000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    toast: true, // Use toast style for a smaller, more compact alert
                    customClass: {
                        popup: 'custom-swal-size'
                    },
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.detail,
                    position: 'center', // Use 'top-end' for top-right positioning
                    timer: 3000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    toast: true, // Use toast style for a smaller, more compact alert
                    customClass: {
                        popup: 'custom-swal-size'
                    },
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to send OTP. Please try again.',
                position: 'center', // Use 'top-end' for top-right positioning
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
                toast: true, // Use toast style for a smaller, more compact alert
                customClass: {
                    popup: 'custom-swal-size'
                },
            });
        }
    };

    const onSubmit = async (data) => {
        let logintype = 'email'
        if (/^[\d]+$/.test(data.loginId)) {
            logintype = 'mobile';
        } else if (/\S+@\S+\.\S+/.test(data.loginId)) {
            logintype = 'email';
        } else {
            logintype = 'username';
        }
        try {
            const formData = new FormData();
            formData.append('username', data.loginId);
            formData.append('password', otpRequired ? data.otp : data.password);

            const response = await axios.post(`${baseUrl}/users/login/?otp=${otpRequired}&types=${logintype}`, formData);

            if (response.data.status) {
                localStorage.setItem('access-token', response.data.access_token);
                navigate('/dashboard');
            } else {
                Swal.fire({
                    toast: true,
                    icon: 'error',
                    title: 'Login Failed',
                    text: response.data.detail || 'Invalid credentials. Please try again.',
                    position: 'center',
                    timer: 3000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                });
            }
        } catch (error) {
            Swal.fire({
                toast: true,
                icon: 'error',
                title: 'Error',
                text: 'Failed to login. Please try again.',
                position: 'center',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
            });
        }
    };

    return (
        <div className="d-flex g-0 align-items-center justify-content-center vh-100 login_background cardView">
            <div className="col-lg-6 vh-100 logo_left_bgcolor">
                <div className='content_left'>
                    <div className='p-2'>
                        <h2 className='logo_left_textsize mb-2'>Welcome to</h2>
                        <h2 className='logo_left_textsize mb-2'>Smart School Plus Simplified</h2>
                        <p className='mb-3 text-justify'>Smart School ERP is an all-in-one solution designed to streamline and automate school management processes, including academic scheduling, user roles, and event planning. It enhances efficiency and accuracy, ensuring seamless operations and improved communication within educational institutions.</p>
                    </div>
                </div>
            </div>

            <div className="col-xl-6 col-md-4 col-sm-11 col-xs-11">
                <div className="d-flex align-items-center justify-content-evenly">
                    <div className="col-lg-6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="">
                                <div className="mb-3">
                                    <h3 className="fw-bold P_tag_loginletter">Login</h3>
                                    <p className='text-muted mb-3'>Welcome Back to SSP! <button type="button" className='btn btn-link small' onClick={() => setOtpRequired(!otpRequired)}>OTP Login</button></p>
                                </div>
                                <div className="form-group mb-3">
                                    <label>{!otpRequired ? 'Username/' : ''} Email ID/ Mobile Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        {...register("loginId")}
                                        placeholder="Enter Username/Email ID/Mobile Number"
                                    // onChange={(e) => {
                                    //     const value = e.target.value;
                                    //     if (/^[\d]+$/.test(value)) {
                                    //         setLoginType('mobile');
                                    //     } else if (/\S+@\S+\.\S+/.test(value)) {
                                    //         setLoginType('email');
                                    //     } else {
                                    //         setLoginType('username');
                                    //     }
                                    //     setValue('loginId', value);
                                    // }}
                                    />
                                    {errors.loginId && <span className="error-text">{errors.loginId.message}</span>}
                                </div>
                                {!otpRequired ? <div className="form-group mb-3">
                                    <label>Password</label>
                                    <div>
                                        <input
                                            type="password"
                                            className="form-control"
                                            {...register("password")}
                                            placeholder="Password"
                                        />
                                        {errors.password && <span className="error-text">{errors.password.message}</span>}
                                    </div>
                                    {/* <div class="form-check mt-3">
                                        <input class="form-check-input" type="checkbox"  id="otpcheck" {...register("otplogin")} />
                                        <label class="form-check-label" for="otpcheck">
                                            OTP Login
                                        </label>
                                    </div> */}
                                </div>
                                    :
                                    <div className=''>
                                        <div className="form-group mb-3">
                                            <label>OTP</label>
                                            <div className="row">
                                                <div className='col-lg-8'>
                                                    <input
                                                        type="number"  // Ensure only numbers are entered
                                                        className="form-control"
                                                        {...register("otp", {
                                                            required: "OTP is required",
                                                            maxLength: {
                                                                value: 6,
                                                                message: "OTP cannot exceed 6 digits",
                                                            },
                                                            validate: (value) => value.length === 6 || "OTP must be 6 digits long",
                                                        })}
                                                        placeholder="Enter OTP"
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.slice(0, 6); // Truncate input to 6 digits
                                                        }}
                                                    />
                                                    {errors.otp && <span className="error-text">{errors.otp.message}</span>}
                                                </div>
                                                <div className='col-lg-4'>
                                                    <button
                                                        type="button"
                                                        className="btn btn-otp btn-primary btn-sm text-nowrap"
                                                        onClick={() => generateOtp(getValues('loginId'))}
                                                    >
                                                        Get OTP
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className='text-end mb-2'>
                                    <Link className='forgot_link' to='/forgotpassword'>Forgot Password?</Link>
                                </div>
                                <div>
                                    <button type="submit" className="btn loginBtn btn-login col-lg-12">Login</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
