import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const base_url = process.env.REACT_APP_BASE_URL
  const [token]=useState(localStorage.getItem('access-token'))
  const [regionCount, setRegionCount] = useState([])
  const [data,setData] = useState({
    labels: ['Total Region', 'Active Region', 'Inactive Region'],
    datasets: [
      {
        data: [0, 0, 0],
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
  })
useEffect(() => {
  if(!token){
    window.location.href = '/login'
  }
},[token])
useEffect(()=>{
  handleRegionCount()
},[])
const handleRegionCount=()=>{
  axios({
    method:'GET',
    url:`${base_url}/region/regioncounts/`,
    headers:{
      'Authorization':`Bearer ${token}`
    }
  }).then((response)=>{
    if(response?.data?.status){
      var arr = []
      arr?.push(response?.data?.total_count)
      arr?.push(response?.data?.active_count)
      arr?.push(response?.data?.inactive_count)
      setRegionCount(arr)
    }
  })
}
useEffect(()=>{
  setData({
    labels: ['Total Region', 'Active Region', 'Inactive Region'],
    datasets: [
      {
        data: regionCount,
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
  })
    },[regionCount])
  return (
    <div>
      <div className='d-flex justify-content-center align-items-center'>
        <h5 className='title fw-bold'>Dashboard</h5>
      </div>
      <div className='card dashboard_card'>
      <Doughnut data={data}/>
      <label className='mt-2 text-center title'>Region</label>
      </div>
    </div>
  )
}

export default Dashboard