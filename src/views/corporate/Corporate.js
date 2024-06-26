import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import Swal from 'sweetalert2';
import CorporateUser from './CorporateUser';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { getAPI, addUpdateAPI, deleteAPI } from '../../apiService/ApiService';
import { activeStatus, tableStyle } from '../../utils/Utils';
import '../../index.css';
function Corporate() {
  const [selectedTab, setSelectedTab] = useState('corporate')
  const [corporateList, setCorporateList] = useState()
  const [userList, setUserList] = useState()
  const [selectedCorporate, setSelectedCorporate] = useState()
  const [mode, setMode] = useState('add')
  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [regionList, setRegionList] = useState()
  const { control, register, formState: { errors }, reset, handleSubmit, setValue, getValues, clearErrors } = useForm();
  const mainContainerRef = useRef(null);
  const offcanvasRef = useRef(null);

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

  useEffect(() => {
    getUserList()
    if (selectedTab === 'corporate') {
      document.getElementById("corporatetab").classList.add("active")
      document.getElementById("usertab").classList.remove("active")
    } else {
      document.getElementById("corporatetab").classList.remove("active")
      document.getElementById("usertab").classList.add("active")
    }
    // eslint-disable-next-line
  }, [selectedTab, corporateList])

  useEffect(() => {
    getCorporateList()
    // eslint-disable-next-line
  }, [limit, skip])

  const getCorporateList = () => {
    var url = `/corporate/?skip=${skip}&limit=${limit}`
    getAPI(url).then((response) => {
      setCorporateList(response?.data?.data)
      setTotal(response?.data?.total_count)
    }).catch((error) => {
      console.log(error);
    })

  }

  const getUserList = () => {
    var url = `/corporate/corporateusers`
    getAPI(url).then((response) => {

      var data = response?.data?.data?.admin
      var list = data?.map((item) => ({ value: item?.id, label: item?.name }))
      setUserList(list)

    }).catch((error) => {
      console.log(error);
    })
  }
  const addCorporate = (data) => {
    const values = {
      "region_id": Number(data?.region),
      "corporate_group_code": data?.corporate_group_code,
      "name": data?.name,
      "address": data?.address,
      "city": data?.city,
      "district": data?.district,
      "state": data?.state,
      "pincode": data?.pincode,
      "admin_id": {
        "user_id": data?.admin_id?.value
      },
      "active": true
    }

    var method
    var url

    if (mode === 'add') {
      method = "POST"
      url = `/corporate/`
    }
    else {
      method = "PUT"
      url = `/corporate/` + data?.id
    }

    addUpdateAPI(method, url, values).then((response) => {
      if (response?.data?.status) {
        getCorporateList()
        clearModal()
        document.getElementById('modalClose').click()
        Swal.fire({
          toast: true,
          position: "center",
          icon: "success",
          title: mode === 'add' ? "Corporate added successfully" : "Corporate updated successfully",
          showConfirmButton: false,
          timer: 1500
        });

      } else {
        Swal.fire({
          toast: true,
          position: "center",
          icon: "error",
          title: response?.data?.detail,
          showConfirmButton: false,
          timer: 1500
        });
      }

    }).catch((error) => {
      console.log(error)
    })
  }

  const getEditCorporate = (data) => {
    setMode('edit')
    getRegionList()
    var url = `/corporate/corporatebyid/?corporate_id=${data?.id}`
    getAPI(url).then((response) => {
      var data = response?.data?.data
      reset({ ...data, region: response?.data?.data?.region_id, admin_id: { value: data?.admin_id?.user_id, label: data?.admin_id?.name }, })

    }).catch((error) => {
      console.log(error)
    })
  }

  const deleteCorporate = (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success btn-sm",
        cancelButton: "btn btn-danger me-2 btn-sm"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this corporate!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      heightAuto: false,
      width: 400
    }).then((result) => {
      if (result.isConfirmed) {
        var url = `/corporate/${id}`
        deleteAPI(url).then((response) => {

          if (response?.data?.status) {
            Swal.fire({
              toast: true,
              position: "center",
              icon: "success",
              title: "Corporate deleted successfully",
              showConfirmButton: false,
              timer: 1500
            });
            getCorporateList()
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
    })

  }
  const handleViewCorporate = (row) => {
    getAPI(`/corporate/corporatebyid?corporate_id=${row?.id}`).then((response) => {
      setSelectedCorporate(response?.data?.data)
    })
  }
  const columns = [
    {
      width: '100px',
      name: '#',
      selector: (row, index) => index + 1
    },
    {
      name: 'Corporate Group Code (CG)',
      selector: row => row?.corporate_group_code,
    },
    {
      name: 'Name',
      selector: row => row?.name,
    },
    {
      name: 'City',
      selector: row => row?.city,
    },
    {
      name: 'Active Status',
      selector: row => row.active,
      cell: row => activeStatus(row.active),
      sortable: true,
    },

    {
      name: 'Actions',
      selector: row => row.status,
      cell: row =>
        <div className='d-flex'>
          <button className='btn text-primary btn-sm me-2' title='View' onClick={() => handleViewCorporate(row)} data-bs-toggle="modal" data-bs-target="#viewRegionModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
            </svg>
          </button>
          <button className='btn text-primary btn-sm me-2' title='Edit' onClick={() => [getEditCorporate(row), setMode('edit')]} data-bs-toggle="modal" data-bs-target="#addRegionModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
            </svg>
          </button>
          <button className='btn deletebtn btn-sm me-2' title='Delete' onClick={() => deleteCorporate(row?.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
            </svg>
          </button>
        </div>

    },
  ];

  const handleChange = (selectedOptions) => {
    if (selectedOptions) {
      if (mode === 'edit') {
        var oldAdmin = getValues('admin_id');
        var newAdminList = userList.filter((item) => item.value !== selectedOptions?.value);
        setUserList([...newAdminList, oldAdmin]);
        setValue("admin_id", selectedOptions);

      } else {
        setValue("admin_id", selectedOptions);
      }
      clearErrors("admin_id");
    }
  }

  const clearModal = () => {
    reset({
      "corporate_group_code": '',
      "name": '',
      "address": '',
      "city": '',
      "district": '',
      "state": '',
      "pincode": '',
      "admin_id": '',
      "region": ''
    })
  }

  const handlePerRowsChange = (newPerPage, page) => {
    setLimit(newPerPage);

  }
  const handlePageChange = (currentpage) => {
    setSkip((currentpage - 1) * limit)
  }
  const searchCorporate = (e) => {
    var url = `/corporate/search/?value=${e?.target?.value}&skip=${skip}&limit=${limit}`
    getAPI(url).then((response) => {
      setCorporateList(response?.data?.data)
    }).catch((error) => {
      console.log(error)
    })
  }
  const getRegionList = () => {
    getAPI('/region/activeregions/').then((response) => {
      var arr = []
      response?.data?.data?.map((item) => {
        arr?.push({ name: `${item?.code} - ${item?.name}`, value: item?.id })
      })
      setRegionList(arr)
    })
  }
  const handleAddCorporate = () => {
    setMode('add')
    getRegionList()
  }
  return (
    <>
      <div  ref={mainContainerRef} className='mt-2 canvas_close'>
        <small className='text-muted'>Home / System admin / <span className='text-primary'>Corporate</span></small>
        <div className='container-fluid p-0'>
          <h6 className='title fw-bold mt-1'>Corporate</h6>
        </div>
        <div className='container-fluid card mb-5 container-card'>
          <ul className="nav nav-tabs" >
            <li className="nav-item " id="corporatetab" onClick={() => setSelectedTab('corporate')}>
              <span className="nav-link " aria-current="page" role='button'>Corporate</span>
            </li>
            <li className="nav-item" id="usertab" onClick={() => setSelectedTab('user')}>
              <span className="nav-link" role='button'>User</span>
            </li>
          </ul>

          {selectedTab === 'corporate' &&
            <section id='regiontbl'>
              <div className='d-flex justify-content-between align-items-end mt-1 p-0'>
                <div className=''>
                  <input type="text" className='form-control me-2 tab_search' placeholder='Search' onChange={(e) => searchCorporate(e)} />
                </div>
                <div>
                  <button className='btn btn-sm add px-2'  data-bs-toggle="offcanvas" data-bs-target="#AddCorporate" aria-controls="offcanvasRight" onClick={() => handleAddCorporate()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
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
                  data={corporateList}
                  paginationTotalRows={total}
                  paginationServer
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                />
              </div>
            </section>}

          {selectedTab === 'user' &&
            <section id='user'>
              <CorporateUser activeTab={selectedTab} />
            </section>}

        </div>

        <div className="modal fade" id="viewRegionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">View Corporate</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {/* <div className="row mb-3">
                <div className="col-sm-4 fw-bold">Region:</div>
                <div className="col-sm-8">{`${selectedCorporate?.region?.code ? selectedCorporate?.region?.code : ""}${selectedCorporate?.region?.code ? ' - ' : ''}${selectedCorporate?.region?.name ? selectedCorporate?.region?.name : ''}`}</div>
              </div> */}
                <div className="row mb-3">
                  <div className="col-sm-4 fw-bold">Corporate Group Code (CG):</div>
                  <div className="col-sm-8">{selectedCorporate?.corporate_group_code ? selectedCorporate?.corporate_group_code : '-'}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 fw-bold">Name:</div>
                  <div className="col-sm-8">{selectedCorporate?.name ? selectedCorporate?.name : '-'}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 fw-bold">Address:</div>
                  <div className="col-sm-8">{selectedCorporate?.address ? selectedCorporate?.address : '-'}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 fw-bold">City:</div>
                  <div className="col-sm-8">{selectedCorporate?.city ? selectedCorporate?.city : '-'}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 fw-bold">District:</div>
                  <div className="col-sm-8">{selectedCorporate?.district ? selectedCorporate?.district : '-'}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 fw-bold">Pincode:</div>
                  <div className="col-sm-8">{selectedCorporate?.pincode ? selectedCorporate?.pincode : "-"}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-4 fw-bold">State:</div>
                  <div className="col-sm-8">{selectedCorporate?.state ? selectedCorporate?.state : '-'}</div>
                </div>
                {/* <div className="row mb-3">
                <div className="col-sm-4 fw-bold">Corporate Admin:</div>
                <div className="col-sm-8">{selectedCorporate?.admin_id?.name ? selectedCorporate?.admin_id?.name : '-'}</div>
              </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* <div className="modal fade" id="addRegionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">{mode === 'edit' ? 'Edit Corporate' : 'Add Corporate'}</h1>
                <button type="button" id='modalClose' className="btn-close" onClick={() => clearModal()} data-bs-dismiss="modal" aria-label="Close"></button>
              </div>


            </div>
          </div>
        </div> */}

        <div ref={offcanvasRef} class="offcanvas offcanvas-end " tabindex="-1" id="AddCorporate" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 id="offcanvasRightLabel">{mode === 'edit' ? 'Edit Corporate' : 'Add Corporate'}</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body pt-0">
            <form onSubmit={handleSubmit(addCorporate)}>
              <div className="modal-body">
                <div className="row">
                  {/* <div className="col-lg-6">
                    <label className="mt-2">Region <span className="text-danger">*</span></label>
                    <select className="form-select" {...register('region', { required: true })}>
                      <option value="">Select Region</option>
                      {regionList?.map((item, index) => (
                        <option key={index} value={item?.value}>{item?.name}</option>
                      ))}
                    </select>
                    {errors?.region && <span className="text-danger">Region is required</span>}
                  </div> */}
                </div>
                <div className="row mt-2">
                  <div className="col-lg-12">
                    <label className="mt-2">Corporate Group Code (CG) <span className="text-danger">*</span></label>
                    <input className="form-control" placeholder='Corporate Group Code' {...register('corporate_group_code', { required: true })} />
                    {errors?.corporate_group_code && <span className="text-danger">Corporate Group Code is required</span>}
                  </div>
                  <div className="col-lg-12">
                    <label className="mt-2">Name <span className="text-danger">*</span></label>
                    <input className="form-control" placeholder='Name' {...register('name', { required: true })} />
                    {errors.name && <span className="text-danger">Name is required</span>}
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <label className="mt-2">Address <span className="text-danger">*</span></label>
                    <input className="form-control" placeholder='Address' {...register('address', { required: true })} />
                    {errors.address && <span className="text-danger">Address is required</span>}
                  </div>
                  <div className="col-lg-12">
                    <label className="mt-2">City <span className="text-danger">*</span></label>
                    <input className="form-control" placeholder='City' {...register('city', { required: true })} />
                    {errors.city && <span className="text-danger">City is required</span>}
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <label className="mt-2">District <span className="text-danger">*</span></label>
                    <input className="form-control" placeholder='District' {...register('district', { required: true })} />
                    {errors.district && <span className="text-danger">Name is required</span>}
                  </div>
                  <div className="col-lg-12">
                    <label className="mt-2">Pincode <span className="text-danger">*</span></label>
                    <input
                      className="form-control" placeholder='Pincode'
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
                  <div className="col-lg-12">
                    <label className="mt-2">State <span className="text-danger">*</span></label>
                    <input className="form-control" placeholder='State' {...register('state', { required: true })} />
                    {errors.state && <span className="text-danger">State is required</span>}
                  </div>
                  {/* <div className="col">
                    <label className="mt-2">Admin <span className="text-danger">*</span></label>
                    <Controller
                      name="admin_id"
                      control={control}
                      defaultValue=""
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={userList}
                          isClearable
                          onChange={(selectedOptions) => {
                            handleChange(selectedOptions);

                          }}
                        />
                      )}
                    />
                    {errors?.admin_id && <span className="text-danger">Admin is required</span>}
                  </div> */}
                </div>
              </div>
              <div className="modal-footer mt-3">
                <button type="button" onClick={() => clearModal()} className="btn btn-danger btn-sm" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn  btn-sm btn-success ms-2">Save</button>
              </div>
            </form>
          </div>
        </div>
        
      </div>
    </>
  )
}

export default Corporate