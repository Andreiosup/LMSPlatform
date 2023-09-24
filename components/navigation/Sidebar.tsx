import React from 'react'
import Logo from './Logo'
import SidebarRoutes from './SidebarRoutes'

const Sidebar = () => {
  return (
    <div className="h-full border-r border-current flex flex-col overflow-y-auto bg-black-100 shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
      
    </div>
  )
}

export default Sidebar