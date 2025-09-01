import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftsideBar from './LeftsideBar'

const MainLayout = () => {
  return (
    <div>
      <LeftsideBar />
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout