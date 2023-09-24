import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CoursesPage = () => {
  return (
    <div className='p-6'>
        <Link
            href="/teacher/create"
        >
            <Button variant="link">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Course
            </Button>
        </Link>
    </div>
  )
}

export default CoursesPage