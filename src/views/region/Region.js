import React, { useEffect, useState ,useContext} from 'react'
import "../../index.css"
import "./Region.css"
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import RegionUser from './RegionUser';
import { useForm } from 'react-hook-form';
import { getAPI, addUpdateAPI, deleteAPI } from '../../apiService/ApiService';
import { activeStatus, tableStyle ,setSessionStorageItem } from '../../utils/Utils';
import {inputContext} from '../../layout/DefaultLayout';

function Region() {
  const [selectedTab, setSelectedTab] = useState('region')
  const [regionList, setRegionList] = useState()
  const [adminList, setAdminList] = useState()
  const [memberList, setMemberList] = useState()
  const [mode, setMode] = useState('add')
  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const inputContextObj= useContext(inputContext);
  const { control, register, formState: { errors: formErrors }, reset, handleSubmit, setValue, getValues } = useForm();
  const [editData,setEditData]=useState();

  useEffect(() => {
    getUserList()
    if (selectedTab === 'region') {
      inputContextObj?.setInputObj({})
      setSessionStorageItem('inputBar',false);
      document.getElementById("regiontab").classList.add("active")
      document.getElementById("usertab").classList.remove("active")
    } else {
      inputContextObj?.setInputObj({})
      setSessionStorageItem('inputBar',false);
      document.getElementById("regiontab").classList.remove("active")
      document.getElementById("usertab").classList.add("active")
    }
    // eslint-disable-next-line
  }, [selectedTab, regionList])

  useEffect(() => {
    getRegionList()
    // eslint-disable-next-line
  }, [limit, skip])

  const getRegionList = () => {
    var url = `/region/?skip=${skip}&limit=${limit}`
    getAPI(url).then((response) => {
      setRegionList(response?.data?.data)
      setTotal(response?.data?.total_count)
    }).catch((error) => {
      console.log(error);
    })

  }

  const getUserList = () => {
    var url = `/region/regionusers`
    getAPI(url).then((response) => {

      var data = response?.data?.data?.members
      const members = data?.map((item) => (
        { value: item.id, label: item.name })
      );
      setMemberList(members)

      var value = response?.data?.data?.admin
      const admins = value?.map((item) => (
        { value: item.id, label: item.name })
      );
      setAdminList(admins)

    }).catch((error) => {
      console.log(error);
    })
  }

  const addRegion = (data) => {
    const userids = memberSelectedList && memberSelectedList?.map((item) => ({ user_id: item?.value }));
    const values = {
      "code": data?.code,
      "name": data?.name,
      "admin_id": {
        "user_id": editData?adminSelectedList?.[0]?.value:adminSelectedList?.value
      },
      "member_ids": userids ? userids : [],
      "active": true
    }

    var method
    var url

    if (mode === 'add') {
      method = "POST"
      url = `/region/`
    }
    else {
      method = "PUT"
      url = `/region/` + data?.id
    }

    addUpdateAPI(method, url, values).then((response) => {
      if (response?.data?.status) {
        getRegionList()
        clearModal()
        inputContextObj?.setInputObj({})
        // document.getElementById('modalClose').click()
        Swal.fire({
          toast: true,
          position: "center",
          icon: "success",
          title: mode === 'add' ? "Region added successfully" : "Region updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
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
  const getSingleRegion = (id) => {
    var url = `/region/regionbyid/?region_id=${id}`
    getAPI(url).then((response) => {
      var data = response?.data?.data
      setEditData(data)
      setAdminSelectedList([{ value: data?.admin_id?.user_id, label: data?.admin_id?.name }])
      setMemberSelectedList(data?.member_ids?.map((item) => ({ value: item.user_id, label: item.name })))
      // reset({
      //   code: data?.code,
      //   id: data?.id,
      //   name: data?.name,
      //   admin: { value: data?.admin_id?.user_id, label: data?.admin_id?.name },
      //   member: data?.member_ids?.map((item) => (
      //     { value: item.user_id, label: item.name })
      //   )
      // })

    }).catch((error) => {
      console.log(error)
    })
  }

  const deleteRegion = (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success btn-sm",
        cancelButton: "btn btn-danger me-2 btn-sm"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this region!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      heightAuto: false,
      width: 400
    }).then((result) => {
      if (result.isConfirmed) {
        var url = `/region/${id}`
        deleteAPI(url).then((response) => {
          if (response?.data?.status) {
            getRegionList()
            Swal.fire({
              toast: true,
              position: "center",
              icon: "success",
              title: "Region deleted successfully",
              showConfirmButton: false,
              timer: 1500
            });
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
    })

  }

  const searchRegion = (e) => {
    var url = `/region/search/?value=${e?.target?.value}&skip=${skip}&limit=${limit}`
    getAPI(url).then((response) => {
      setRegionList(response?.data?.data)
    }).catch((error) => {
      console.log(error)
    })
  }
  const columns = [
    {
      width: '100px',
      name: '#',
      selector: (row, index) => index + 1
    },
    {
      name: 'Code',
      selector: row => row.code,
    },
    {
      name: 'Name',
      selector: row => row.name,
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
          <button className='btn text-primary btn-sm me-2' onClick={() => handleEdit(row)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
            </svg>
          </button>
          <button className='deletebtn btn  btn-sm me-2' onClick={() => deleteRegion(row?.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
            </svg>
          </button>
        </div>

    },
  ];
  const [adminSelectedList,setAdminSelectedList]=useState([])
  const [memberSelectedList,setMemberSelectedList]=useState([])
  const handleChange = (selectedOptions, name) => {
    if (mode === 'edit') {
      if (name === 'admin') {
        var oldAdmin = adminSelectedList
        var newAdminList = adminList.filter((item) => item.value !== selectedOptions?.value);
        setAdminList([...newAdminList, oldAdmin])
        setAdminSelectedList([selectedOptions])
        // setValue("admin", selectedOptions)
      }
      else {
        setMemberSelectedList(selectedOptions)
        var oldMembers = memberSelectedList
        // setValue("member", selectedOptions)
        const dataIds = new Set(selectedOptions.map(dataItem => dataItem.value));
        const missingMembers = oldMembers.filter(member => !dataIds.has(member.value));
        if (missingMembers?.length > 0) {
          var url = `/region/regionusers/${missingMembers[0]?.value}`
          deleteAPI(url).then((response) => {
            getUserList()
          }).catch((error) => {
            console.log(error)
          })
        }
      }
    }
    else {
      if (name === 'admin') {
        setAdminSelectedList(selectedOptions)
      }
      else{
        setMemberSelectedList(selectedOptions)
      }
      // setValue(name, selectedOptions)
    }

  }
  useEffect(() => {
    if(editData){
      inputContextObj?.setInputObj({from:"Region",onSubmit:addRegion,title:mode==="edit"? "Edit Region" : "Add Region",handleCancel:clearModal,adminList:adminList,handleAdminList:handleChange,memberList:memberList,adminSelected:adminSelectedList,memberSelected:memberSelectedList,editData:editData})
    }
    else{
    inputContextObj?.setInputObj({from:"Region",onSubmit:addRegion,title:mode==="edit"? "Edit Region" : "Add Region",handleCancel:clearModal,adminList:adminList,handleAdminList:handleChange,memberList:memberList,adminSelected:adminSelectedList,memberSelected:memberSelectedList})
    }
  },[adminSelectedList,memberSelectedList])
  const clearModal = () => {
    reset({ code: '', name: '', admin: '', member: '' })
    setAdminSelectedList([])
    setMemberSelectedList([])
  }

  const handlePerRowsChange = (newPerPage, page) => {
    setLimit(newPerPage);

  }
  const handlePageChange = (currentpage) => {
    setSkip((currentpage - 1) * limit)
  }
const handleAdd = () => {
  setMode('add')
  setSessionStorageItem('inputBar',true);
  inputContextObj?.setInputObj({from:"Region",onSubmit:addRegion,title:mode==="edit"? "Edit Region" : "Add Region",handleCancel:clearModal,adminList:adminList,handleAdminList:handleChange,memberList:memberList,adminSelected:adminSelectedList,memberSelected:memberSelectedList})
}
useEffect(() => {
  if(editData){
  setSessionStorageItem('inputBar',true);
  inputContextObj?.setInputObj({from:"Region",onSubmit:addRegion,title:mode==="edit"? "Edit Region" : "Add Region",handleCancel:clearModal,adminList:adminList,handleAdminList:handleChange,memberList:memberList,adminSelected:adminSelectedList,memberSelected:memberSelectedList,editData:editData})
}},[editData])
const handleEdit = (data) => {
  getSingleRegion(data?.id) 
  setMode('edit')
}
  return (
    <div className='mt-2'>
       <small className='text-gray'>Home / System admin / <span className='text-primary'>Region</span></small>
      <div className='container-fluid p-0 mt-3'>
        {/* <h6 className='title fw-bold mt-1'>Region</h6> */}
      </div>
      <div className='container-fluid card mb-5 container-card'>
        <ul className="nav nav-tabs" >
          <li className="nav-item " id="regiontab" onClick={() => setSelectedTab('region')}>
            <span className="nav-link" aria-current="page" role='button'>Region</span>
          </li>
          <li className="nav-item" id="usertab" onClick={() => setSelectedTab('user')}>
            <span className="nav-link" role='button'>User</span>
          </li>
        </ul>

        {selectedTab === 'region' &&
          <section id='regiontbl'>
            <div className='d-flex justify-content-between align-items-end mt-1 p-0'>
              <div>
                <input type="text" className='form-control me-2 tab_search' placeholder='Search' onChange={(e) => searchRegion(e)} />
              </div>
              <div>
                <button className='btn btn-sm add px-2' onClick={() => handleAdd()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg></button>
              </div>
            </div>
            <div className='card my-3 tablecard'>
              <DataTable
                pagination
                customStyles={tableStyle}
                columns={columns}
                data={regionList}
                paginationTotalRows={total}
                paginationServer
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
              />
            </div>
          </section>}

        {selectedTab === 'user' &&
          <section id='user'>
            <RegionUser activeTab={selectedTab} />
          </section>}

      </div>
      {/* <div className="modal fade" id="addRegionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">{mode === 'edit' ? 'Edit Region' : 'Add Region'}</h1>
              <button type="button" id='modalClose' className="btn-close" onClick={() => clearModal()} data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit(addRegion)}>
              <div className="modal-body">
                <div>
                  <label className='mt-2'>Code <span className='text-danger'>*</span></label>
                  <input className='form-control' {...register('code', { required: true })} />
                  {formErrors.code && <span className='text-danger'>Code is required</span>}
                </div>
                <div>
                  <label className='mt-2'>Name <span className='text-danger'>*</span></label>
                  <input className='form-control' {...register('name', { required: true })} />
                  {formErrors.name && <span className='text-danger'>Name is required</span>}
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
                          handleChange(selectedOptions, 'admin');
                        }}
                      />
                    )}
                  />
                  {formErrors.admin && <span className='text-danger'>Admin is required</span>}
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
                          handleChange(selectedOptions, 'member');
                        }}
                      />
                    )}
                  />

                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => clearModal()} className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn  btn-sm add">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Region
