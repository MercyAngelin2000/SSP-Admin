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

    const { control, register, formState: { errors }, reset, handleSubmit, setValue, getValues } = useForm();
    const navigate = useNavigate();
    const [campusUserList, setCampusUserList] = useState()
    const [corporateUserList, setCorporateUserList] = useState([])
    const location = useLocation();
    const [authorityError, setAuthorityError] = useState({})
    const [formEntries, setFormEntries] = useState([
    ]);


    const { mode } = location.state
    var id
    if (mode === "edit") {
        id = location.state?.id
    }



    useEffect(() => {
        getCampusUserList()
        getCorporateUserList()

    }, [])


    const handleInputChange = (index, field, value) => {
        const updatedEntries = [...formEntries];

        if (mode === "edit" && field === "user") {

            const olddata = formEntries[index][field];
            const newAdminList = campusUserList.filter((item) => item.value !== value?.value);
            olddata ? setCampusUserList([...newAdminList, olddata]) : setCampusUserList(newAdminList);
            updatedEntries[index][field] = value;
            setFormEntries(updatedEntries);

        }
        else {
            updatedEntries[index][field] = value;
            setFormEntries(updatedEntries);
        }
    };

    const addNewEntry = () => {
        setFormEntries([...formEntries, { user: '', position: '', phone1: '', phone2: '', email1: '', email2: '' }]);
    };

    const removeEntry = (index) => {
        if (formEntries && campusUserList.filter((item) => item.value == formEntries[index]?.user?.value).length === 0) {
            setCampusUserList([...campusUserList, formEntries[index].user]);
        }
        const updatedEntries = formEntries.filter((_, i) => i !== index);
        setFormEntries(updatedEntries);
    }
    const getCampusData = () => {

        var url = `/campus/${id}`
        getAPI(url).then((response) => {
            var data = response?.data?.data
            reset({ ...data, 'corporate_group_id': { value: data?.corporate?.id, label: data?.corporate?.name } })
            if (data?.authority) {
                var temp = []
                data?.authority?.forEach((item) => {
                    temp.push({ ...item, user: { value: item?.user?.id, label: item?.user?.name } })
                })
                setFormEntries(temp)
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

        // For Authority Validation 
        if (!formEntries.length == 0) {
            formEntries.forEach((entry, index) => {
                if (!entry.user) {
                    newErrors[index] = newErrors[index] || {};
                    newErrors[index].user = 'User is required';
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
                        "user_id": entry?.user?.value
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

                    }
                    authorityData.push(data)

                })
            }

            const values = {
                "campus_code": data?.campus_code,
                "name": data?.name,
                "address": data?.address,
                "city": data?.city,
                "district": data?.district,
                "state": data?.state,
                "pincode": data?.pincode,
                "corporate_group_id": data?.corporate_group_id?.value,
                "authority": authorityData

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
                                    <label className="mt-2">Code <span className="text-danger">*</span></label>
                                    <input className="form-control" {...register('campus_code', { required: true })} />
                                    {errors?.campus_code && <span className="text-danger">Code is required</span>}
                                </div>
                                <div className="col">
                                    <label className="mt-2">Name <span className="text-danger">*</span></label>
                                    <input className="form-control" {...register('name', { required: true })} />
                                    {errors.name && <span className="text-danger">Name is required</span>}
                                </div>
                                <div className="col">
                                    <label className="mt-2">Address <span className="text-danger">*</span></label>
                                    <input className="form-control" {...register('address', { required: true })} />
                                    {errors.address && <span className="text-danger">Address is required</span>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label className="mt-2">City <span className="text-danger">*</span></label>
                                    <input className="form-control" {...register('city', { required: true })} />
                                    {errors.city && <span className="text-danger">City is required</span>}
                                </div>
                                <div className="col">
                                    <label className="mt-2">District <span className="text-danger">*</span></label>
                                    <input className="form-control" {...register('district', { required: true })} />
                                    {errors.district && <span className="text-danger">District is required</span>}
                                </div>
                                <div className="col">
                                    <label className="mt-2">Pincode <span className="text-danger">*</span></label>
                                    <input
                                        className="form-control"
                                        {...register('pincode', {
                                            required: 'Pincode is required',
                                            pattern: {
                                                value: /^\d{6}$/,
                                                message: 'Invalid pincode format'
                                            }
                                        })}
                                    />
                                    {errors.pincode && <span className="text-danger">{errors.pincode.message}</span>}
                                </div>
                            </div>
                            <div className="row">

                            </div>
                            <div className="row">
                                <div className="col">
                                    <label className="mt-2">State <span className="text-danger">*</span></label>
                                    <input className="form-control" {...register('state', { required: true })} />
                                    {errors.state && <span className="text-danger">State is required</span>}
                                </div>
                                <div className="col">
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
                                </div>
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
                                                <Select
                                                    options={campusUserList}
                                                    placeholder="Select campus user"
                                                    value={formEntries[index]?.user}
                                                    onChange={(selectedOption) => handleInputChange(index, 'user', selectedOption)}
                                                />
                                                {authorityError[index]?.user && <span className="text-danger">{authorityError[index].user}</span>}
                                            </div>
                                            <div className='col'>
                                                <input
                                                    className='form-control'
                                                    type="text"
                                                    placeholder="Position"
                                                    value={entry.position}
                                                    onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                                                />
                                                {authorityError[index]?.position && <span className="text-danger">{authorityError[index].position}</span>}
                                            </div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col'>
                                                <PhoneInput
                                                    country={'in'}
                                                    value={String(entry.phone1)}
                                                    onChange={(phone) => handleInputChange(index, 'phone1', phone)}
                                                />
                                                {authorityError?.[index]?.phone1 && <span className="text-danger">{authorityError?.[index]?.phone1}</span>}
                                            </div>
                                            <div className='col'>
                                                <PhoneInput
                                                    country={'in'}
                                                    value={String(entry.phone2)}
                                                    onChange={(phone) => handleInputChange(index, 'phone2', phone)}
                                                />
                                            </div>
                                        </div>
                                        <div className='row p-2'>
                                            <div className='col'>
                                                <input
                                                    className='form-control'
                                                    type="email"
                                                    placeholder="Email Id"
                                                    value={entry.email1}
                                                    onChange={(e) => handleInputChange(index, 'email1', e.target.value)}
                                                />
                                                {authorityError[index]?.email1 && <span className="text-danger">{authorityError[index].email1}</span>}

                                            </div>
                                            <div className='col'>
                                                <input
                                                    className='form-control'
                                                    type="email"
                                                    placeholder="Email Id-2"
                                                    value={entry.email2}
                                                    onChange={(e) => handleInputChange(index, 'email2', e.target.value)}
                                                />
                                            </div>
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