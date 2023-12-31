import { getChapter } from '@/actions/getChapter';
import VideoPlayer from '@/components/course/VideoPlayer';
import CourseEnrollButton from '@/components/course/CourseEnrollButton';
import { Preview } from '@/components/reusalbles/Preview';
import { Banner } from '@/components/ui/banner';
import { Separator } from '@/components/ui/separator';
import { auth } from '@clerk/nextjs';
import { File } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'
import { CourseProgressButton } from '@/components/course/CourseProgressButton';

const ChapterPage = async ({
    params
}: {
    params: { courseId: string; chapterId: string }
}) => {
    const { userId } = auth();

    if (!userId) return redirect("/");

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    } = await getChapter({
        userId,
        chapterId: params.chapterId,
        courseId: params.courseId,
    });

    if (!chapter || !course) {
        return redirect("/")
    }


    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    variant="success"
                    label="You already completed this chapter."
                />
            )}
            {isLocked && (
                <Banner
                    variant="warning"
                    label="You need to purchase this course to watch this chapter."
                />
            )}

            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer
                        chapterId={params.chapterId}
                        title={chapter.title}
                        courseId={params.courseId}
                        nextChapterId={nextChapter?.id}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                    />
                </div>
                <div>
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-2xl font-semibold mb-2 text-slate-200">
                            {chapter.title}
                        </h2>
                        {
                            purchase ? (
                                <CourseProgressButton
                                    chapterId={params.chapterId}
                                    courseId={params.courseId}
                                    nextChapterId={nextChapter?.id}
                                    isCompleted={!!userProgress?.isCompleted}
                                />
                            ) : (
                                <CourseEnrollButton
                                    courseId={params.courseId}
                                    price={course.price!}
                                />
                            )
                        }
                    </div>
                    <Separator className='bg-blue opacity-50' />
                    <div className='pt-2 p-4 text-slate-200'>
                        {chapter.description}
                    </div>
                    {!!attachments.length && (
                        <>
                            <Separator />
                            <div className="p-4">
                                {attachments.map((attachment) => (
                                    <a
                                        href={attachment.url}
                                        target="_blank"
                                        key={attachment.id}
                                        className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                                    >
                                        <File />
                                        <p className="line-clamp-1">
                                            {attachment.name}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}

export default ChapterPage