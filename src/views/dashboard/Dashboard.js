import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [token]=useState(localStorage.getItem('access-token'))
  const data = {
    labels: ['Total Region', 'Active Region', 'Inactive Region'],
    datasets: [
      {
        data: [12, 19, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
useEffect(() => {
  if(!token){
    window.location.href = '/login'
  }
},[token])
  return (
    <div>
      <h4 className='title fw-bold'>Dashboard</h4>
      <div className='card dashboard_card'>
      <Doughnut data={data}/>
      <label className='fw-bold mt-2 text-center'>Region</label>
      </div>
    </div>
  )
}

export default Dashboard