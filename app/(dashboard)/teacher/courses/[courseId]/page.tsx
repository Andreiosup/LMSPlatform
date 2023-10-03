import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react';


import { IconBadge } from '@/components/reusalbles/IconBadge';
import AttachmentForm from '@/components/forms/course/AttachmentForm';
import CategoryForm from '@/components/forms/course/CategoryForm';
import ChaptersForm from '@/components/forms/course/ChaptersForm';
import DescriptionForm from '@/components/forms/course/DescriptionForm';
import ImageForm from '@/components/forms/course/ImageForm';
import PriceForm from '@/components/forms/course/PriceForm';
import TitleForm from '@/components/forms/course/TitleForm';
import { Banner } from '@/components/ui/banner';
import CourseActions from '@/components/forms/course/Actions';

const CoursePage = async ({
  params
}: {
  params: { courseId: string; }
}) => {
  const { userId } = auth()

  if (!userId) return redirect("/")

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })


  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  })


  if (!course) return redirect("/");

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter => chapter.isPublished)
  ]

  const totalFields = requiredFields.length
  const completedField = requiredFields.filter(Boolean).length

  const completionText = `(${completedField}/${totalFields})`

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      {!course.isPublished && (
        <Banner
          variant="warning"
          label="This course is unpublished. It will not be visible to students"
        />
      )}
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
          <CourseActions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
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
            <CategoryForm
              initialData={course}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl text-slate-200">
                  Course Chapters
                </h2>
              </div>
              <ChaptersForm
                initialData={course}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl text-slate-200">
                  Sell your course
                </h2>
              </div>
              <PriceForm
                initialData={course}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl text-slate-200">
                  Resources & Attachments (optional)
                </h2>
              </div>
              <AttachmentForm
                initialData={course}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CoursePage