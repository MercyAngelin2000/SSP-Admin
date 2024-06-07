import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Region = React.lazy(() => import('./views/region/Region'))
const Corporate =React.lazy(() => import('./views/corporate/Corporate'))
const Campus =React.lazy(() => import('./views/campus/Campus'))
// const User = React.lazy(() => import('./views/User'))
const routes = [
    { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    { path: '/region', name: 'Region', element: Region },
    { path: '/corporate', name: 'Corporate', element: Corporate },
    { path: '/campus', name: 'Campus', element: Campus },
    // { path: '/users', name: 'User', element: User },
]

export default routes