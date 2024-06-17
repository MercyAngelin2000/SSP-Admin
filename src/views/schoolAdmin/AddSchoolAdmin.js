import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAPI, addUpdateAPI } from '../../apiService/ApiService';
import Swal from 'sweetalert2';
import "./SchoolAdmin.css";
function AddSchoolAdmin() {

    const { control, register, formState: { errors }, reset, handleSubmit, setValue, getValues,clearErrors } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [adminUserList, setAdminUserList] = useState([])
    const [schoolList, setSchoolList] = useState([])
    const { mode } = location.state || 'add'

    var id
    if (mode === "edit") {
        id = location.state?.id
    }

    useEffect(() => {
        getAdminUserList()
        getSchoolList()

    }, [])

    useEffect(() => {
        if (mode === "edit") {
            getSchoolAdminData()
        }
    }, [])

    const getSchoolAdminData = () => {

        var url = `/admin/${id}`
        getAPI(url).then((response) => {
            var data = response?.data?.data
            reset(
                {
                    'id': data?.id,
                    "school_id": { value: data?.school?.id, label: data?.school?.school_name },
                    "user_id": { value: data?.user?.id, label: data?.user?.name },
                    "staff_code": data?.staff_code,
                    "first_name": data?.first_name,
                    "mobile_number": String(data?.mobile_number),
                    "email": data?.email,
                    "address": data?.address
                }
            )
        })

    }




    const handleInputChange = (field, value) => {

        if(value){
            if (mode === "edit") {
                const olddata = getValues(field);
                if (field === "user_id") {
                    const newAdminList = adminUserList.filter((item) => item.value !== value?.value);
                    olddata ? setAdminUserList([...newAdminList, olddata]) : setAdminUserList(newAdminList);
                }
                else {
                    const newAdminList = schoolList.filter((item) => item.value !== value?.value);
                    olddata ? setSchoolList([...newAdminList, olddata]) : setSchoolList(schoolList);
                }
            }
            clearErrors(field)
            setValue(field, value);           
        }
    
      
    };

    const getSchoolList = () => {
        var url = `/schools/school_list`
        getAPI(url).then((response) => {
            var data = response?.data?.data
            var list = data?.map((item) => ({ value: item?.id, label: item?.school_name }))
            setSchoolList(list)

        }).catch((error) => {
            console.log(error);
        })
    }
    const getAdminUserList = () => {
        var url = `/admin/schooladminroleuser/`
        getAPI(url).then((response) => {

            var data = response?.data?.data
            var list = data?.map((item) => ({ value: item?.id, label: item?.name }))
            setAdminUserList(list)
        }).catch((error) => {
            console.log(error);
        })
    }


    const addSchoolAdmin = (data,e) => {
        e.preventDefault();
        const values =
        {
            ...data,
            "school_id": data?.school_id?.value,
            "user_id": data?.user_id?.value,
        }

        var method
        var url

        if (mode === 'add') {
            method = "POST"
            url = `/admin/`
        }
        else {
            method = "PUT"
            url = `/admin/` + data?.id
        }

        addUpdateAPI(method, url, values).then((response) => {
            if (response?.data?.status) {
                Swal.fire({
                    toast: true,
                    position: "center",
                    icon: "success",
                    title: mode === 'add' ? "School Admin added successfully" : "School Admin updated successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/schooladmin');
            } else {
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

    return (
        <div>
            <small className='text-muted'>Home / System admin / <span className='text-primary' onClick={() => navigate('/schooladmin')} role='button' title='Navigate to School Admin'>School Admin</span></small>
            <div className='container-fluid p-0'>
                <h6 className='title fw-bold mt-1'>{mode === 'add' ? 'Add ' : 'Edit '}School Admin</h6>
            </div>
            <div
                className='container-fluid card mb-5 container-card'>
                <form onSubmit={handleSubmit(addSchoolAdmin)}>
                    <div className='container-fluid card my-3 tablecard '>

                        <div className="mt-3 ">
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-sm border text-primary' onClick={() => navigate('/schooladmin')} title='Back'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                                    </svg>
                                </button>

                            </div>
                            <div className="row">
                                <div className="col">
                                    <label className="mt-2">School <span className="text-danger">*</span></label>
                                    <Controller
                                        name="school_id"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={schoolList}
                                                isClearable
                                                onChange={(selectedOptions) => {
                                                    handleInputChange('school_id', selectedOptions);
                                                }}
                                            />
                                        )}
                                    />
                                    {errors?.school_id && <span className="text-danger">School is required</span>}
                                </div>
                                <div className="col">
                                    <label className="mt-2">School Admin <span className="text-danger">*</span></label>
                                    <Controller
                                        name="user_id"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={adminUserList}
                                                isClearable
                                                onChange={(selectedOptions) => {
                                                    handleInputChange('user_id', selectedOptions);
                                                }}
                                            />
                                        )}
                                    />
                                    {errors?.user_id && <span className="text-danger">User is required</span>}
                                </div>
                                <div className="col">
                                    <label className="mt-2">Staff Code <span className="text-danger">*</span></label>
                                    <input className="form-control" {...register('staff_code', { required: true })} />
                                    {errors?.staff_code && <span className="text-danger">Staff-Code is required</span>}
                                </div>
                            </div>

                            <div className="row">

                                <div className="col">
                                    <label className="mt-2">Name <span className="text-danger">*</span></label>
                                    <input className="form-control" {...register('first_name', { required: true })} />
                                    {errors?.first_name && <span className="text-danger">Name is required</span>}
                                </div>
                                <div className='col'>
                                    <label className="mt-2">Phone Number <span className="text-danger">*</span></label>
                                    <Controller
                                        name="mobile_number"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <PhoneInput
                                                {...field}
                                                country={'in'}
                                                value={field.value}

                                            // onChange={(phone) => field.onChange(phone)}
                                            />
                                        )}
                                    />
                                    {errors?.mobile_number && <span className="text-danger">Mobile Number is required</span>}
                                </div>
                                <div className="col">
                                    <label className="mt-2">Email <span className="text-danger">*</span></label>
                                    <input className="form-control" {...register('email', { required: true })} />
                                    {errors?.email && <span className="text-danger">Email Id is required</span>}
                                </div>
                            </div>
                            <div className="row">

                                <div className="col-4">
                                    <label className="mt-2">Address <span className="text-danger">*</span></label>
                                    <textarea className="form-control" {...register('address', { required: true })} />
                                    {errors.address && <span className="text-danger">Address is required</span>}
                                </div>

                            </div>
                        </div>

                        <div className="modal-footer mt-2 mb-3">
                            <button type="submit" className="btn btn-sm add">{mode === "edit" ? "Update" : "Save"} </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddSchoolAdmin