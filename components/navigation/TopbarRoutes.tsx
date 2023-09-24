"use client"

import { UserButton } from '@clerk/nextjs'
import { usePathname, } from 'next/navigation'
import { Button } from '../ui/button'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

const TopbarRoutes = () => {

  const pathname = usePathname()


  const isTeacherPage = pathname?.startsWith("/teacher");
  const isClassPage = pathname?.includes("/classes");
  const isSearchPage = pathname === "/search";

  return (
    <div className='flex gap-x-2 ml-auto'>
      {isTeacherPage || isClassPage ? (
        <Link
          href="/"
        >
          <Button variant="link">
            <LogOut className='h-4 w-4 mr-2"' />
            Exit
          </Button>
        </Link>
      ) : (
        <Link
          href="/teacher/courses"
        >
          <Button variant="link">
            Teacher mode
          </Button>
        </Link>
      )}
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}

export default TopbarRoutes