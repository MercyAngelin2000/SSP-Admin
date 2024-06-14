import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { getAPI, deleteAPI } from '../../apiService/ApiService';
import {  tableHeaderBackground } from '../../utils/Utils';
import {useNavigate} from 'react-router-dom';
import SchoolAdminUser from './SchoolAdminUser';
import '../../index.css';
import './SchoolAdmin.css';

function SchoolAdmin() {
  const [selectedTab, setSelectedTab] = useState('schooladmin')
  const [schoolAdminList, setSchoolAdminList] = useState()
  const [skip, setSkip] = useState(0)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
const navigate = useNavigate();

  useEffect(() => {

    if (selectedTab === 'schooladmin') {
      document.getElementById("schooladmintab").classList.add("active")
      document.getElementById("usertab").classList.remove("active")
    } else {
      document.getElementById("schooladmintab").classList.remove("active")
      document.getElementById("usertab").classList.add("active")
    }
    // eslint-disable-next-line
  }, [selectedTab, schoolAdminList])

  useEffect(() => {
    getSchoolAdminList()
    // eslint-disable-next-line
  }, [limit, skip])

  const getSchoolAdminList = () => {
    var url = `/admin/?skip=${skip}&limit=${limit}`
    getAPI(url).then((response) => {
      setSchoolAdminList(response?.data?.data)
      setTotal(response?.data?.total_count)
    }).catch((error) => {
      console.log(error);
    })

  }


  const deleteSchoolAdmin = (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success btn-sm",
        cancelButton: "btn btn-danger me-2 btn-sm"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this school admin!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      heightAuto: false,
      width: 400
    }).then((result) => {
      if (result.isConfirmed) {
        var url = `/admin/${id}`
        deleteAPI(url).then((response) => {
          
          if (response?.data?.status) {
            Swal.fire({
              toast: true,
              position: "center",
              icon: "success",
              title: "School Admin deleted successfully",
              showConfirmButton: false,
              timer: 1500
            });
            getSchoolAdminList()
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

  const columns = [
    {
      width: '100px',
      name: '#',
      selector: (row, index) => index + 1
    },
    {
      name: 'Code',
      selector: row => row?.staff_code,
    },
    {
      name: 'Name',
      selector: row => row?.first_name,
    },
    {
      name: 'City',
      selector: row => row?.email,
    },
    {
      name: 'Actions',
      selector: row => row.status,
      cell: row =>
        <div className='d-flex'>
          {/* <button className='btn text-primary btn-sm me-2' title='View' onClick={() => handleViewCorporate(row)} data-bs-toggle="modal" data-bs-target="#viewRegionModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
            </svg>
          </button> */}
          <button className='btn text-primary btn-sm me-2' title='Edit'  onClick={() => navigate('/addSchoolAdmin', { state: { id: row?.id, mode: 'edit' } })} >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
            </svg>
          </button>
          <button className='btn deletebtn btn-sm me-2' title='Delete' onClick={() => deleteSchoolAdmin(row?.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
            </svg>
          </button>
        </div>

    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: '14px', // Decrease font size
        fontWeight: 'bold', // Make font weight bold
        color: '#333', // Change font color
        backgroundColor: tableHeaderBackground,
      },
    },
    cells: {
      style: {
        fontSize: '13px', // Decrease font size
      },
    },
  };



  const handlePerRowsChange = (newPerPage, page) => {
    setLimit(newPerPage);

  }
  const handlePageChange = (currentpage) => {
    setSkip((currentpage - 1) * limit)
  }
  const searchSchoolAdmin = (e) => {
    var url = `/corporate/search/?value=${e?.target?.value}&skip=${skip}&limit=${limit}`
    getAPI(url).then((response) => {
      setSchoolAdminList(response?.data?.data)
    }).catch((error) => {
      console.log(error)
    })
  }

  return (
    <div>
      <div className='container-fluid p-0'>
        <h5 className='title fw-bold'>School Admin</h5>
      </div>
      <div className='container-fluid card mb-5 container-card'>
                <ul className="nav nav-tabs" >
                    <li className="nav-item " id="schooladmintab" onClick={() => setSelectedTab('schooladmin')}>
                        <span className="nav-link " aria-current="page" role='button'>School Admin</span>
                    </li>
                    <li className="nav-item" id="usertab" onClick={() => setSelectedTab('user')}>
                        <span className="nav-link" role='button'>User</span>
                    </li>
                </ul>

                {selectedTab === 'schooladmin' &&
                    <section id='regiontbl'>
                        <div className='d-flex justify-content-between align-items-end mt-1 p-0'>
                            <div className=''>
                                <input type="text" className='form-control me-2 tab_search' placeholder='Search'
                                 onChange={(e) => searchSchoolAdmin(e)}
                                />
                            </div>
                            <div>
                                <button className='btn  btn-sm add px-3' onClick={() => navigate('/addSchoolAdmin', { state: { mode: 'add' } })}>Add</button>
                            </div>
                        </div>
                        <div className='card my-3 tablecard'>
                            <DataTable
                                pagination
                                customStyles={customStyles}
                                columns={columns}
                                data={schoolAdminList}
                                paginationTotalRows={total}
                                paginationServer
                                onChangeRowsPerPage={handlePerRowsChange}
                                onChangePage={handlePageChange}
                            />
                        </div>
                    </section>}

                {selectedTab === 'user' &&
                    <section id='user'>
                        <SchoolAdminUser activeTab={selectedTab} />
                    </section>}

            </div>
    </div>
  )
}

export default SchoolAdmin