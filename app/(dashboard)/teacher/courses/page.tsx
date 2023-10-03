import { Button } from '@/components/ui/button'
import { columns } from '@/components/ui/colums'
import { DataTable } from '@/components/ui/data-table'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'


const CoursesPage = async() => {

  const { userId } = auth();

  if (!userId) return redirect("/");
  
  const data = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

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
        <div className="mt-6">

        <DataTable columns={columns} data={data} />
        </div>
    </div>
  )
}

export default CoursesPage