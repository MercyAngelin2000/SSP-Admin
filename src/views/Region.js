import React, { useEffect, useState } from 'react'
import '../App.css'
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';

function Region() {

  const [selectedTab, setSelectedTab] = useState('region')
  const [regionList, setRegionList] = useState()
  const [adminList, setAdminList] = useState()
  const [memberList, setMemberList] = useState()
  const [regionData, setRegionData] = useState({ code: '', name: '' })
  const [selectedAdmin, setSelectedAdmin] = useState()
  const [selectedMember, setSelectedMember] = useState()
  const [mode, setMode] = useState('add')

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4iLCJ1c2VyX2lkIjoxLCJyb2xlX2lkIjoxLCJleHAiOjE3MTc1ODczNjR9.J8ERCTUu2WPlxgBrV5pXSHlSxUN7zyRIco_Ld6kKHbI"
  
  useEffect(() => {

    if (selectedTab === 'region') {
      document.getElementById("region").classList.add("active")
      document.getElementById("user").classList.remove("active")
    } else {
      document.getElementById("region").classList.remove("active")
      document.getElementById("user").classList.add("active")
    }
  }, [selectedTab])

  useEffect(() => {
    getRegionList()
    getUserList()
  }, [])

  const getRegionList = () => {
    axios({
      method: 'GET',
      url: 'http://192.168.1.148:8080/region/?skip=0&limit=10',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then((response) => {
      setRegionList(response?.data?.data)
    }).catch((error) => {
      console.log(error);
    })

  }

  const getUserList = () => {
    axios({
      method: 'GET',
      url: 'http://192.168.1.148:8080/region/regionusers',
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
    axios({
      method: "POST",
      url: "http://192.168.1.148:8080/region/",
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
        title: "Region added successfully" ,
        showConfirmButton: false,
        timer: 1500
    });
    }).catch((error) => {
      console.log(error)
    })

  }

  const updateRegion = () => {
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
    axios({
      method: "PUT",
      url: "http://192.168.1.148:8080/region/" + regionData?.id,
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
        title: "Region updated successfully" ,
        showConfirmButton: false,
        timer: 1500
    });
    }).catch((error) => {
      console.log(error)
    })
  }

  const getSingleRegion = (id) => {
    axios({
      method: 'GET',
      url: 'http://192.168.1.148:8080/region/regionbyid/?region_id=' + id,
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
        axios({
          method: 'DELETE',
          url: 'http://192.168.1.148:8080/region/' + id,
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
            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={row?.active} />
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
    if (mode == 'edit') {
      const dataIds = new Set(data.map(dataItem => dataItem.value));
      const missingMembers = selectedMember.filter(member => !dataIds.has(member.value));
      console.log("Missing Members: ", missingMembers[0]?.value);

      if (missingMembers?.length > 0) {
        axios({
          method: 'DELETE',
          url: 'http://192.168.1.148:8080/region/regionusers/' + missingMembers[0]?.value,
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then((response) => {
          console.log(response.data.data)
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

        {selectedTab == 'region' &&
          <section id='regiontbl'>
            <div className='d-flex justify-content-end mt-3'>
              <button className='btn btn-success' data-bs-toggle="modal" data-bs-target="#addRegionModal" onClick={() => setMode('add')}>Add</button>
            </div>
            <DataTable
              pagination
              customStyles={customStyles}
              columns={columns}
              data={regionList}
            />
          </section>}

        {selectedTab == 'user' &&
          <section id='user'>
            <h4>User</h4>
          </section>}

      </div>
      <div className="modal fade" id="addRegionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">{mode=='edit' ? 'Edit Region' : 'Add Region'}</h1>
              <button type="button" id='modalClose' className="btn-close" onClick={() => clearModal()} data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div>
                <label className='mt-2'>Code</label>
                <input className='form-control' value={regionData?.code} defaultValue={regionData?.code} onChange={(e) => setRegionData({ ...regionData, 'code': e.target.value })} />
                <label className='mt-2'>Name</label>
                <input className='form-control' value={regionData?.name} defaultValue={regionData?.name} onChange={(e) => setRegionData({ ...regionData, 'name': e.target.value })} />
                <label className='mt-2'>Admin</label>
                <Select options={adminList}
                  value={selectedAdmin}
                  onChange={(e) => setSelectedAdmin(e)}
                />
                <label className='mt-2'>Members</label>
                <Select options={memberList}
                  value={selectedMember}
                  onChange={handleChange}
                  isMulti />

              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => mode == 'add' ? addRegion() : updateRegion()}>Save</button>
              <button type="button" onClick={() => clearModal()} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Region
