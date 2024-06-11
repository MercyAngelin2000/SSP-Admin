import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Region = React.lazy(() => import('./views/region/Region'))
const Corporate =React.lazy(() => import('./views/corporate/Corporate'))
const Campus =React.lazy(() => import('./views/campus/Campus'))
const AddCampus =React.lazy(() => import('./views/campus/AddCampus'))
const SchoolAccount =React.lazy(() => import('./views/school_account/SchoolAccount'))
const SchoolAdmin =React.lazy(() => import('./views/schoolAdmin/SchoolAdmin'))
const AddSchoolAdmin =React.lazy(() => import('./views/schoolAdmin/AddSchoolAdmin'))
// const User = React.lazy(() => import('./views/User'))
const routes = [
    { path: '/dashboard', name: 'Dashboard', element: Dashboard },
    { path: '/region', name: 'Region', element: Region },
    { path: '/corporate', name: 'Corporate', element: Corporate },
    { path: '/campus', name: 'Campus', element: Campus },
    { path: '/addcampus', name: 'AddCampus', element: AddCampus },
    { path: '/schoolaccount', name: 'School Account', element: SchoolAccount },
    { path: '/schooladmin', name: 'SchoolAdmin', element: SchoolAdmin },
    { path: '/addschooladmin', name: 'AddSchoolAdmin', element: AddSchoolAdmin },

    // { path: '/users', name: 'User', element: User },
]

export default routes