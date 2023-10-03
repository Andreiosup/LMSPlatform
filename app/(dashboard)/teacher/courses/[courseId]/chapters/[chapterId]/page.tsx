import { IconBadge } from "@/components/reusalbles/IconBadge";
import ChapterTitleForm from "@/components/forms/chapter/ChapterTitleForm";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterDescriptionForm from "@/components/forms/chapter/ChapterDescriptionForm";
import ChapterAccessFrom from "@/components/forms/chapter/ChapterAccessForm";
import ChapterVideoForm from "@/components/forms/chapter/ChapterVideoForm";
import { Banner } from "@/components/ui/banner";
import ChapterActions from "@/components/forms/chapter/ChapterActions";

const ChapterPage = async ({
    params
}: {
    params: { courseId: string; chapterId: string }
}) => {

    const { userId } = auth();

    if (!userId) return redirect("/");

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId
        },
        include: {
            muxData: true,
        },
    });

    if (!chapter) return redirect("/")

    const requiredFields = [
        chapter?.title,
        chapter?.description,
        chapter?.videoUrl
    ]


    const totalFields = requiredFields.length
    const completedField = requiredFields.filter(Boolean).length

    const completionText = `(${completedField}/${totalFields})`

    const isComplete = requiredFields.every(Boolean)

    return (
        <>
            {!chapter.isPublished && (
                <Banner
                    variant="warning"
                    label="This chapter is unpublished. It will not be visible in the course"
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${params.courseId}`}
                            className="flex items-center text-sm mb-6 text-blue hover:text-purple"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to course setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium text-slate-200">
                                    Chapter Creation
                                </h1>
                                <span className="text-sm text-slate-400">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <ChapterActions
                                disabled={!isComplete}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                                isPublished={chapter.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl text-slate-200">
                                    Customize your chapter
                                </h2>
                            </div>
                            <ChapterTitleForm
                                initialData={chapter}
                                courseId={params.courseId}
                            />
                            <ChapterDescriptionForm
                                initialData={chapter}
                                courseId={params.courseId}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye} />
                                <div className="text-xl text-slate-200">
                                    Access Settings
                                </div>
                            </div>
                            <ChapterAccessFrom
                                initialData={chapter}
                                courseId={params.courseId}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video} />
                            <h2 className="text-xl text-slate-200">
                                Add a video
                            </h2>
                        </div>
                        <ChapterVideoForm
                            initialData={chapter}
                            courseId={params.courseId}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChapterPage