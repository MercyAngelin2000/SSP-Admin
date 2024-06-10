import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getAPI, addUpdateAPI } from '../../apiService/ApiService';

function AddSchoolAccount({ title ,getData,editMethod}) {
    const schema = yup.object().shape({
        region: yup.string().required('Region is required'),
        corporateGroupCode: yup.string().required('Corporate Group Code is required'),
        campus: yup.string().required('Campus is required'),
        schoolCode: yup.string().required('School Code is required'),
        schoolName: yup.string().required('School Name is required'),
        type: yup.string().required('Type is required'),
        email: yup.string().email('Email is invalid').required('Email is required'),
        mailPassword: yup.string().required('Mail Password is required')
            .min(8, 'Password must be at least 8 characters')
            .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('mailPassword'), null], 'Passwords must match')
            .required('Confirm password is required'),
        license: yup.string().required('License is required'),
        senderId: null,
    });
    const schema1 = yup.object().shape({
        region: yup.string().required('Region is required'),
        corporateGroupCode: yup.string().required('Corporate Group Code is required'),
        campus: yup.string().required('Campus is required'),
        schoolCode: yup.string().required('School Code is required'),
        schoolName: yup.string().required('School Name is required'),
        type: yup.string().required('Type is required'),
        email: yup.string().email('Email is invalid').required('Email is required'),
        license: yup.string().required('License is required'),
        senderId:null,
    });
    const { control, handleSubmit, watch, reset, formState: { errors } } = useForm({
        resolver: yupResolver(editMethod ? schema1:schema),
    });
    const [formFields, setFormFields] = useState([]);
    const [formFieldsErr, setFormFieldsErr] = useState([]);

    const [regions, setRegions] = useState([]);
    const [corporateGroups, setCorporateGroups] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [types, setTypes] = useState();
    const [phoneNumber, setPhoneNumber] = useState({ value: '', isValid: true });

    const watchRegion = watch('region');
    const watchCorporateGroup = watch('corporateGroupCode');
    const watchCampus = watch('campus');

    useEffect(() => {
        // Fetch regions data
        getAPI('/region/activeregions/').then((response) => {
            setRegions(response.data?.data);
        }).catch((error) => {
            console.log(error);
        });
    }, [editMethod]);

    useEffect(() => {
        if (watchRegion || editMethod) {
            // Fetch corporate group codes based on selected region
            getAPI(`/schools/corporatebyregionid/${watchRegion ? watchRegion : editMethod?.region_id}`).then(response => {
                setCorporateGroups(response.data?.data);
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [watchRegion,editMethod]);

    useEffect(() => {
        if (watchCorporateGroup || editMethod) {
            // Fetch campuses based on selected corporate group
            getAPI(`/schools/campusbycorporateid/${watchCorporateGroup  ? watchCorporateGroup : editMethod?.corporate_group_id}`).then(response => {
                setCampuses(response.data?.data);
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [watchCorporateGroup,editMethod]);

    useEffect(()=>{
        getAPI('/schools/schooltypes').then((response)=>{
            setTypes(response.data?.data)
        }).catch((error)=>{
            console.log(error)
        })
    },[editMethod])
    useEffect(() => {
        if(editMethod){
        reset({
            region: editMethod?.region_id,
            corporateGroupCode: editMethod?.corporate_group_id,
            campus: editMethod?.campus_id,
            schoolCode: editMethod?.school_code,
            schoolName: editMethod?.school_name,
            type: editMethod?.school_type,
            email: editMethod?.email,
            mailPassword: editMethod?.mail_password,
            license: editMethod?.license,
            senderId: editMethod?.sender_id,
        })
        setPhoneNumber({ value: editMethod?.phone_number, isValid: true })
        var data=[]
        // eslint-disable-next-line
        editMethod?.clients?.map((field) => {
            data?.push({
                id: field?.id,
                school_id: editMethod?.id,
                name: field?.name,
                designation: field?.designation,
                phone: field?.phone,
                email: field?.email

            })
            console.log(data);
            setFormFieldsErr([...formFieldsErr, { nameErr: '', designationErr: '', phoneErr: '', emailErr: '' }]);
        })
        setFormFields(data);
    }
    else{
        setFormFields([])
        setFormFieldsErr([])
        reset({
            region: '',
            corporateGroupCode: '',
            campus: '',
            schoolCode: '',
            schoolName: '',
            type: '',
            email: '',
            mailPassword: '',
            license: '',
            senderId: '',
        })
        setPhoneNumber({ value: '', isValid: true })
    }
        // eslint-disable-next-line
    },[editMethod])
    const handlePhoneInput = (number, country) => {
        if (number?.length === 12) {
            setPhoneNumber({ value: number, isValid: true })
        }
        else {
            setPhoneNumber({ value: number, isValid: false })
        }
        // number?.slice(country?.dialCode?.length)
    }
    const handleChange = (index, event) => {
        const values = [...formFields];
        const name = event.target.name;
        const value = event.target.value;
        values[index][name] = value;
        setFormFields(values);

        const newFieldsErr = [...formFieldsErr];
        newFieldsErr[index][`${name}Err`] = '';
        setFormFieldsErr(newFieldsErr);
    };

    const handlePhoneChange = (index, value) => {
        const values = [...formFields];
        values[index].phone = value;
        setFormFields(values);
        if (value?.length === 12) {
            const newFieldsErr = [...formFieldsErr];
            newFieldsErr[index][`phoneErr`] = '';
            setFormFieldsErr(newFieldsErr);
        }
        else {
            const newFieldsErr = [...formFieldsErr];
            newFieldsErr[index][`phoneErr`] = 'phone is invalid';
            setFormFieldsErr(newFieldsErr);
        }
    };

    const handleAddFields = () => {
        setFormFields([...formFields, { name: '', designation: '', phone: '', email: '' }]);
        setFormFieldsErr([...formFieldsErr, { nameErr: '', designationErr: '', phoneErr: '', emailErr: '' }]);
    };

    const handleRemoveFields = (index) => {
        const values = [...formFields];
        values.splice(index, 1);
        setFormFields(values);

        const errors = [...formFieldsErr];
        errors.splice(index, 1);
        setFormFieldsErr(errors);
    };
    const handleDynamicValidation = () => {
        var keys = formFields?.map(field => { return Object.keys(field) })
        var data = keys?.[0]
        var newError = [...formFieldsErr]
         // eslint-disable-next-line
        formFields.map((field, index) => {
             // eslint-disable-next-line
            data?.map((key) => {
                if (field?.[key] === "") {
                    newError[index][`${key}Err`] = `${key} is required`
                }
            })
        })
        setFormFieldsErr(newError)
    }
    const onSubmit = (data) => {
        if (String(phoneNumber?.value)?.length === 0) {
            setPhoneNumber({ value: phoneNumber?.value, isValid: false })
            return;
        }
        else if (String(phoneNumber?.value)?.length !== 12) {
            setPhoneNumber({ value: phoneNumber?.value, isValid: false })
            return;
        }
        else{
            setPhoneNumber({ value: phoneNumber?.value, isValid: true })
        }
        handleDynamicValidation();

        if (formFieldsErr?.some(field => field?.nameErr !== "" || field?.designationErr !== "" || field?.phoneErr !== "" || field?.emailErr !== "")) {
            return;
        }
        else {
            var clients=[];
             // eslint-disable-next-line
                formFields.map((field)=>{
                    clients.push({
                        "school_id": field?.school_id ? field?.school_id:null,
                        "id": field?.id ? field?.id:null,
                        "name": field?.name,
                        "designation": field?.designation,
                        "phone": field?.phone,
                        "email": field?.email
                    })
                })
            var apiData = {
                "corporate_group_id": Number(data?.corporateGroupCode),
                "campus_id": Number(data?.campus),
                "school_code": data?.schoolCode,
                "school_name": data?.schoolName,
                "school_type": Number(data?.type),
                "phone_number": phoneNumber?.value,
                "email": data?.email,
                "mail_password":data?.mailPassword,
                "license": data?.license,
                "region_id": Number(data?.region),
                "sender_id": data?.senderId ? data?.senderId : null,
                "clients": clients
            }
            var method;
            var url ;
            if(title === "Add School Account"){
                method="POST"
                url="/schools"
            }
            else{
                method="PUT"
                url=`/schools/${editMethod?.id}`
            }
            addUpdateAPI(method,url, apiData).then((response) => {
                var data = response?.data
                if (data?.status) {
                    Swal.fire({
                        toast: true,
                        position: "center",
                        icon: "success",
                        title: "School Acoount created successfully",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    getData("success")
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
    };
    return (
        <div><div className='card'>
            <label className='d-flex justify-content-center align-items-center m-2 fw-bold'>
                {title}
            </label>
            <div className='card-body'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='row'>
                        <div className='col-lg-4'>
                            <label className='mb-2'>Region <span className='text-danger'>*</span></label>
                            <Controller
                                name="region"
                                control={control}
                                render={({ field }) => (
                                    <select {...field} className='form-select'>
                                        <option value="">Select</option>
                                        {regions?.map(region => (
                                            <option key={region?.id} value={region?.id}>{region?.code ? region?.code : ""} - {region?.name ? region?.name : ''}</option>
                                        ))}
                                    </select>
                                )}
                            />
                            <span className='text-danger'>{errors.region?.message}</span>
                        </div>

                        {watchRegion && (
                            <div className='col-lg-4'>
                                <label className='mb-2'>Corporate Group Code <span className='text-danger'>*</span></label>
                                <Controller
                                    name="corporateGroupCode"
                                    control={control}
                                    render={({ field }) => (
                                        <select {...field} className='form-select'>
                                            <option value="">Select</option>
                                            {corporateGroups.map(group => (
                                                <option key={group?.id} value={group?.id}>{group?.corporate_group_code ? group?.corporate_group_code : ""} - {group?.name ? group?.name : ''}</option>
                                            ))}
                                        </select>
                                    )}
                                />
                                <span className='text-danger'>{errors.corporateGroupCode?.message}</span>
                            </div>
                        )}

                        {watchCorporateGroup && (
                            <div className='col-lg-4'>
                                <label className='mb-2'>Campus <span className='text-danger'>*</span></label>
                                <Controller
                                    name="campus"
                                    control={control}
                                    render={({ field }) => (
                                        <select {...field} className='form-select'>
                                            <option value="">Select</option>
                                            {campuses.map(campus => (
                                                <option key={campus?.id} value={campus?.id}>{campus?.campus_code ? campus?.campus_code : ""} - {campus?.name ? campus?.name : ''}</option>
                                            ))}
                                        </select>
                                    )}
                                />
                                <span className='text-danger'>{errors.campus?.message}</span>
                            </div>
                        )}
                    </div>
                    {watchCorporateGroup && watchRegion && watchCampus && (
                        <>
                            <div className='row p-2'>
                                <div className='col-lg-4 mt-3'>
                                    <label>School Code <span className='text-danger'>*</span></label>
                                    <Controller
                                        name="schoolCode"
                                        control={control}
                                        render={({ field }) => <input {...field} type='text' className='form-control' />}
                                    />
                                    <span className='text-danger'>{errors.schoolCode?.message}</span>
                                </div>

                                <div className='col-lg-4 mt-3'>
                                    <label>School Name <span className='text-danger'>*</span></label>
                                    <Controller
                                        name="schoolName"
                                        control={control}
                                        render={({ field }) => <input {...field} type='text' className='form-control' />}
                                    />
                                    <span className='text-danger'>{errors.schoolName?.message}</span>
                                </div>

                                <div className='col-lg-4 mt-3'>
                                    <label>Type <span className='text-danger'>*</span></label>
                                    <Controller
                                        name="type"
                                        control={control}
                                        render={({ field }) => (
                                            <select {...field} className='form-select'>
                                                <option value="">Select Type</option>
                                                {
                                                    types?.map(type => <option key={type?.id} value={type?.id}>{type?.name}</option>)
                                                }
                                            </select>
                                        )}
                                    />
                                    <span className='text-danger'>{errors.type?.message}</span>
                                </div>

                                <div className='col-lg-4 mt-3'>
                                    <label>Phone Number <span className='text-danger'>*</span></label>
                                    <PhoneInput
                                        country={editMethod ? "" : 'in'}
                                        value={String(phoneNumber?.value || '')}
                                        onChange={(phone, country) => handlePhoneInput(phone, country)}
                                    />
                                    <span className='text-danger'>{phoneNumber?.isValid ? '' : 'Invalid Phone Number'}</span>
                                </div>

                                <div className='col-lg-4 mt-3'>
                                    <label>Email <span className='text-danger'>*</span></label>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => <input {...field} type='text' className='form-control' />}
                                    />
                                    <span className='text-danger'>{errors.email?.message}</span>
                                </div>

                                {
                                    editMethod ? "":
                                    <>
                                    <div className='col-lg-4 mt-3'>
                                    <label>Mail Password <span className='text-danger'>*</span></label>
                                    <Controller
                                        name="mailPassword"
                                        control={control}
                                        render={({ field }) => <input {...field} type='text' className='form-control' />}
                                    />
                                    <span className='text-danger'>{errors.mailPassword?.message}</span>
                                </div>
                                <div className='col-lg-4 mt-3'>
                                    <label>Confirm Password <span className='text-danger'>*</span></label>
                                    <Controller
                                        name="confirmPassword"
                                        control={control}
                                        render={({ field }) => <input {...field} type='text' className='form-control' />}
                                    />
                                    <span className='text-danger'>{errors.confirmPassword?.message}</span>
                                </div>
                                </>
                                }
                                <div className='col-lg-4 mt-3'>
                                    <label>License <span className='text-danger'>*</span></label>
                                    <Controller
                                        name="license"
                                        control={control}
                                        render={({ field }) => <input {...field} type='text' className='form-control' />}
                                    />
                                    <span className='text-danger'>{errors.license?.message}</span>
                                </div>

                                <div className='col-lg-4 mt-3'>
                                    <label>Sender ID</label>
                                    <Controller
                                        name="senderId"
                                        control={control}
                                        render={({ field }) => <input {...field} type='text' className='form-control' />}
                                    />
                                </div>
                            </div>
                            {
                                formFields?.length < 3 ?
                                    <button type="button" className="btn add mt-3" onClick={handleAddFields}>Add Client</button>
                                    : null
                            }
                        </>
                    )}

                    {(watchCorporateGroup && watchRegion && watchCampus) && formFields.map((formField, index) => (
                        <>
                            <div className='row' key={index}>
                                <div className='col-lg-4 mt-3'>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Name"
                                        value={formField.name}
                                        onChange={event => handleChange(index, event)}
                                    />
                                    <span className='text-danger'>{formFieldsErr[index]?.nameErr}</span>
                                </div>
                                <div className='col-lg-4 mt-3'>
                                    <input
                                        type="text"
                                        name="designation"
                                        className="form-control"
                                        placeholder="Designation"
                                        value={formField.designation}
                                        onChange={event => handleChange(index, event)}
                                    />
                                    <span className='text-danger'>{formFieldsErr[index]?.designationErr}</span>
                                </div>
                                <div className='col-lg-4 mt-3'>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Email"
                                        value={formField.email}
                                        onChange={event => handleChange(index, event)}
                                    />
                                    <span className='text-danger'>{formFieldsErr[index]?.emailErr}</span>
                                </div>
                                <div className='col-lg-4 mt-3'>
                                    <PhoneInput
                                        country={formField?.phone ?"":'in'}
                                        value={String(formField.phone || '')}
                                        onChange={value => handlePhoneChange(index, value)}
                                    />
                                    <span className='text-danger'>{formFieldsErr[index]?.phoneErr}</span>
                                </div>
                                <div className='d-flex justify-content-end align-items-center'>
                                    <button type="button" className="btn add mt-3" onClick={() => handleRemoveFields(index)}>Remove</button>
                                </div>
                            </div>
                        </>
                    ))}
                    <div className='d-flex justify-content-end align-items-center'>
                        <button type="submit" className="btn add mt-3">Submit</button>
                    </div>
                </form>
            </div>
        </div></div>
    )
}

export default AddSchoolAccount