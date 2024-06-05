import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import "./Region.css"

const customStyles = {
    headCells: {
        style: {
            fontSize: '14px', // Decrease font size
            fontWeight: 'bold', // Make font weight bold
            color: '#333', // Change font color
        },
    },
    cells: {
        style: {
            fontSize: '13px', // Decrease font size
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
const schema1 = yup.object().shape({
    name: yup.string().required('Name is required'),
    username: yup.string().required('Username is required'),
    role: yup.string().required('Role is required'),
});
function RegionUser() {
    let base_url = process.env.REACT_APP_BASE_URL
    var token = localStorage.getItem("access-token");
    const [title, setTile] = useState("Add User")
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(title === "Add User" ? schema : schema1),
    });
    const [userdata, setUserData] = useState()
    const [roleData, setRoleData] = useState()
    const [editData, setEditData] = useState()
    //pagination
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const columns = [
        {
            width: '100px',
            name: '#',
            selector: (row, index) => index + 1,
            cell: (row, index) => <div>{index + 1}</div>,
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
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={row.active} onChange={(event) => handleActiveStatus(event, row)} />
                <label className="form-check-label" htmlFor="flexSwitchCheckChecked"></label>
            </div>,
            sortable: true
        },
        {
            name: 'Actions',
            selector: row => row.status,
            cell: row =>
                <div>
                    <button className='btn text-primary btn-sm me-2' data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => handleEdit(row)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                    </button>
                    <button className='btn text-danger btn-sm' onClick={() => handleDelete(row)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                        </svg>
                    </button>
                </div>,
        },
    ];
    const handleEdit = (row) => {
        setTile("Edit User")
        setEditData(row)
        fetchRoleData()
        reset({
            name: row?.name,
            username: row?.username,
            role: row?.role_id,
        })
    }
    const handleDelete = (row) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success btn-sm",
                cancelButton: "btn btn-danger me-2 btn-sm"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this user!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
            heightAuto: false,
            width: 400
        }).then((result) => {
            if (result.isConfirmed) {
                axios({
                    method: 'delete',
                    url: `${base_url}/users/${row?.id}`,
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }).then((response) => {
                    let data = response?.data
                    if (data?.status) {
                        fetchUserListData()
                        Swal.fire({
                            toast: true,
                            position: "center",
                            icon: "success",
                            title: "User deleted successfully",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                    else {
                        Swal.fire({
                            toast: true,
                            icon: "error",
                            title: "Oops...",
                            text: data?.message,
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        });
    }
    const fetchUserListData = () => {
        axios({
            method: 'get',
            url: `${base_url}/users/users/?user_type=region&skip=${skip}&limit=${limit}`,
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            setUserData(response?.data?.data)
            setTotal(response?.data?.total_count)
        })
    }
    const fetchRoleData = () => {
        axios({
            method: 'get',
            url: `${base_url}/users/roles/`,
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            var data = response?.data?.data
            var arr = []
            //eslint-disable-next-line
            data.map(it => {
                if (it?.name === "Regional Admin" || it?.name === "Regional Team Member") {
                    arr.push(it)
                }
            })
            setRoleData(arr)
        })
    }
    useEffect(() => {
        fetchUserListData()
        // eslint-disable-next-line
    }, [skip, limit])
    const handleActiveStatus = (event, row) => {
        axios({
            method: 'put',
            url: `${base_url}/users/${row?.id}`,
            headers: {
                "Authorization": "Bearer " + token
            },
            data: {
                "name": row?.name,
                "username": row?.username,
                "role_id": Number(row?.role_id),
                "active": event.target.checked
            }
        }).then((response) => {
            let data = response?.data
            if (data?.status) {
                fetchUserListData()
                Swal.fire({
                    toast: true,
                    position: "center",
                    icon: "success",
                    title: "User updated successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            else {
                Swal.fire({
                    toast: true,
                    icon: "error",
                    title: "Oops...",
                    text: data?.message,
                });
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    const onSubmit = (data) => {
        var postData;
        if (title === "Add User") {
            postData = {
                method: 'post',
                url: `${base_url}/users/register/`,
                headers: {
                    "Authorization": "Bearer " + token
                },
                data: {
                    "name": data?.name,
                    "username": data?.username,
                    "password": data?.password,
                    "role_id": Number(data?.role),
                    "active": true
                }
            }
        }
        else {
            postData = {
                method: 'put',
                url: `${base_url}/users/${editData?.id}`,
                headers: {
                    "Authorization": "Bearer " + token
                },
                data: {
                    "name": data?.name,
                    "username": data?.username,
                    "role_id": Number(data?.role)
                }
            }
        }
        axios(postData).then((response) => {
            let data = response?.data
            if (data?.status) {
                handleCancel()
                fetchUserListData()
                document.getElementById("close").click()
                Swal.fire({
                    toast: true,
                    position: "center",
                    icon: "success",
                    title: title === "Add User" ? "User added successfully" : "User updated successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            else {
                Swal.fire({
                    toast: true,
                    icon: "error",
                    title: "Oops...",
                    text: data?.message,
                });
            }
        }).catch((error) => {
            console.log(error)
        })
    };
    const handleCancel = () => {
        setTile("Add User")
        reset({
            name: "",
            username: "",
            password: "",
            role: "",
            confirmPassword: ""
        })
        setEditData()
    }
    const handlePageChange = (page) => {
        setSkip((page - 1) * limit)
    }
    const handlePerRowsChange = (newPerPage, page) => {
        setLimit(newPerPage)
    }
    const handleAdd = () => {
        fetchRoleData()
    }
    return (
        <div>
            <div className='mt-1'>
                <div className='d-flex justify-content-end'>
                    <div className='d-flex'>
                    <input type="text" className='form-control me-2' placeholder='Search'/>
                    <button className='btn btn-success btn-sm add' data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => handleAdd()}>Add</button>
                    </div>
                </div>
                <DataTable
                    columns={columns}
                    data={userdata}
                    customStyles={customStyles}
                    pagination
                    paginationServer
                    paginationTotalRows={total}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                />
            </div>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">{title}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close" onClick={() => handleCancel()}></button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                            <div className="modal-body">
                                <div>
                                    <label htmlFor="name">Name<span className='text-danger'>*</span></label>
                                    <input id="name" className='form-control' {...register('name')} />
                                    {errors.name && <span className='text-danger'>{errors.name.message}</span>}
                                </div>

                                <div>
                                    <label htmlFor="username">Username<span className='text-danger'>*</span></label>
                                    <input id="username" className='form-control' {...register('username')} autoComplete='off' />
                                    {errors.username && <span className='text-danger'>{errors.username.message}</span>}
                                </div>
                                {
                                    title === "Edit User" ? "" :
                                        <>
                                            <div>
                                                <label htmlFor="password">Password<span className='text-danger'>*</span></label>
                                                <input id="password" className='form-control' type="text" {...register('password')} autoComplete='off' />
                                                {errors.password && <span className='text-danger'>{errors.password.message}</span>}
                                            </div>
                                            <div>
                                                <label htmlFor="confirmPassword">Confirm Password<span className='text-danger'>*</span></label>
                                                <input id="confirmPassword" className='form-control' type="text" {...register('confirmPassword')} />
                                                {errors.confirmPassword && <span className='text-danger'>{errors.confirmPassword.message}</span>}
                                            </div>
                                        </>
                                }
                                <div>
                                    <label htmlFor="role">Role<span className='text-danger'>*</span></label>
                                    <select className='form-control' id="role" {...register('role')}>
                                        <option value="">Select Role</option>
                                        {
                                            roleData?.map((item, index) => {
                                                return <option key={index} value={item?.id} selected={item?.id===editData?.role_id ? true : false}>{item?.name}</option>
                                            })
                                        }
                                    </select>
                                    {errors.role && <span className='text-danger'>{errors.role.message}</span>}
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal" title='Cancel' onClick={() => handleCancel()}>Cancel</button>
                                <button type="submit" className="btn btn-success btn-sm add">{title === "Add User" ? "Save" : "Update"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegionUser