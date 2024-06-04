import React from 'react'
import '../App.css'
import DataTable from 'react-data-table-component';

function Dashboard() {
  const columns = [
    {
      name: 'Title',
      selector: row => row.title,
    },
    {
      name: 'Year',
      selector: row => row.year,
    },
  ];
  
  const data = [
      {
      id: 1,
      title: 'Beetlejuice',
      year: '1988',
    },
    {
      id: 2,
      title: 'Ghostbusters',
      year: '1984',
    },
  ]
  return (
    <div>
      <h4 className='title fw-bold'>Dashboard</h4>
      <div className='container card'>
      <DataTable
			columns={columns}
			data={data}
		/>
      </div>
    </div>
  )
}

export default Dashboard