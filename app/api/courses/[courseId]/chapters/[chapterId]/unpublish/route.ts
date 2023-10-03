import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const PATCH = async (
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) => {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthorized",{status: 401})

        const courseOwner = await db.course.findUnique({
            where: {
              id: params.courseId,
              userId: userId,
            }
        });

        if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });


        const unpublishedChapter = await db.chapter.update({
            where: {
              id: params.chapterId,
              courseId: params.courseId,
            },
            data: {
              isPublished: false,
            }
          });
      
        return NextResponse.json(unpublishedChapter)
    
    } catch (error) {
        console.log("CHAPTER_PATCH",error)
        return new NextResponse("Internal error",{status: 500})
    }
}
