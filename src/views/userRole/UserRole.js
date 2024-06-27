import React, { useContext, useState } from 'react'
import DataTable from 'react-data-table-component'
import { activeStatus, tableStyle, setSessionStorageItem } from '../../utils/Utils';
import { inputContext } from '../../layout/DefaultLayout';
import "../../index.css"
import "../region/Region.css"
function UserRole() {
    const [regionList, setRegionList] = useState([
        {
            code: '1',
            name : 'test',
            active: true
        }
    ])
    const [mode, setMode] = useState('add')
    const [skip, setSkip] = useState(0)
    const [limit, setLimit] = useState(10)
    const [total, setTotal] = useState(0)
    const inputContextObj = useContext(inputContext);

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
                    <button className='btn text-primary btn-sm me-2' onClick={() => handleAdd()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                    </button>
                    <button className='deletebtn btn  btn-sm me-2' >
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
    const handleAdd = () => {
        setMode('add')
        setSessionStorageItem('inputBar', true);
        inputContextObj?.setInputObj({ from: "userRole", })
    }

    return (
        <>
            <div className='mt-2'>
                <small className='text-gray'>Home / <span className='text-primary'>User Role</span></small>
                <div className='container-fluid p-0 mt-3'>
                    {/* <h6 className='title fw-bold mt-1'>Region</h6> */}
                </div>
                <div className='container-fluid card mb-5 container-card'>
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
                                <input type="text" className='form-control me-2 tab_search' placeholder='Search' />
                            </div>
                            <div>

                                <button className='btn btn-sm add px-2' onClick={() => handleAdd()}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
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
                                data={regionList}
                                paginationTotalRows={total}
                                paginationServer
                                onChangeRowsPerPage={handlePerRowsChange}
                                onChangePage={handlePageChange}
                            />
                        </div>
                    </section>


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
            {/* <div class="loader_contain col">
                <div class="loader" id="loader-8"></div>
            </div> */}
            <div class="loader_contain col">
                <div class="loader" id="loader-6">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </>
    )
}

export default UserRole
