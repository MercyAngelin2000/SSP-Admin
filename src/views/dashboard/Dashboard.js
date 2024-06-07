import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { regionCountAPI } from '../../apiService/ApiService';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
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
  regionCountAPI().then((response)=>{
    if(response?.status){
      var arr = []
      arr?.push(response?.total_count)
      arr?.push(response?.active_count)
      arr?.push(response?.inactive_count)
      setRegionCount(arr)
    }
  }).catch((error)=>{
    console.log(error)
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
      <div>
        <h5 className='title fw-bold header-position  '>Dashboard</h5>
      </div>
      <div className='card dashboard_card mt-5'>
      <Doughnut data={data}/>
      <label className='mt-2 text-center title'>Region</label>
      </div>
    </div>
  )
}

export default Dashboard