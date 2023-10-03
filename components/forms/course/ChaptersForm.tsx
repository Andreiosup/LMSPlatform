"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course } from "@prisma/client";
import { cn } from "@/lib/utils";
import ChaptersList from "./ChaptersList";

interface ChaptersFormProps {

    initialData: Course & { chapters: Chapter[] };

};

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
})

const ChaptersForm = ({ initialData }: ChaptersFormProps) => {

    const [isCreating, setisCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const toggleCreating = () => setisCreating((current) => !current);

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })

    const { isSubmitting, isValid } = form.formState;

    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            await axios.post(`/api/courses/${initialData.id}/chapters`, values)
            toggleCreating()
            router.refresh()
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }
    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true);
            await axios.put(`/api/courses/${initialData.id}/chapters/reorder`, {
                list: updateData
            });
            toast.success("Chapters reordered");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    }
    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${initialData.id}/chapters/${id}`);
    }

    return (
        <div className="relative mt-6 bg-black-100 text-slate-200 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-purple" />
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Chapters
                <Button onClick={toggleCreating} variant="link">
                    {isUpdating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a chapter
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-3">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue">
                                        Chapter Title
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            className="text-blue bg-black-300 border-[2px] border-blue "
                                            placeholder="e.g. 'Introduction'"
                                            {...field}
                                        />
                                    </FormControl>
                                    {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <div className="flex items-center gap-x-2"> */}
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            variant="primary"
                        >
                            Create
                        </Button>
                        {/* </div> */}
                    </form>
                </Form>
            )}
            {!isCreating && (
                <>
                    <div className={cn(
                        "text-sm mt-2",
                        !initialData.chapters.length && "text-slate-500 italic"
                    )}>
                        {!initialData.chapters.length && "No chapters"}
                        <ChaptersList
                            onEdit={onEdit}
                            onReorder={onReorder}
                            items={initialData.chapters || []}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                        Drag and drop to reorder the chapters
                    </p>
                </>
            )}
        </div>
    )
}

export default ChaptersForm