import React, { useContext, useEffect } from 'react';
import './InputForms.css';
import { inputContext } from '../layout/DefaultLayout';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller } from 'react-hook-form';
import Select from 'react-select';

function InputForms({ handleClose }) {
  const { inputObj, setInputObj } = useContext(inputContext);
  const { from, roleData, schema, schema1, onSubmit, title, editData, handleCancel, adminList, handleAdminList, memberList, adminSelected, memberSelected } = inputObj || {};
  const { control, register, handleSubmit, formState: { errors }, reset, setValue } = useForm(from === "RegionUser" ? {
    resolver: yupResolver(title === "Add User" ? schema : schema1),
  } : '');
  useEffect(() => {
    if (from === "RegionUser") {
      reset({
        name: editData?.name,
        username: editData?.username,
        role: editData?.role_id,
      })
    }
    else if (from === "Region") {
      if(editData){
        setValue("admin", adminSelected)
        setValue("member", memberSelected)
        reset({
          code: editData?.code,
          id: editData?.id,
          name: editData?.name,
          admin: adminSelected,
          member: memberSelected
        })
      }else{
        reset({ code: '', name: '', admin: '', member: '' })
      }
    }
  }, [inputObj])
  const handleCancelBtn = () => {
    handleCancel()
    handleClose()
    setInputObj({})
    if (from === "RegionUser") {
      reset({
        name: "",
        username: "",
        password: "",
        role: "",
        confirmPassword: ""
      })
    } else if (from === "Region") {
      reset({ code: '', name: '', admin: '', member: '' })
    }
  }

  const loadForm = (type) => {
    if (type === "RegionUser") {
      return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' style={{ fontSize: '12px' }}>
          <div>
            <div>
              <label htmlFor="name">Name<span className='text-danger'>*</span></label>
              <input id="name" className='form-control' {...register('name')} />
              {errors?.name?.message && <span className='text-danger'>{errors?.name?.message}</span>}
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
                <option value="" style={{ fontSize: '12px' }}>Select Role</option>
                {
                  roleData?.map((item, index) => {
                    return <option key={index} value={item?.id} selected={item?.id === editData?.role_id ? true : false}>{item?.name}</option>
                  })
                }
              </select>
              {errors.role && <span className='text-danger'>{errors.role.message}</span>}
            </div>

          </div>
          <div className='d-flex justify-content-end mt-4'>
            <div className='mr-2'>
              <button type="button" className="btn btn-sm text-white" style={{ marginRight: "10px", backgroundColor: "#e54e60" }} title='Cancel' onClick={() => handleCancelBtn()}>Cancel</button>
            </div>
            <div className='ml-2'>
              <button type="submit" className="btn  btn-sm btn-success">{title === "Add User" ? "Save" : "Update"}</button>
            </div>
          </div>
        </form>
      )
    }
    else if (type === "Region") {
      return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' style={{ fontSize: '12px' }}>
          <div>
            <div>
              <label className='mt-2'>Code <span className='text-danger'>*</span></label>
              <input className='form-control' {...register('code', { required: true })} />
              {errors.code && <span className='text-danger'>Code is required</span>}
            </div>
            <div>
              <label className='mt-2'>Name <span className='text-danger'>*</span></label>
              <input className='form-control' {...register('name', { required: true })} />
              {errors.name && <span className='text-danger'>Name is required</span>}
            </div>
            <div>
              <label className='mt-2'>Admin <span className='text-danger'>*</span></label>
              <Controller
                name="admin"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={adminList}
                    isClearable
                    onChange={(selectedOptions) => {
                      handleAdminList(selectedOptions, 'admin');
                    }}
                    isMulti={false}
                  />
                )}
              />
              {errors.admin && <span className='text-danger'>Admin is required</span>}
            </div>
            <div>
              <label className='mt-2'>Member</label>
              <Controller
                name="member"
                control={control}
                defaultValue={[]}
                rules={{}}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={memberList}
                    isMulti
                    isClearable
                    onChange={(selectedOptions) => {
                      handleAdminList(selectedOptions, 'member');
                    }}
                  />
                )}
              />

            </div>
          </div>
          <div className='d-flex justify-content-end mt-4'>
            <div className='mr-2'>
              <button type="button" onClick={() => handleCancelBtn()} style={{ marginRight: "10px", backgroundColor: "#e54e60" }} className="btn btn-sm text-white" >Cancel</button>
            </div>
            <div className='ml-2'>
              <button type="submit" className="btn  btn-sm btn-success">Save</button>
            </div>
          </div>
        </form>
      )
    }
  }
  const handleCloseBtn = () => {
    handleClose()
    setInputObj({})
  }
  return (
    <>
      <div className="input_forms p-5">
        {
            <>
              <div className='d-flex justify-content-between align-items-center border-bottom mb-4'>
                <div className="p-3" role='button' title='Close' onClick={handleCloseBtn}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg text-danger" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                  </svg>
                </div>
                <div className="small">{title}</div>
                <div>
                  <span className='p-2 text-primary' title='Back to home' role='button' onClick={handleCloseBtn}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                  </svg></span>
                </div>
              </div>
              {/* <div className="p-3" role='button' title='Close' onClick={handleClose}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
              </div> */}
              {loadForm(from)}
            </>
        }
      </div>
    </>
  )
}

export default InputForms