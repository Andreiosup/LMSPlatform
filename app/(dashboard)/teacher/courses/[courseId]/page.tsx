import { IconBadge } from '@/components/IconBadge';
import DescriptionForm from '@/components/forms/DescriptionForm';
import ImageForm from '@/components/forms/ImageForm';
import TitleForm from '@/components/forms/TitleForm';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { LayoutDashboard } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

const CoursePage = async ({
  params
}: {
  params: { courseId: string; }
}) => {
  const { userId } = auth()

  if (!userId) return redirect("/")

  const course = await db.course.findUnique({
    where: {
      id: params.courseId
    }
  })

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  })
  console.log(categories)

  if (!course) return redirect("/");

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ]

  const totalFields = requiredFields.length
  const completedField = requiredFields.filter(Boolean).length

  const completionText = `(${completedField}/${totalFields})`

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium text-slate-200">
            Course setup
          </h1>
          <span className="text-sm text-slate-400">
            Complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-slate-200">
              Customize your course
            </h2>
          </div>
          <TitleForm
            initialData={course}
          />
          <DescriptionForm
            initialData={course}
          />
          <ImageForm
            initialData={course}
          />
        </div>
      </div>
    </div>
  )
}

export default CoursePage