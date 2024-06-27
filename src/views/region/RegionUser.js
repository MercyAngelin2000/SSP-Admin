import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import "./Region.css"
import { getAPI, addUpdateAPI, deleteAPI } from '../../apiService/ApiService';
import { tableStyle,setSessionStorageItem } from '../../utils/Utils';
import {inputContext} from '../../layout/DefaultLayout';

// Define the validation schema using Yup
const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    mobile: yup.string().required('Mobile number is required').
    min(10, 'Mobile number should be 10 digits').
    max(10, 'Mobile number should be 10 digits'),
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
    region_id: yup.string().required('Region is required'),
});
const schema1 = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    mobile: yup.string().required('Mobile number is required').
    min(10, 'Mobile number should be 10 digits').
    max(10, 'Mobile number should be 10 digits'),
    username: yup.string().required('Username is required'),
    role: yup.string().required('Role is required'),
    region_id: yup.string().required('Region is required'),
});
function RegionUser({ activeTab }) {
    const [title, setTile] = useState("Add User")
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(title === "Add User" ? schema : schema1),
    });
    const [userdata, setUserData] = useState()
    const [regionList, setRegionList] = useState()
    const [selectedRegion, setSelectedRegion] = useState()
    const [roleData, setRoleData] = useState()
    const [editData, setEditData] = useState()
    //pagination
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const inputContextObj= useContext(inputContext);

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
            cell: row => <div>{row?.username}</div>,
            sortable: true
        },
        {
            name: 'Mail Id',
            selector: row => row?.email,
            cell: row => <div>{row?.email}</div>,
            sortable: true
        },
        {
            name: 'Role',
            selector: row => row?.name,
            cell: row => <div>Region Head</div>,
            sortable: true
        },
        {
            name: 'Active Status',
            selector: row => row?.active,
            cell: row => <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={row?.active} onChange={(event) => handleActiveStatus(event, row)} />
                <label className="form-check-label" htmlFor="flexSwitchCheckChecked"></label>
            </div>,
            sortable: true
        },
        {
            name: 'Actions',
            selector: row => row.status,
            cell: row =>
                <div>
                    <button className='btn text-primary btn-sm me-2' title='Edit' onClick={() => handleEdit(row)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                    </button>
                    <button className='btn text-danger btn-sm' title='Delete' onClick={() => handleDelete(row)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                        </svg>
                    </button>
                </div>,
        },
    ];
    useEffect(() => {
        if(editData){
        setSessionStorageItem('inputBar',true);
        inputContextObj?.setInputObj({from:"RegionUser", roleData:roleData,schema:schema,schema1:schema1,onSubmit:onSubmit,title:title,editData:editData,handleCancel:handleCancel})
        }
         },[editData])
    const handleEdit = (row) => {
        setEditData(row)
        setTile("Edit User")
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
                var url = `/region/RegionUsers/${row?.id}`
                deleteAPI(url).then((response) => {
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
                            text: response?.data?.detail,
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        });
    }
    const fetchUserListData = () => {
        var url =`/region/region_user/?&skip=${skip}&limit=${limit}`
        getAPI(url).then((response) => {
            var temp = [];
            response?.data?.map((item) => {
                temp.push({
                    'region_id': item?.region?.id,
                    'name': item?.region?.name,
                    'email': item?.user?.email,
                    'mobile': item?.user?.mobile,
                    'username': item?.user?.username,
                    'password': item?.user?.password,
                    'role_id': item?.user?.role_id,
                    'active': item?.user?.active,
                    'id': item?.user_id,
                    'user_id': item?.user_id
                });
        

            })
            setUserData(temp)
            setTotal(response?.data?.total_count)
            
        }).catch((error) => {
            console.log(error)
        })
    }

    const fetchRegionListData = () => {
        var url = `/region/?skip=${skip}&limit=${limit}`
        getAPI(url).then((response) => {
            var data =response?.data?.data
            const regions = data?.map((item) => (
                { value: item.id, label: item.name })
              );
            setRegionList(data)
            // setTotal(response?.data?.total_count)
        }).catch((error) => {
            console.log(error)
        })
    }
    const fetchRoleData = () => {
        var url = `/users/roles/`
        getAPI(url).then((response) => {
            var data = response?.data?.data
            var arr = []
            //eslint-disable-next-line
            data.map(it => {
                if (it?.name === "Regional Admin") {
                    arr.push(it)
                }
            })
            setRoleData(arr)
        }).catch((error) => {
            console.log(error)
        })
    }
    useEffect(() => {
        fetchUserListData()
        fetchRegionListData()
        // eslint-disable-next-line
    }, [skip, limit, activeTab])
    const handleActiveStatus = (event, row) => {
        var method = "PUT"
        var url = `/users/${row?.user_id}`
        var data = {
            "name": row?.name,
            "username": row?.username,
            "role_id": Number(row?.role_id),
            "active": event.target.checked,
            'email': row?.email,
            'mobile': String(row?.mobile),
            
        }
        addUpdateAPI(method, url, data).then((response) => {
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
                    text: response?.data?.detail,
                });
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    const onSubmit = (data) => {
        var method;
        var url;
        var postData;
        if (title === "Add User") {
            method = "POST"
            url = `/region/adduser/`
            postData = {
                'region_id': Number(data?.region_id),
                "name": data?.name,
                'email': data?.email,
                'mobile': data?.mobile,
                "username": data?.username,
                "password": data?.password,
                "role_id": Number(data?.role),
                "active": data?.isactive,
                
            }
        }
        else {
            method = "PUT"
            url = `/region/update_user/${editData?.id}`
            postData = {
                'region_id': Number(data?.region_id),
                "name": data?.name,
                'email': data?.email,
                'mobile': data?.mobile,
                "username": data?.username,
                "password": data?.password,
                "role_id": Number(data?.role),
                "active": data?.active,
            }
        }
        addUpdateAPI(method, url, postData).then((response) => {
            let data = response?.data
            if (data?.status) {
                handleCancel()
                fetchUserListData()
               inputContextObj?.setInputObj({})
                setSessionStorageItem('inputBar',false);
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
                    text: response?.data?.detail,
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
    useEffect(() => {
        inputContextObj?.setInputObj({from:"RegionUser",setValue:setValue, roleData:roleData,schema:schema,schema1:schema1,onSubmit:onSubmit,title:title,editData:editData,handleCancel:handleCancel,regionList:regionList,regionHandleChange:handleChange,selectedRegion:selectedRegion}) 
    },[roleData,regionList,selectedRegion])
    const handleAdd = () => {
        fetchRoleData()
        setSessionStorageItem('inputBar',true);
        inputContextObj?.setInputObj({from:"RegionUser", roleData:roleData,schema:schema,schema1:schema1,onSubmit:onSubmit,title:title,editData:editData,handleCancel:handleCancel,regionList:regionList,regionHandleChange:handleChange,selectedRegion:selectedRegion})
    }

    const handleChange = (selectedOptions,name) => {
        // setValue("region_id", [selectedOptions])
        setSelectedRegion([selectedOptions])
        // inputContextObj?.setInputObj({from:"RegionUser",setValue:setValue, roleData:roleData,schema:schema,schema1:schema1,onSubmit:onSubmit,title:title,editData:editData,handleCancel:handleCancel,regionList:regionList,regionHandleChange:handleChange,selectedRegion:selectedRegion}) 
    }

    const searchRegion = (e) => {
        var url = `/region/seach_region_user/?value=${e?.target?.value}&skip=${skip}&limit=${limit}`
        getAPI(url).then((response) => {
            var temp = [];
            console.log('response?.data?.data',response?.data?.data);
            response?.data?.data?.map((item) => {
                temp.push({
                    'region_id': item?.region_id,
                    'name': item?.name,
                    'email': item?.email,
                    'mobile': item?.mobile,
                    'username': item?.username,
                    'password': item?.password,
                    'role_id': item?.role_id,
                    'active': item?.active,
                    'id': item?.id,
                });        

            })
            setUserData(temp)
            console.log('temp',temp);
        }).catch((error) => {
          console.log(error)
        })
      }
    return (
        <div>
            <div className='mt-1'>
                <div className='d-flex justify-content-between align-items-end'>
                    <div className='d-flex'>
                        <input type="text" className='form-control me-2 tab_search' onChange={(e) => searchRegion(e)} placeholder='Search' />
                    </div>
                    <div>
                        <button className='btn btn-sm add px-2' type='button'
                        //  data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                          onClick={() => handleAdd()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg></button>
                    </div>
                </div>
                <div className='card tablecard my-3'>
                    <DataTable
                        columns={columns}
                        data={userdata}
                        customStyles={tableStyle}
                        pagination
                        paginationServer
                        paginationTotalRows={total}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default RegionUser