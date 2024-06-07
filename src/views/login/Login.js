import React, { useEffect} from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import loginside from '../../Assets/login-side.jpg'
import { addUpdateAPI } from '../../apiService/ApiService';
import Swal from 'sweetalert2';
import './Login.css';

export default function Login() {
    let base_url = process.env.REACT_APP_BASE_URL;

    const navigate = useNavigate();

    const loginForm = yup.object().shape({
        username: yup.string().required(`Username is required *`),
        password: yup.string().required("Password is required *")
    });
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginForm)
    });

    const login = (data) => {
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('password', data.password);
        var method = "POST";
        var url=`/users/login/`;
        addUpdateAPI(method, url, formData).then((response) => {
            if (response.status) {
                localStorage.setItem('access-token', response.access_token);
                window.location.href = '/dashboard';
            } else {
                Swal.fire({
                    toast: true,
                    icon: "error",
                    title: "Oops...",
                    text: response.detail,
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
    }, [])

    return (

        <div >
            <div className="d-flex g-0 align-items-center justify-content-center vh-100 login_background">
                <div className="col-lg-3 vh-100 logo_left_bgcolor">
                    {/* <img src={jotter} alt="sideimg" className="img-fluid logo_left p-3 ms-3" /> */}
                    <div className='p-3 ms-3'>
                        <h2 className='logo_left_textsize mb-2'>Smart School Plus</h2>
                        <h3 className='logo_left_textsize mb-3 fw-bold'>Simplified</h3>
                        <p className='mb-3 text-muted'>Smart School ERP is an all-in-one solution designed to streamline and automate school management processes, including academic scheduling, user roles, and event planning. It enhances efficiency and accuracy, ensuring seamless operations and improved communication within educational institutions.</p>
                    </div>
                    <div className='img_side_login'>
                        <img src={loginside} alt="sideimg" className="img-fluid " />
                    </div>
                </div>

                <div className="col-xl-9 col-md-4 col-sm-11 col-xs-11">
                    <div className="login_card d-flex align-items-center justify-content-center">
                        <div className="login_field_part col-lg-5">
                            <div className="logo">
                                <div className='quadnomics'>
                                    {/* <img src={quadnomics} className="img-fluid login_logo" alt="logo" /> */}

                                </div>
                            </div>
                            <form onSubmit={handleSubmit(login)}>
                                <div className="">
                                    <div className="">
                                        <div className=" mt-3">
                                            <h3 className="fw-bold P_tag_loginletter">Login</h3>
                                            <p className='text-muted mb-3'>Welcome Back to SSP!</p>
                                        </div>

                                        <div className="form-group mb-4">
                                            <input type="text" className="form-control" id="username" placeholder="Username" {...register("username")} />
                                            <span style={{ color: "red" }}>{errors?.username != undefined && errors?.username?.message}</span>

                                        </div>
                                        <div className="form-group mb-4">
                                            <div>
                                                <input
                                                    type={'password'}
                                                    className="form-control"
                                                    id="password"
                                                    placeholder="Password"
                                                    {...register("password")}
                                                />
                                            </div>
                                            <span style={{ color: "red" }}>{errors?.password != undefined && errors?.password?.message}</span>
                                        </div>
                                    </div>
                                    <div className='mt-4 mb-4'>
                                        <button className='btn btn-primary col-lg-12 btn' id='loginButton' type='submit'>Login</button>
                                    </div>
                                    {/* <hr />
                                    <div className="d-flex justify-content-center align-items-center p-2">
                                        <Link className="text" to="#">Forgot Password ? </Link>
                                    </div> */}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
