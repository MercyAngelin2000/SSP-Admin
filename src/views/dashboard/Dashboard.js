import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getAPI } from '../../apiService/ApiService';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate()
  const [token] = useState(localStorage.getItem('access-token'))
  const [regionCount, setRegionCount] = useState([])
  const [data, setData] = useState({
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
    if (!token) {
      // window.location.href = '/login'
      navigate('/login')
    }
  }, [token])
  useEffect(() => {
    handleRegionCount()
  }, [])
  const handleRegionCount = () => {
    var url = `/region/regioncounts/`
    getAPI(url).then((response) => {
      if (response?.data?.status) {
        var arr = []
        arr?.push(response?.data?.total_count)
        arr?.push(response?.data?.active_count)
        arr?.push(response?.data?.inactive_count)
        setRegionCount(arr)
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  useEffect(() => {
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
  }, [regionCount])
  return (
    <div>
      <small className='text-muted'>Home / <span className='text-primary'>Dashboard</span></small>
      <div>
        <h6 className='title fw-bold mt-1'>Dashboard</h6>
      </div>
      <div className='card dashboard_card'>
        <Doughnut data={data} />
        <label className='mt-2 text-center title'>Region</label>
      </div>
    </div>
  )
}

export default Dashboard