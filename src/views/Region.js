import React, { useEffect, useState } from 'react'
import '../App.css'
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';
import RegionUser from './RegionUser';

function Region() {

  const [selectedTab, setSelectedTab] = useState('region')
  const [regionList, setRegionList] = useState()
  const [adminList, setAdminList] = useState()
  const [memberList, setMemberList] = useState()
  const [regionData, setRegionData] = useState({ code: '', name: '' })
  const [selectedAdmin, setSelectedAdmin] = useState()
  const [selectedMember, setSelectedMember] = useState()
  const [mode, setMode] = useState('add')
  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [errors, setErrors] = useState({
    code: '', name: '', admin: ''
  })

  var token = localStorage.getItem("access-token");
  let base_url = process.env.REACT_APP_BASE_URL

  useEffect(() => {
    getUserList()
    if (selectedTab === 'region') {
      document.getElementById("region").classList.add("active")
      document.getElementById("user").classList.remove("active")
    } else {
      document.getElementById("region").classList.remove("active")
      document.getElementById("user").classList.add("active")
    }
  }, [selectedTab, regionList])

  useEffect(() => {
    getRegionList()
  }, [limit, skip])

  const getRegionList = () => {
    axios({
      method: 'GET',
      url: `${base_url}/region/?skip=${skip}&limit=${limit}`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => {
      setRegionList(response?.data?.data)
      setTotal(response?.data?.total_count)
    }).catch((error) => {
      console.log(error);
    })

  }

  const getUserList = () => {
    axios({
      method: 'GET',
      url: `${base_url}/region/regionusers`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => {

      var data = response?.data?.data?.members
      const members = data?.map((item) => (
        { value: item.id, label: item.name })
      );
      setMemberList(members)

      var data = response?.data?.data?.admin
      const admins = data?.map((item) => (
        { value: item.id, label: item.name })
      );
      setAdminList(admins)

    }).catch((error) => {
      console.log(error);
    })
  }

  const addRegion = () => {

    const errors = {};

    if (!regionData?.code) {
      errors.code = 'Code is required';
    }

    if (!regionData?.name) {
      errors.name = 'Name is required';
    }

    if (!selectedAdmin) {
      errors.admin = 'Admin is required';
    }

    setErrors(errors);

    if (regionData?.code && regionData?.name && selectedAdmin) {
      const userids = selectedMember?.map((item) => ({ user_id: item.value }));
      const data = {
        "code": regionData?.code,
        "name": regionData?.name,
        "admin_id": {
          "user_id": selectedAdmin?.value
        },
        "member_ids": userids,
        "active": true
      }

      var method
      var url

      if (mode === 'add') {
        method = "POST"
        url = `${base_url}/region/`
      }
      else {
        method = "PUT"
        url = `${base_url}/region/` + regionData?.id
      }

      axios({
        method: method,
        url: url,
        data: data,
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }).then((response) => {
        getRegionList()
        clearModal()
        document.getElementById('modalClose').click()
        Swal.fire({
          toast: true,
          position: "center",
          icon: "success",
          title: mode === 'add' ? "Region added successfully" : "Region updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  const getSingleRegion = (id) => {
    axios({
      method: 'GET',
      url: `${base_url}/region/regionbyid/?region_id=` + id,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => {
      setRegionData(response?.data?.data)

      var data = response?.data?.data?.admin_id
      const admin = { value: data?.user_id, label: data?.name }
      setSelectedAdmin(admin)

      var record = response?.data?.data?.member_ids
      const members = record?.map((item) => (
        { value: item.user_id, label: item.name })
      );
      setSelectedMember(members)
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
        axios({
          method: 'DELETE',
          url: `${base_url}/region/` + id,
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then((response) => {
          getRegionList()

        }).catch((error) => {
          console.log(error)
        })

      }
    })

  }

  const columns = [
    {
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
      name: 'Actions',
      selector: row => row.status,
      cell: row =>
        <div className='d-flex'>
          <button className='btn text-primary btn-sm me-2' onClick={() => [getSingleRegion(row?.id), setMode('edit')]} data-bs-toggle="modal" data-bs-target="#addRegionModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
            </svg>
          </button>
          <button className='btn text-danger btn-sm me-2' onClick={() => deleteRegion(row?.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
            </svg>
          </button>
          <div className="form-check form-switch mt-2">
            <input className="form-check-input" disabled type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={row?.active} />
            <label className="form-check-label" htmlFor="flexSwitchCheckChecked"></label>
          </div>
        </div>

    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: '501',
        fontSize: '15px',
        color: '#05609c'
      },
    },
    cells: {
      style: {
        fontSize: '15px',

      },
    },
  };

  const handleChange = (data) => {
    if (mode === 'edit') {
      const dataIds = new Set(data.map(dataItem => dataItem.value));
      const missingMembers = selectedMember.filter(member => !dataIds.has(member.value));
      if (missingMembers?.length > 0) {
        axios({
          method: 'DELETE',
          url: `${base_url}/region/regionusers/` + missingMembers[0]?.value,
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then((response) => {
          getUserList()
        }).catch((error) => {
          console.log(error)
        })
      }
    }
    setSelectedMember(data)
  }

  const clearModal = () => {
    setRegionData({ code: '', name: '' });
    setSelectedAdmin(null);
    setSelectedMember([]);
    setErrors({ code: '', name: '', admin: '' })
  }

  const handlePerRowsChange = (newPerPage, page) => {
    console.log("newPerPage", newPerPage, "page", page);
    setLimit(newPerPage);

  }
  const handlePageChange = (currentpage) => {
    console.log("page", currentpage, 'limit', limit, 'skip', skip, 'page', page);
    // setPage(currentpage)
    setSkip((currentpage - 1) * limit)
  }


  return (
    <div>
      <div className='d-flex justify-content-center mt-3'>
        <h4 className='title fw-bold '>Region</h4>

      </div>
      <div className='container card'>
        <ul className="nav nav-tabs" >
          <li className="nav-item " id="region" onClick={() => setSelectedTab('region')}>
            <a className="nav-link " aria-current="page" href="#">Region</a>
          </li>
          <li className="nav-item" id="user" onClick={() => setSelectedTab('user')}>
            <a className="nav-link" href="#">User</a>
          </li>
        </ul>

        {selectedTab === 'region' &&
          <section id='regiontbl'>
            <div className='d-flex justify-content-end mt-3'>
              <button className='btn btn-success' data-bs-toggle="modal" data-bs-target="#addRegionModal" onClick={() => setMode('add')}>Add</button>
            </div>
            <DataTable
              pagination
              customStyles={customStyles}
              columns={columns}
              data={regionList}
              paginationTotalRows={total}
              paginationServer
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
            />
          </section>}

        {selectedTab === 'user' &&
          <section id='user'>
            <RegionUser />
          </section>}

      </div>
      <div className="modal fade" id="addRegionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">{mode === 'edit' ? 'Edit Region' : 'Add Region'}</h1>
              <button type="button" id='modalClose' className="btn-close" onClick={() => clearModal()} data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div>
                <div>
                  <label className='mt-2'>Code <span className='text-danger'>*</span></label>
                  <input className='form-control' value={regionData?.code} defaultValue={regionData?.code} onChange={(e) => setRegionData({ ...regionData, 'code': e.target.value })} />
                  {errors?.code && <span className='text-danger'>{errors.code}</span>}
                </div>
                <div>
                  <label className='mt-2'>Name <span className='text-danger'>*</span></label>
                  <input className='form-control' value={regionData?.name} defaultValue={regionData?.name} onChange={(e) => setRegionData({ ...regionData, 'name': e.target.value })} />
                  <span className='text-danger'>{errors?.name}</span>
                </div>
                <div>
                  <label className='mt-2'>Admin <span className='text-danger'>*</span></label>
                  <Select options={adminList}
                    value={selectedAdmin}
                    onChange={(e) => setSelectedAdmin(e)}
                  />
                  <span className='text-danger'>{errors?.admin}</span>
                </div>
                <div>
                  <label className='mt-2'>Members</label>
                  <Select options={memberList}
                    value={selectedMember}
                    onChange={handleChange}
                    isMulti />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => addRegion()}>Save</button>
              <button type="button" onClick={() => clearModal()} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Region
