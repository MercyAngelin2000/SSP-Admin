import React from 'react'

const Dashboard = React.lazy(() => import('./views/Dashboard'))
const Region = React.lazy(() => import('./views/Region'))
const User = React.lazy(() => import('./views/User'))
const routes = [
    { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    { path: '/region', name: 'Region', element: Region },
    { path: '/users', name: 'User', element: User },
]

export default routes