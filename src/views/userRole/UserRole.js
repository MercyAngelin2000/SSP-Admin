import React, { useContext, useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component'
import { activeStatus, tableStyle, setSessionStorageItem,setSidebar, closeSidebar } from '../../utils/Utils';
import { inputContext } from '../../layout/DefaultLayout';
import "../../index.css"
import "../region/Region.css"
import { getAPI ,addUpdateAPI,deleteAPI} from '../../apiService/ApiService';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
function UserRole() {
  const [userRoleList, setUserRoleList] = useState([])
  const [scopeList, setScopeList] = useState([]);
  const [count, setCount] = useState(0);
  const [title, setTitle] = useState("Add User Role");
  const [editData, setEditData] = useState()
  const [mode, setMode] = useState('add')
  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const inputContextObj = useContext(inputContext);
  const mainContainerRef = useRef(null);
  const offcanvasRef = useRef(null);

  // const {  register:regionRegister,handleSubmit:regionHandleSubmit,formState: { errors: regionErrors }, reset:regionReset, setValue:regionSetValue } = useForm();
  
  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    description: yup.string(),
    module_id: yup.string().required('Module is required'),
});

const { register, formState: { errors }, handleSubmit, reset ,getValues} = useForm({resolver: yupResolver(schema)});


  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.attributeName === 'class') {
          if (offcanvasRef.current.classList.contains('show')) {
            mainContainerRef.current.classList.add('canvas_open');
            mainContainerRef.current.classList.remove('canvas_close');
          } else {
            mainContainerRef.current.classList.remove('canvas_open');
            mainContainerRef.current.classList.add('canvas_close');
          }
        }
      }
    });

    if (offcanvasRef.current) {
      observer.observe(offcanvasRef.current, { attributes: true });
    }

    return () => {
      observer.disconnect();
    };
  }, []);


  const getRoles = ()=>{
    getAPI(`/users/roles?skip=${skip}&limit=${limit}`).then((res) => {
      if (res.data?.status) {
        console.log("data",res.data);
        setUserRoleList(res?.data?.data)
        setCount(res?.data?.total_count)
        // setUserRoleList([{},{}])
      }
    })
  }
  const getScopeList = () => {
    getAPI("/users/modules").then((res) => {
      if(res.data?.status){
        setScopeList(res.data?.data);
        console.log("scope",res.data?.data);
      }
      
    })
  }
  useEffect(() => {
    getRoles();
  }, [skip,limit]);

  const columns = [
    {
      width: '100px',
      name: '#',
      selector: (row, index) => index + 1
    },
    {
      name: 'Name',
      selector: row => row.name,
    },
    {
      name: 'Description',
      selector: row => row.description,
    },
    {
      name: 'Applicable Scope',
      selector: row => row.scope[0]?.module?.name,
    },
    // {
    //   name: 'Active Status',
    //   selector: row => row.active,
    //   cell: row => activeStatus(row.active),
    //   sortable: true,
    // },
    {
      name: 'Actions',
      selector: row => row.status,
      cell: row =>
        <div className='d-flex'>
          <button className='btn text-primary btn-sm me-2' onClick={() => handleEdit(row)} data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
            </svg>
          </button>
          <button className='deletebtn btn  btn-sm me-2' onClick={() => handleDelete(row)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
            </svg>
          </button>
        </div>

    },
  ];

  const handlePerRowsChange = (newPerPage, page) => {
    console.log("newPerPage",newPerPage);
    setLimit(newPerPage);

  }
  const handlePageChange = (currentpage) => {
    console.log("currentpage",currentpage);
    setSkip((currentpage - 1) * limit)
  }

  const handleAddAPI = (data) => {
    console.log("add api",data);
    
        var method;
        var url;
        var postData;
        if (title === "Add User Role") {
            method = "POST"
            url = `/users/roles`
            postData = {
                'name': data?.name,
                "description": data?.description,
                "applicable_scope":{
                  "module_id":[data?.module_id]
                }
                
            }
        }
        else {
            method = "PUT"
            url = `/users/roles/${editData?.id}`
            postData = {
              'name': data?.name,
              "description": data?.description,
              "applicable_scope":{
                "module_id":[data?.module_id]
              }
              
          }
        }
        addUpdateAPI(method, url, postData).then((response) => {
            let data = response?.data
            if (data?.status) {
                handleClose()
                document.getElementById("closebtn").click()
                getRoles()
                Swal.fire({
                    toast: true,
                    position: "center",
                    icon: "success",
                    title: title === "Add User Role" ? "User Role added successfully" : "User Role updated successfully",
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
  const handleAdd = () => {
    getScopeList();
    setTitle("Add User Role")

    // setMode('add')
    // setSessionStorageItem('inputBar', true);
    // inputContextObj?.setInputObj({ from: "userRole", })
  }

  const handleEdit = (row)=>{
    setEditData(row)
    getScopeList();
    setTitle("Edit User Role")
    reset({
      name: row?.name,
      description: row?.description,
      module_id: row.scope[0]?.module_id
  })
  }

  const handleDelete = (row)=>{
    console.log("delete",row);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
          confirmButton: "btn btn-success btn-sm",
          cancelButton: "btn btn-danger me-2 btn-sm"
      },
      buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this user role!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      heightAuto: false,
      width: 400
  }).then((result) => {
      if (result.isConfirmed) {
          var url = `/users/roles/${row?.id}`
          deleteAPI(url).then((response) => {
              let data = response?.data
              if (data?.status) {
                getRoles()
                  Swal.fire({
                      toast: true,
                      position: "center",
                      icon: "success",
                      title: "User Role deleted successfully",
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


  const handleClose = ()=>{
    setEditData()
    reset({
      name: "",
      description: "",
      module_id: ""
  })
  }

  const searchUserRole = (e)=>{
    console.log("e?.target?.value",e?.target?.value);
    var url = `/users/roles/search?value=${e?.target?.value}&skip=${skip}&limit=${limit}`
        getAPI(url).then((res) => {
          if (res.data?.status) {
            console.log("data",res.data.data);
            setUserRoleList(res?.data?.data)
            setCount(res?.data?.total_count)
            // setUserRoleList([{},{}])
          }
        }).catch((error) => {
          console.log(error)
        })
  }

  return (
    <>
      <div ref={mainContainerRef} className='mt-2 canvas_close'>
        <small className='text-gray'>Home / <span className='text-primary'>User Role</span></small>
        <div className='container-fluid p-0 mt-3'>
          {/* <h6 className='title fw-bold mt-1'>Region</h6> */}
        </div>
        <div className='container-fluid card mb-5 container-card '>
          {/* <ul className="nav nav-tabs" >
                        <li className="nav-item " id="regiontab" >
                            <span className="nav-link" aria-current="page" role='button'>Region</span>
                        </li>
                        <li className="nav-item" id="usertab" >
                            <span className="nav-link" role='button'>User</span>
                        </li>
                    </ul> */}


          <section id='regiontbl'>
            <div className='d-flex justify-content-between align-items-end mt-1 p-0'>
              <div>
                {/*  onChange={(e) => searchRegion(e)} */}
                <input type="text" className='form-control me-2 tab_search' placeholder='Search' onChange={(e) => searchUserRole(e)}/>
              </div>
              <div>
                <button className='btn btn-sm add px-2' onClick={() => (closeSidebar(),handleAdd())} title='Add User Role'  data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg></button>
              </div>
            </div>
            <div className='card my-3 tablecard'>
              <DataTable
                pagination
                customStyles={tableStyle}
                columns={columns}
                data={userRoleList}
                paginationTotalRows={total}
                paginationServer
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
              />
            </div>
          </section>


        </div>

      </div>

      <div ref={offcanvasRef} class="offcanvas offcanvas-end " tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
          <h5 id="offcanvasRightLabel">{title}</h5>
          <button type="button" class="btn-close text-reset" id='closebtn' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{handleClose()}}></button>
        </div>
        <div class="offcanvas-body">
          <form autoComplete='off' style={{ fontSize: '12px' }} onSubmit={handleSubmit(handleAddAPI)}>

            <div className='mt-4'>
              <div className='form-group'>
                <label className='mt-2'>Role Name <span className='text-danger'>*</span></label>
                <input className='form-control' placeholder='Role Name' {...register('name', { required: true })}/>
                {errors.name && <span className='text-danger'>Name is required</span>}

              </div>
              <div className='form-group'>
                <label className='mt-2'>Role Description <span className='text-danger'></span></label>
                <textarea className='form-control' rows={2} placeholder='Role Description' {...register('description')}/>

              </div>
              <div className='form-group'>
                <label className='mt-2'>Applicable Scope <span className='text-danger'>*</span></label>
                <select className='form-select' {...register('module_id')}>
                  <option value="">-- Select Applicable Scope --</option>
                  {
                  scopeList?.map((item, index) => {
                    return <option key={index} value={item?.id} selected={item?.id === getValues('module_id') ? true : false}>{item?.name}</option>
                  })
                }

                </select>
                {errors.module_id && <span className='text-danger'>{errors.module_id.message}</span>}

              </div>

              <div className='d-flex justify-content-end mt-3'>
                <div className='mr-2'>
                  <button type="button" data-bs-dismiss="offcanvas" aria-label="Close" style={{ marginRight: "10px", backgroundColor: "#e54e60" }} className="btn btn-sm text-white" onClick={()=>{handleClose()}}>Cancel</button>
                </div>
                <div className='ml-2'>
                  <button type="submit" className="btn  btn-sm btn-success">Save</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default UserRole
