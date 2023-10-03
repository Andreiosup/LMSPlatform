import { getProgress } from "@/actions/getProgress";
import CourseSidebar from "@/components/navigation/course/CourseSidebar";
import CourseTopbar from "@/components/navigation/course/CourseTopbar";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function CourseLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: { courseId: string }
}) {
  const { userId } = auth();

  if (!userId) return redirect("/");

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            }
          }
        },
        orderBy: {
          position: "asc"
        }
      }
    }
  });

  if (!course) return redirect("/")

  const progressCount = await getProgress(userId, course.id);

  return (
    <div className="h-hull">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseTopbar 
          course={course}
          progressCount={progressCount}
        />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50 text-blue">
        <CourseSidebar
          course={course}
          progressCount={progressCount}
        />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">
        {children}
      </main>
    </div>
  )
}
