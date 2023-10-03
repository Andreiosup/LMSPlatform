import { Menu } from 'lucide-react'

import {
    Sheet,
    SheetContent,
    SheetTrigger
  } from "@/components/ui/sheet";
import Sidebar from './Sidebar';

  

const MobileSidebar = () => {
  return (
    <Sheet>
    <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
      <Menu className='text-blue hover:text-purple'/>
    </SheetTrigger>
    <SheetContent side="left" className="p-0 text-slate-200">
      <Sidebar />
    </SheetContent>
  </Sheet>
  )
}

export default MobileSidebar