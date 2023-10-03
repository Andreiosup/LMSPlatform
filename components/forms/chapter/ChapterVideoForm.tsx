"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useForm } from "react-hook-form";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course, MuxData } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Textarea } from "../../ui/textarea";
import Image from "next/image";
import { FileUpload } from "../../reusalbles/FileUpload";

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null },
    courseId: string
};

const formSchema = z.object({
    videoUrl: z.string().min(1, {
        message: "Image is required",
    }),
})

const ChapterVideoForm = ({ initialData, courseId }: ChapterVideoFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter()


    async function onSubmit(values: z.infer<typeof formSchema>) {
        //console.log("vrevre")
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${initialData.id}`, values)
            toast.success('Changes saved')
            toggleEdit()
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="mt-6 bg-black-100 text-slate-200 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter video
                <Button onClick={toggleEdit} variant="link">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit video
                        </>
                    )}
                </Button>
            </div>

            {!isEditing ? (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-700 rounded-md">
                        <Video className="h-10 w-10 text-slate-400" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
                )
            ) : (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload a video for this chapter
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Videos can take a few minutes to process. Refresh the page if video does not appear.
                </div>
            )}

        </div>
    )
}

export default ChapterVideoForm