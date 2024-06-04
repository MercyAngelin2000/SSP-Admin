import React, { useEffect, useState } from 'react'
import '../App.css'
import DataTable from 'react-data-table-component';

function Region() {

  const [selectedTab, setSelectedTab] = useState('region')

  useEffect(() => {
    console.log(selectedTab);
    if (selectedTab === 'region') {
      document.getElementById("region").classList.add("active")
      document.getElementById("user").classList.remove("active")
    } else {
      document.getElementById("region").classList.remove("active")
      document.getElementById("user").classList.add("active")
    }
  }, [selectedTab])

  const columns = [
    {
      name: 'Code',
      selector: row => row.code,
    },
    {
      name: 'Name',
      selector: row => row.name,
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

  const data = [
    {
      id: 1,
      code: 'ABD',
      name: 'Sample1',
    },
    {
      id: 2,
      code: 'ACD',
      name: 'Sample2',
    },
  ]



  return (
    <div>
       <div className='d-flex justify-content-center mt-3'>
      <h4 className='title fw-bold '>Region</h4>

       </div>
      <div className='container card'>
        <ul class="nav nav-tabs" >
          <li class="nav-item " id="region" onClick={() => setSelectedTab('region')}>
            <a class="nav-link " aria-current="page" href="#">Region</a>
          </li>
          <li class="nav-item" id="user" onClick={() => setSelectedTab('user')}>
            <a class="nav-link" href="#">User</a>
          </li>
        </ul>

        {selectedTab == 'region' &&
          <section id='regiontbl'>
            <div className='d-flex justify-content-end mt-3'>
              <button className='btn btn-success'>Add</button>
            </div>
            <DataTable
              pagination
              customStyles={customStyles}
              columns={columns}
              data={data}
            />
          </section>}

        {selectedTab == 'user' &&
          <section id='user'>
            <h4>User</h4>
          </section>}

      </div>
    </div>
  )
}

export default Region
