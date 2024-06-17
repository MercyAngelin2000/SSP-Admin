import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import "./SchoolAccount.css"
import { getAPI,deleteAPI } from '../../apiService/ApiService';
import { tableStyle } from '../../utils/Utils';
import AddSchoolAccount from './AddSchoolAccount';
import Swal from 'sweetalert2';

function SchoolAccount() {
    //pagination
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [title, setTile] = useState()
    const [tableData,setTableData]=useState()
    const [editData,setEditData]=useState()
    const [viewData, setViewData] = useState()
    const columns = [
        {
            width: '100px',
            name: '#',
            selector: (row, index) => index + 1,
            cell: (row, index) => <div>{index + 1}</div>,
            sortable: true
        },
        {
            name: 'School Code',
            selector: row => row?.school_code,
            cell: row => <div>{row?.school_code}</div>,
            sortable: true
        },
        {
            name: 'School Name',
            selector: row => row?.school_name,
            cell: row => <div>{row?.school_name}</div>,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row?.email,
            cell: row => <div className='ellipsis' title={row?.email}>{row?.email}</div>,
            sortable: true
        },
        {
            name: 'Phone',
            selector: row => row?.phone_number,
            cell: row => <div>{row?.phone_number}</div>,
            sortable: true
        },
        {
            name: 'Actions',
            selector: row => row.status,
            cell: row =>
                <div>
                    <button className='btn text-primary btn-sm me-2' title='View' onClick={() => handleView(row)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
            </svg>
                    </button>
                    <button className='btn text-primary btn-sm me-2' title='Edit' onClick={() => handleEdit(row)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                    </button>
                    <button className='deletebtn btn btn-sm' title='Delete' onClick={() => handleDelete(row)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                        </svg>
                    </button>
                </div>,
        },
    ];
    const getSchoolList=()=>{
        getAPI(`/schools/?skip=${skip}&limit=${limit}`).then((res)=>{
            setTableData(res.data?.data)
            setTotal(res.data?.total_count)
        }).catch((err)=>{
            console.log(err)
        })
    }
    useEffect(()=>{
        getSchoolList()
        //eslint-disable-next-line
    },[limit,skip])
    const handleDelete = (row) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success btn-sm",
                cancelButton: "btn btn-danger me-2 btn-sm"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this school account!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
            heightAuto: false,
            width: 400
        }).then((result) => {
            if (result.isConfirmed) {
                var url = `/schools/${row?.id}`
                deleteAPI(url).then((response) => {
                    let data = response?.data
                    if (data?.status) {
                        getSchoolList()
                        Swal.fire({
                            toast: true,
                            position: "center",
                            icon: "success",
                            title: "School account deleted successfully",
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
    const handlePageChange = (page) => {
        setSkip((page - 1) * limit)
    }
    const handlePerRowsChange = (newPerPage, page) => {
        setLimit(newPerPage)
    }
    const handleAdd = () => {
        setEditData()
        setTile("Add School Account")

    }
    const handleEdit=(row)=>{
        setEditData(row)
        setTile("Edit School Account")
    }
    const getSingleData = (id) => {
        getAPI(`/schools/${id}`).then((res) => {
            setViewData(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        })
    }
    const handleView = (row) => {
        setEditData()
        setTile("View School Account")
        getSingleData(row?.id)
    }
    const handleSearch = (e) => {
        if (e?.target?.value) {
            getAPI(`/schools/search/?value=${e?.target?.value}`).then((res) => {
                setTableData(res?.data?.data)
            }).catch((err) => {
                console.log(err)
            })
        }
        else {
            getSchoolList()
        }
    }
    const getData = (value) => {
        if (value === "success") {
            setTile()
            setEditData()
            getSchoolList()
        }
    }
    return (
        <div>
            {
                title ? <div className='d-flex justify-content-end align-items-center'>
                    <div className='container-fluid p-0'>
                    <small className='text-muted'>Home / System admin / <span className='text-primary'  onClick={() => setTile(null)} role='button' title='Navigate to School Account'>School Account</span></small>
                        <h6 className='title fw-bold mt-1'>School Account</h6>
                    </div>
                    <button className='btn btn-sm border text-primary' onClick={() => setTile(null)} title='Back'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                                    </svg>
                                </button>
                </div>
                    :
                    <div className='container-fluid p-0'>
                    <small className='text-muted'>Home / System admin / <span className='text-primary'>School Account</span></small>
                        <h6 className='title fw-bold mt-1'>School Account</h6>
                    </div>
            }
            {
                title ? "" :
                    <>
                        <div className='card p-2 container-card'>
                            <div className='d-flex justify-content-between align-items-end mb-3'>
                                <div className='d-flex'>
                                    <input type="text" className='form-control mt-2  me-2 tab_search' placeholder='Search' onChange={handleSearch} />
                                </div>
                                <div>
                                    <button className='btn btn-sm add px-3' title='Add' onClick={() => handleAdd()}>Add</button>
                                </div>
                            </div>
                            <div className='card tablecard'>
                            <DataTable
                                pagination
                                customStyles={tableStyle}
                                columns={columns}
                                data={tableData}
                                paginationTotalRows={total}
                                paginationServer
                                onChangeRowsPerPage={handlePerRowsChange}
                                onChangePage={handlePageChange}
                            />
                            </div>
                        </div>
                    </>
            }
            {
                title ? <AddSchoolAccount title={title} getData={getData} editMethod={editData} viewmethod={viewData}/> : null
            }
        </div>
    )
}

export default SchoolAccount