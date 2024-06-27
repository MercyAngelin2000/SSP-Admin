import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ForgotPassword.css';

function ForgotPassword() {
    const [showMobileFields, setShowMobileFields] = useState(false);
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);


    const baseUrl = process.env.REACT_APP_BASE_URL

    const handleTryAnotherWay = () => {
        setShowMobileFields(true);
    };

    const handleSendOtp = async () => {
        try {
            if (!mobileNumber && showMobileFields) {
                throw new Error('Please enter Mobile Number.');
            } else if (!username && !showMobileFields) {
                throw new Error('Please enter Username / Email ID.');
            }

            const response = await axios.post(`${baseUrl}/users/forgototp`, {
                username: showMobileFields ? mobileNumber : username,
                method: showMobileFields ? 'mobile' : 'email'
            });

            if (!response.data.status) {
                throw new Error(response.data.detail);
            }

            setOtpSent(true);

            Swal.fire({
                icon: 'success',
                title: 'OTP Sent',
                toast: true,
                position: 'center',
                text: 'OTP has been sent to your registered ' + (showMobileFields ? 'mobile number' : 'email address') + '.',
            });
        } catch (error) {
            let errorMessage = error.message;
            if (error.response && error.response.data && error.response.data.detail) {
                errorMessage = error.response.data.detail;
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                confirmButtonColor: '#dc3545',
                toast: true,
                position: 'center',
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!username && !showMobileFields) {
                throw new Error('Please enter Username / Email ID.');
            }
            if (!newPassword || !confirmPassword) {
                throw new Error('Please enter New Password and Confirm Password.');
            }
            if (newPassword !== confirmPassword) {
                throw new Error('Passwords do not match.');
            }
            if (!otp) {
                throw new Error('Please enter OTP.');
            }

            const response = await axios.post(`${baseUrl}/users/resetpwd`, {
                username: showMobileFields ? mobileNumber : username,
                otp: parseInt(otp),
                method: showMobileFields ? 'mobile' : 'email',
                new_password: newPassword,
            });

            if (!response.data.status) {
                throw new Error(response.data.detail);
            }

            Swal.fire({
                icon: 'success',
                title: 'Password Reset',
                text: 'Your password has been reset successfully.',
                toast: true,
                position: 'center',
            });
        } catch (error) {
            let errorMessage = error.message;
            if (error.response && error.response.data && error.response.data.detail) {
                errorMessage = error.response.data.detail;
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                confirmButtonColor: '#dc3545',
                toast: true,
                position: 'center',
            });
        }
    };

    return (
        <>
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
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <div className="mb-3">
                                        <h3 className="fw-bold P_tag_loginletter">Forgot Password</h3>
                                    </div>

                                    {showMobileFields ? (
                                        <>
                                            <div className="form-group mb-2">
                                                <label>Mobile Number <span className="required-asterisk">*</span></label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-login"
                                                    value={mobileNumber}
                                                    onChange={(e) => setMobileNumber(e.target.value)}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="form-group mb-2">
                                            <label>Username / Email ID <span className="required-asterisk">*</span></label>
                                            <input
                                                    type="text"
                                                    className="form-control form-control-login"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />
                                            </div>
                                        </>
                                    )}


                                    <div className="form-group mb-2">
                                        <label>OTP <span className="required-asterisk">*</span></label>
                                        <div className="row">
                                            <div className='col-lg-8'>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-login"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                />
                                            </div>
                                            <div className='col-lg-4'>
                                                <button
                                                    className="btn btn-otp btn-primary btn-sm text-nowrap"
                                                    type="button"
                                                    onClick={handleSendOtp}
                                                >Send OTP</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group mb-2">
                                        <label>New Password <span className="required-asterisk">*</span></label>
                                        <input
                                            type="password"
                                            className="form-control form-control-login"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group mb-2">
                                        <label>Confirm Password <span className="required-asterisk">*</span></label>
                                        <input
                                            type="password"
                                            className="form-control form-control-login"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    {/* <div className="row mb-2"> */}

                                    {/* </div> */}

                                    {/* Conditionally render the link based on showMobileFields */}
                                    {!showMobileFields && (
                                        <div className="mb-2">
                                            <Link className='try_link' onClick={handleTryAnotherWay}>Try Another Way</Link>
                                        </div>
                                    )}

                                    <div className='mt-4 mb-4 d-flex justify-content-around'>
                                        <button
                                            className='btn btn-success btn-sm'
                                            id='resetPasswordButton'
                                            type='submit'
                                            disabled={!otpSent || !otp}
                                        >Reset Password</button>
                                        <Link to='/login' className='btn btn-secondary' id='cancelButton'>Cancel</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;
