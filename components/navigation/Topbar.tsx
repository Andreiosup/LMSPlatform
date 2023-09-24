import React from 'react'
import MobileSidebar from './MobileSidebar'
import TopbarRoutes from './TopbarRoutes'

const Topbar = () => {
  return (
    <div className="p-4 border-b border-black h-full flex items-center bg-black-100 shadow-sm">
        <MobileSidebar/>
        <TopbarRoutes/>
    </div>
  )
}

export default Topbar