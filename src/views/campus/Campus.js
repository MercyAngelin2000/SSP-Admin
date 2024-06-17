import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import CampusUser from './CampusUser';
import { useNavigate } from 'react-router-dom';
import { getAPI, deleteAPI } from '../../apiService/ApiService';
import "./Campus.css";
import "../../index.css";
import { tableStyle } from '../../utils/Utils';
function Campus() {

    const [selectedTab, setSelectedTab] = useState('campus')
    const [campusList, setCampusList] = useState()
    const [userList, setUserList] = useState()
    const [selectedCampus, setSelectedCampus] = useState()
    const [mode, setMode] = useState('add')
    const [skip, setSkip] = useState(0)
    const [limit, setLimit] = useState(10)
    const [total, setTotal] = useState(0)
    const navigate = useNavigate();

    useEffect(() => {
        getUserList()
        if (selectedTab === 'campus') {
            document.getElementById("campustab").classList.add("active")
            document.getElementById("usertab").classList.remove("active")
        } else {
            document.getElementById("campustab").classList.remove("active")
            document.getElementById("usertab").classList.add("active")
        }
        // eslint-disable-next-line
    }, [selectedTab, campusList])

    useEffect(() => {
        getCampusList()
        // eslint-disable-next-line
    }, [limit, skip])


    const getCampusList = () => {
        var url = `/campus/?skip=${skip}&limit=${limit}`
        getAPI(url).then((response) => {
            setCampusList(response?.data?.data)
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

    const deleteCampus = (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success btn-sm",
                cancelButton: "btn btn-danger me-2 btn-sm"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this campus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
            heightAuto: false,
            width: 400
        }).then((result) => {
            if (result.isConfirmed) {
                var url = `/campus/${id}`
                deleteAPI(url).then((response) => {
                    if (response?.data?.status) {
                        getCampusList()
                        Swal.fire({
                            toast: true,
                            position: "center",
                            icon: "success",
                            title: "Campus deleted successfully",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                    else {
                        Swal.fire({
                            toast: true,
                            icon: "error",
                            title: "Oops...",
                            text: response?.detail,
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
            selector: row => row?.campus_code,
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
            name: 'State',
            selector: row => row?.state,
        },

        {
            name: 'Actions',
            selector: row => row.status,
            cell: row =>
                <div className='d-flex'>
                    <button className='btn text-primary btn-sm me-2' title='View' onClick={() => setSelectedCampus(row)} data-bs-toggle="modal" data-bs-target="#viewRegionModal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                        </svg>
                    </button>
                    <button className='btn text-primary btn-sm me-2' title='Edit' onClick={() => navigate('/addCampus', { state: { id: row?.id, mode: 'edit' } })}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                    </button>
                    <button className='btn  btn-sm deletebtn' title='Delete' onClick={() => deleteCampus(row?.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                        </svg>
                    </button>
                </div>

        },
    ];

    const handlePerRowsChange = (newPerPage, page) => {
        setLimit(newPerPage);

    }
    const handlePageChange = (currentpage) => {
        setSkip((currentpage - 1) * limit)
    }
    const searchCampus = (e) => {
    var url = `/campus/search/?value=${e?.target?.value}`
    getAPI(url).then((response) => {
        setCampusList(response?.data?.data)
    }).catch((error) => {
      console.log(error)
    })
    }

    return (
        <div>
            <small className='text-muted'>Home / System admin / <span className='text-primary'>Campus</span></small>
            <div className='container-fluid p-0'>
                <h6 className='title fw-bold mt-1'>Campus</h6>
            </div>
            <div className='container-fluid card mb-5 container-card'>
                <ul className="nav nav-tabs" >
                    <li className="nav-item " id="campustab" onClick={() => setSelectedTab('campus')}>
                        <span className="nav-link " aria-current="page" role='button'>Campus</span>
                    </li>
                    <li className="nav-item" id="usertab" onClick={() => setSelectedTab('user')}>
                        <span className="nav-link" role='button'>User</span>
                    </li>
                </ul>

                {selectedTab === 'campus' &&
                    <section id='regiontbl'>
                        <div className='d-flex justify-content-between align-items-end mt-1 p-0'>
                            <div className=''>
                                <input type="text" className='form-control me-2 tab_search' placeholder='Search'
                                 onChange={(e) => searchCampus(e)}
                                />
                            </div>
                            <div>
                                <button className='btn btn-sm add px-3' onClick={() => navigate('/addCampus', { state: { mode: 'add' } })}>Add</button>
                            </div>
                        </div>
                        <div className='card my-3 tablecard'>
                            <DataTable
                                pagination
                                customStyles={tableStyle}
                                columns={columns}
                                data={campusList}
                                paginationTotalRows={total}
                                paginationServer
                                onChangeRowsPerPage={handlePerRowsChange}
                                onChangePage={handlePageChange}
                            />
                        </div>
                    </section>}

                {selectedTab === 'user' &&
                    <section id='user'>
                        <CampusUser activeTab={selectedTab} />
                    </section>}

            </div>

            <div className="modal fade" id="viewRegionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">View Campus</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row mb-3">
                                <div className="col-sm-4 fw-bold">Code:</div>
                                <div className="col-sm-8">{selectedCampus?.campus_code}</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-4 fw-bold">Name:</div>
                                <div className="col-sm-8">{selectedCampus?.name}</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-4 fw-bold">Address:</div>
                                <div className="col-sm-8">{selectedCampus?.address}</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-4 fw-bold">City:</div>
                                <div className="col-sm-8">{selectedCampus?.city}</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-4 fw-bold">District:</div>
                                <div className="col-sm-8">{selectedCampus?.district}</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-4 fw-bold">Pincode:</div>
                                <div className="col-sm-8">{selectedCampus?.pincode}</div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-sm-4 fw-bold">State:</div>
                                <div className="col-sm-8">{selectedCampus?.state}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Campus