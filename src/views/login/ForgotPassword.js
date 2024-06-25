import React from 'react'
import { Link } from 'react-router-dom'

function ForgotPassword() {
    return (
        <>
            <div >
                <div className="d-flex g-0 align-items-center justify-content-center vh-100 login_background cardView">
                    <div className="col-lg-6 vh-100 logo_left_bgcolor">
                        {/* <img src={jotter} alt="sideimg" className="img-fluid logo_left p-3 ms-3" /> */}
                        <div className=' content_left'>
                            <div className='p-2'>
                                <h2 className='logo_left_textsize mb-2'>Welcome to</h2>

                                <h2 className='logo_left_textsize mb-2'>Smart School Plus Simplified</h2>

                                <p className='mb-3 text-justify'>Smart School ERP is an all-in-one solution designed to streamline and automate school management processes, including academic scheduling, user roles, and event planning. It enhances efficiency and accuracy, ensuring seamless operations and improved communication within educational institutions.</p>
                            </div>
                        </div>
                        {/* <div className='img_side_login'>
<img src={loginside} alt="sideimg" className="img-fluid " />
</div> */}
                    </div>

                    <div className="col-xl-6 col-md-4 col-sm-11 col-xs-11">
                        <div className=" d-flex align-items-center justify-content-evenly">
                            <div className="col-lg-6">
                                <div className="logo">
                                    <div className='quadnomics'>
                                        {/* <img src={quadnomics} className="img-fluid login_logo" alt="logo" /> */}

                                    </div>
                                </div>
                                <form >
                                    <div className="">
                                        <div className="">
                                            <div className="mb-3">
                                                <h3 className="fw-bold P_tag_loginletter">Forgot Password</h3>

                                            </div>

                                            <div className="form-group mb-2">
                                                <label>Username / Email ID /  Mobile Number</label>

                                                <input type="text" className="form-control form-control-login" id="username" />
                                                {/* <span style={{ color: "red" }}>{errors?.username != undefined && errors?.username?.message}</span> */}

                                            </div>
                                            <div className="form-group mb-2">
                                                <label>New Password</label>
                                                <div>
                                                    <input
                                                        type={'password'}
                                                        className="form-control form-control-login"
                                                        id="password"
                                                        placeholder="Password"
                                                    // {...register("password")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group mb-2">
                                                <label>Confirm Password</label>
                                                <div>
                                                    <input
                                                        type={'password'}
                                                        className="form-control form-control-login"
                                                        id="password"
                                                        placeholder="Password"
                                                    // {...register("password")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='mt-4 mb-4 d-flex justify-content-around'>
                                            <button className='btn btn-success col-lg-5 btn' id='loginButton' type='submit'>Reset Password</button>
                                            <Link to='/login' className='btn btn-secondary col-lg-5 btn' id='loginButton' type='submit'>Cancel</Link>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword
