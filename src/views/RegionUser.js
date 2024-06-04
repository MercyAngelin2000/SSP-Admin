import React, { useEffect, useState } from 'react'
import '../App.css'
import DataTable from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const customStyles = {
    headCells: {
        style: {
            paddingLeft: '8px',
            paddingRight: '8px',
            fontWeight: 800,
        },
    },
};
// Define the validation schema using Yup
const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    username: yup.string().required('Username is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    role: yup.string().required('Role is required'),
});
function User() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });
    const [userdata,setUserData]=useState()
    const columns = [
        {
            name: '#',
            selector: (row,index) => index+1,
            cell: (row,index) => <div>{index+1}</div>,
            sortable: true
        },
        {
            name: 'User Name',
            selector: row => row?.name,
            cell: row => <div>{row?.name}</div>,
            sortable: true
        },
        {
            name: 'Role',
            selector: row => row?.role?.name,
            cell: row => <div>{row?.role?.name}</div>,
            sortable: true
        },
        {
            name: 'Active Status',
            selector: row => row.active,
            cell: row => <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={row.active} onChange={handleActiveStatus} />
                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">{row?.active ? "Active" : "Inactive"}</label>
            </div>,
            sortable: true
        },
    ];

    const fetchUserListData = () => {
        axios({
            method: 'get',
            url: 'http://192.168.1.148:8080/users/users/?user_type=region',
            headers: {
                "Authorization": "Bearer "+"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4iLCJ1c2VyX2lkIjoxLCJyb2xlX2lkIjoxLCJleHAiOjE3MTc0OTQ0Njl9.Vg-jyNA9joRsBucVGENHxexzLxTVKYJL9RYHjOVRkNY"
            }
        }).then((response) => {
            console.log(response?.data?.data)
            setUserData(response?.data?.data)
        })
    }
    useEffect(() => {
        fetchUserListData()
    }, [])
    const handleActiveStatus = (event) => {

    }
    const onSubmit = (data) => {
        console.log(data);
    };
    const handleCancel = () => {
        reset()
    }
    return (
        <div>
            <div className='mt-2'>
                <div className='d-flex justify-content-end'>
                    <button className='btn btn-success btn-sm' data-bs-toggle="modal" data-bs-target="#staticBackdrop">Add</button>
                </div>
                <DataTable
                    columns={columns}
                    data={userdata}
                    customStyles={customStyles}
                    pagination
                />
            </div>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Add User</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleCancel()}></button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                            <div className="modal-body">
                                <div>
                                    <label htmlFor="name">Name</label>
                                    <input id="name" className='form-control' {...register('name')} />
                                    {errors.name && <span className='text-danger'>{errors.name.message}</span>}
                                </div>

                                <div>
                                    <label htmlFor="username">Username</label>
                                    <input id="username" className='form-control' {...register('username')} autoComplete='off' />
                                    {errors.username && <span className='text-danger'>{errors.username.message}</span>}
                                </div>

                                <div>
                                    <label htmlFor="password">Password</label>
                                    <input id="password" className='form-control' type="password" {...register('password')} autoComplete='off' />
                                    {errors.password && <span className='text-danger'>{errors.password.message}</span>}
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input id="confirmPassword" className='form-control' type="password" {...register('confirmPassword')} />
                                    {errors.confirmPassword && <span className='text-danger'>{errors.confirmPassword.message}</span>}
                                </div>
                                <div>
                                    <label htmlFor="role">Role</label>
                                    <select className='form-control' id="role" {...register('role')}>
                                        <option value="">Select Role</option>
                                        <option value="Region Admin">Region Admin</option>
                                        <option value="Region Team Member">Region Team Member</option>
                                    </select>
                                    {errors.role && <span className='text-danger'>{errors.role.message}</span>}
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal" title='Cancel' onClick={() => handleCancel()}>Cancel</button>
                                <button type="submit" className="btn btn-success btn-sm">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User