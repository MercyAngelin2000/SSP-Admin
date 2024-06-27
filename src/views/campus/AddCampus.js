import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAPI, addUpdateAPI } from '../../apiService/ApiService';
import Swal from 'sweetalert2';
import "./Campus.css";
function AddCampus() {

    const { control, register, formState: { errors }, reset, handleSubmit, setValue, getValues } = useForm({
        isActive: true
    });
    const navigate = useNavigate();
    const [campusUserList, setCampusUserList] = useState()
    const [corporateUserList, setCorporateUserList] = useState([])
    const location = useLocation();
    const [authorityError, setAuthorityError] = useState({})
    const [formEntries, setFormEntries] = useState([
    ]);
    const [roleData, setRoleData] = useState()
    const [defaultRoleValue, setDefaultRoleValue] = useState()



    const { mode } = location.state
    var id
    if (mode === "edit") {
        id = location.state?.id
    }



    useEffect(() => {
        // getCampusUserList()
        getCorporateUserList()
        fetchRoleData()
    }, [])


    const handleInputChange = (index, field, value) => {
        const updatedEntries = [...formEntries];

        if (mode === "edit") {

            // const olddata = formEntries[index][field];
            // const newAdminList = campusUserList.filter((item) => item.value !== value?.value);
            // olddata ? setCampusUserList([...newAdminList, olddata]) : setCampusUserList(newAdminList);
            // setCampusUserList(newAdminList);
            updatedEntries[index][field] = value;
            setFormEntries(updatedEntries);

        }
        else {
            updatedEntries[index][field] = value;
            setFormEntries(updatedEntries);
        }
    };

    const addNewEntry = () => {
        // setFormEntries([...formEntries, { user: '', position: '', phone1: '', phone2: '', email1: '', email2: '' }]);
        setFormEntries([...formEntries, { name: '', position: '', phone1: '', phone2: '', email1: '', email2: '', username: '', password: '', role: '' }]);
    };

    const removeEntry = (index) => {
        // if (formEntries && campusUserList.filter((item) => item.value == formEntries[index]?.user?.value).length === 0) {
        //     setCampusUserList([...campusUserList, formEntries[index].user]);
        // }
        const updatedEntries = formEntries.filter((_, i) => i !== index);
        setFormEntries(updatedEntries);
    }
    const getCampusData = () => {

        var url = `/campus/${id}`
        getAPI(url).then((response) => {
            var data = response?.data?.data
            reset({ ...data, 'corporate_group_id': { value: data?.corporate?.id, label: data?.corporate?.name } })

            if (data?.authorities) {
                var temp = []
                data?.authorities?.forEach((item) => {
                    temp.push({ ...item })
                })
                console.log(temp);
                setFormEntries(temp)
                setFormEntries((prevForm) =>
                    prevForm.map(({ role_id, ...rest }) => ({
                        role: role_id,
                        ...rest,
                    }))
                );
            }

        })

    }
    const getCampusUserList = () => {
        var url = `/campus/admins`
        getAPI(url).then((response) => {

            var data = response?.data?.data
            var list = data?.map((item) => ({ value: item?.id, label: item?.name }))
            setCampusUserList(list)
            if (mode === "edit") {
                getCampusData()
            }

        }).catch((error) => {
            console.log(error);
        })
    }

    const getCorporateUserList = () => {
        var url = `/campus/corporateList`
        getAPI(url).then((response) => {
            var data = response?.data?.data
            var list = data?.map((item) => ({ value: item?.id, label: item?.name }))
            setCorporateUserList(list)

        }).catch((error) => {
            console.log(error);
        })
    }
    const addCampus = (data) => {
        const newErrors = {};
        var authorityData = []
        console.log('====================================');
        console.log("data", data);
        console.log('====================================');
        // For Authority Validation 
        if (!formEntries.length == 0) {
            formEntries.forEach((entry, index) => {
                if (!entry.name) {
                    newErrors[index] = newErrors[index] || {};
                    newErrors[index].name = 'Name is required';
                }
                if (!entry.position) {
                    newErrors[index] = newErrors[index] || {};
                    newErrors[index].position = 'Position is required';
                }
                if (!entry.email1) {
                    newErrors[index] = newErrors[index] || {};
                    newErrors[index].email1 = 'Email Id is required';
                }
                if (!entry.phone1) {
                    newErrors[index] = newErrors[index] || {};
                    newErrors[index].phone1 = 'Phone Number is required';
                }
                if (!entry.username) {
                    newErrors[index] = newErrors[index] || {};
                    newErrors[index].username = 'Username is required';
                }
                if (!entry.password) {
                    newErrors[index] = newErrors[index] || {};
                    newErrors[index].password = 'Password is required';
                }
                if (!entry.role) {
                    newErrors[index] = newErrors[index] || {};
                    newErrors[index].role = 'Role is required';
                }
            });
            setAuthorityError(newErrors);
        }

        if (Object.keys(newErrors).length === 0) {
            if (!formEntries?.length == 0) {
                formEntries.forEach((entry, index) => {

                    var data = {
                        "position": entry?.position,
                        "phone1": entry?.phone1,
                        "email1": entry?.email1,
                        // "user_id": entry?.user?.value
                        "role_id": entry?.role,
                        "username": entry?.username,
                        "name": entry?.name,
                        "password": entry?.password
                    }
                    if (entry?.phone2) {
                        data['phone2'] = entry?.phone2
                    }
                    if (entry?.email2) {
                        data['email2'] = entry?.email2
                    }
                    if (mode === "edit") {
                        data['id'] = entry?.id
                        data['campus_id'] = entry?.campus_id
                        data['role_id'] = entry?.role
                        data['user_id'] = entry?.user?.id
                    }
                    authorityData.push(data)

                })
                console.log('====================================');
                console.log(authorityData);
                console.log('====================================');
            }

            const values = {
                "campus_code": data?.campus_code,
                "name": data?.name,
                "address": data?.address,
                "city": data?.city,
                "district": data?.district,
                "state": data?.state,
                "pincode": data?.pincode,
                "isActive": data?.isActive,
                // "corporate_group_id": data?.corporate_group_id?.value,
                "authorities": authorityData

            }
            var method
            var url

            if (mode === 'add') {
                method = "POST"
                url = `/campus/`
            }
            else {
                method = "PUT"
                url = `/campus/` + data?.id
            }

            addUpdateAPI(method, url, values).then((response) => {
                if (response?.data?.status) {
                    Swal.fire({
                        toast: true,
                        position: "center",
                        icon: "success",
                        title: mode === 'add' ? "Campus added successfully" : "Campus updated successfully",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    navigate('/campus')
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
    }

    const handleNumericInput = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters     
        if (value.length <= 6) {
            e.target.value = value; // Update the input value with the numeric-only value
        } else {
            e.target.value = value.slice(0, 6); // Restrict to 6 digits
        }
    };


    const fetchRoleData = () => {
        var url = `/users/roles/`
        getAPI(url).then((response) => {
            var data = response?.data?.data
            console.log(data);
            var arr = []
            //eslint-disable-next-line
            data.map(it => {
                if (it?.name === "Campus Admin") {
                    arr.push(it)
                }
            })
            setDefaultRoleValue(arr[0]?.id)
            setRoleData(arr)

            // Initialize roles if not set
            const updatedEntries = formEntries.map(entry => ({
                ...entry,
                role: entry.role || (roleData.length > 0 ? roleData[0].id : ''),
            }));
            setFormEntries(updatedEntries);
            if (mode === "edit") {
                getCampusData()
            }
        }).catch((error) => {
            console.log(error)
        })
        console.log('formEntries', formEntries);
    }


    return (
        <div>
            <small className='text-muted'>Home / System admin / <span className='text-primary' onClick={() => navigate('/campus')} role='button' title='Navigate to Campus'>Campus</span></small>
            <div className='container-fluid p-0'>
                <h6 className='title fw-bold mt-1'>Campus</h6>
            </div>
            <div
                className='container-fluid card mb-5 container-card'>
                <form onSubmit={handleSubmit(addCampus)}>
                    <div className='container-fluid card my-3 tablecard '>

                        <div className="mt-3 ">
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-sm border text-primary' onClick={() => navigate('/campus')} title='Back'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                                    </svg>
                                </button>

                            </div>

                            <div className="row">
                                <div className="col">
                                    <label className="mt-2">Campus Code <span className="text-danger">*</span></label>
                                    <input placeholder="Enter Campus Code" className="form-control" {...register('campus_code', { required: true })} />
                                    {errors?.campus_code && <span className="text-danger">Campus Code is required</span>}
                                </div>
                                <div className="col">
                                    <label className="mt-2">Campus Name <span className="text-danger">*</span></label>
                                    <input placeholder="Enter Campus Name" className="form-control" {...register('name', { required: true })} />
                                    {errors.name && <span className="text-danger">Campus Name is required</span>}
                                </div>
                                <div className="col">
                                    <label className="mt-2">Address <span className="text-danger">*</span></label>
                                    <input placeholder="Enter Address" className="form-control" {...register('address', { required: true })} />
                                    {errors.address && <span className="text-danger">Address is required</span>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label className="mt-2">City <span className="text-danger">*</span></label>
                                    <input placeholder="Enter City" className="form-control" {...register('city', { required: true })} />
                                    {errors.city && <span className="text-danger">City is required</span>}
                                </div>
                                <div className="col">
                                    <label className="mt-2">District <span className="text-danger">*</span></label>
                                    <input placeholder="Enter District" className="form-control" {...register('district', { required: true })} />
                                    {errors.district && <span className="text-danger">District is required</span>}
                                </div>
                                <div className="col">
                                    <label className="mt-2">State <span className="text-danger">*</span></label>
                                    <input placeholder="Enter State" className="form-control" {...register('state', { required: true })} />
                                    {errors.state && <span className="text-danger">State is required</span>}
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <label className="mt-2">Pincode <span className="text-danger">*</span></label>
                                    <input type="text" placeholder="Enter Pincode"
                                        className="form-control"
                                        {...register('pincode', {
                                            required: 'Pincode is required',
                                            pattern: {
                                                value: /^\d{6}$/,
                                                message: 'Invalid pincode format'
                                            },
                                            maxLength: {
                                                value: 6,
                                                message: 'Pincode cannot exceed 6 digits'
                                            }
                                        })}
                                    />
                                    {errors.pincode && <span className="text-danger">{errors.pincode.message}</span>}
                                </div>
                                <div className="col-md-4 mt-4">
                                    <label className="mt-2"> <input type="checkbox" defaultChecked={true} className="form-check-input"{...register('isActive', { required: true })} /> Set as active <span className="text-danger">*</span></label>
                                    <div>
                                        {errors.isActive && <span className="text-danger">Is Active is required</span>}
                                    </div>
                                </div>

                                {/* <div className="col">
                                    <label className="mt-2">Corporate Admin <span className="text-danger">*</span></label>
                                    <Controller
                                        name="corporate_group_id"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={corporateUserList}
                                                isClearable
                                            // onChange={(selectedOptions) => {
                                            //     handleChange(selectedOptions);
                                            // }}
                                            />
                                        )}
                                    />
                                    {errors.corporate_group_id && <span className="text-danger">Admin is required</span>}
                                </div> */}
                            </div>
                        </div>

                        <div>
                            <div className='row d-inline-flex justify-content-start align-items-center p-3'>
                                <button type='button' className='btn  btn-sm add' onClick={addNewEntry}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle me-1" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                    </svg> Authorities</button>
                            </div>
                            <div className='row p-3'>

                                {formEntries.map((entry, index) => (
                                    <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                                        <div className='d-flex justify-content-end align-items-center' title='Remove'>
                                            <button type='button' className='btn text-danger ' onClick={() => removeEntry(index)}
                                            // style={{ backgroundColor: 'red', color: 'white', textAlign: 'end' }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon-fill" viewBox="0 0 16 16">
                                                    <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0  0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col'>
                                                {/* <Select
                                                    options={campusUserList}
                                                    placeholder="Select campus user"
                                                    value={formEntries[index]?.user}
                                                    onChange={(selectedOption) => handleInputChange(index, 'user', selectedOption)}
                                                /> */}
                                                <label>Name <span className="text-danger">*</span></label>
                                                <input
                                                    className='form-control'
                                                    type="text"
                                                    placeholder="Enter Name"
                                                    value={entry.name}
                                                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                                />
                                                {authorityError[index]?.name && <span className="text-danger">{authorityError[index].name}</span>}
                                            </div>
                                            <div className='col'>
                                                <label>Position <span className="text-danger">*</span></label>
                                                <input
                                                    className='form-control'
                                                    type="text"
                                                    placeholder="Enter Position"
                                                    value={entry.position}
                                                    onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                                                />
                                                {authorityError[index]?.position && <span className="text-danger">{authorityError[index].position}</span>}
                                            </div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col'>
                                                <label>Username <span className="text-danger">*</span></label>
                                                <input
                                                    className='form-control'
                                                    type="text"
                                                    placeholder="Enter Username"
                                                    value={entry.username}
                                                    onChange={(e) => handleInputChange(index, 'username', e.target.value)}
                                                />
                                                {authorityError[index]?.username && <span className="text-danger">{authorityError[index].username}</span>}
                                            </div>
                                            <div className='col'>
                                                <label>Password <span className="text-danger">*</span></label>
                                                <input
                                                    className='form-control'
                                                    type="password"
                                                    placeholder="Enter Password"
                                                    value={entry.password}
                                                    onChange={(e) => handleInputChange(index, 'password', e.target.value)}
                                                />
                                                {authorityError[index]?.password && <span className="text-danger">{authorityError[index].password}</span>}
                                            </div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col'>
                                                <label>Email 1 <span className="text-danger">*</span></label>
                                                <input
                                                    className='form-control'
                                                    type="email"
                                                    placeholder="Enter Email 1"
                                                    value={entry.email1}
                                                    onChange={(e) => handleInputChange(index, 'email1', e.target.value)}
                                                />
                                                {authorityError[index]?.email1 && <span className="text-danger">{authorityError[index].email1}</span>}

                                            </div>
                                            <div className='col'>
                                                <label>Email 2</label>
                                                <input
                                                    className='form-control'
                                                    type="email"
                                                    placeholder="Enter Email 2"
                                                    value={entry.email2}
                                                    onChange={(e) => handleInputChange(index, 'email2', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col-md-6'>
                                                <label>Phone 1 <span className="text-danger">*</span></label>
                                                <PhoneInput
                                                    country={'in'}
                                                    value={String(entry.phone1)}
                                                    onChange={(phone) => handleInputChange(index, 'phone1', phone)}
                                                />
                                                {authorityError?.[index]?.phone1 && <span className="text-danger">{authorityError?.[index]?.phone1}</span>}
                                            </div>
                                            <div className='col-md-6'>
                                                <label>Phone 2 </label>
                                                <PhoneInput
                                                    country={'in'}
                                                    value={String(entry.phone2)}
                                                    onChange={(phone) => handleInputChange(index, 'phone2', phone)}
                                                />
                                            </div>
                                        </div>
                                        {/* <div className='row p-2'>
                                              <Select
                                                    options={campusUserList}
                                                    placeholder="Select campus user"
                                                    value={formEntries[index]?.user}
                                                    onChange={(selectedOption) => handleInputChange(index, 'user', selectedOption)}
                                                />
                                            </div>                                  */}
                                        <div className='row p-2'>
                                            <label htmlFor="role">Role<span className='text-danger'>*</span></label>
                                            {/* <select className='form-control' id="role" onChange={(e) => handleInputChange(index, 'role', e.target.value)} value={entry.role}  {...register(`formEntries[${index}].role`, { required: 'Role is required' })}>
                                                {
                                                    roleData?.map((item, index) => {
                                                        return <option key={index} value={item?.id ? item?.id : roleData[0].id} defaultValue={item?.id ? item?.id : roleData[0].id}>{item?.name}</option>
                                                    })
                                                }
                                            </select> */}

                                            <select
                                                id="role"
                                                className="form-control"
                                                name="role"
                                                value={entry.role ? entry.role : entry.role_id}
                                                onChange={(e) =>
                                                    handleInputChange(index, 'role', e.target.value)
                                                }
                                            >
                                                {entry.role == "" ? (
                                                    <option selected>
                                                        --- Select Role ---
                                                    </option>
                                                ) : (
                                                    ""
                                                )}
                                                {roleData?.map((item) => {
                                                    return (
                                                        <option value={item?.id}>{item?.name}</option>
                                                    );
                                                })}
                                            </select>

                                            {authorityError?.[index]?.role && <span className="text-danger">{authorityError?.[index]?.role}</span>}
                                        </div>
                                    </div>
                                ))}
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

export default AddCampus
