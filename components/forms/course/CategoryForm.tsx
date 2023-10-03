"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Combobox } from "../../ui/combobox";

interface CategoryFormProps {
    initialData: Course,
    options: { label: string, value: string }[]
};

const formSchema = z.object({
    categoryId: z.string().min(1, {
        message: "Category is required",
    }),
})

const CategoryForm = ({
    initialData,
    options
}: CategoryFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
        },
    })

    const { isSubmitting, isValid } = form.formState;

    const selectedOption = options.find((option) => option.value === initialData.categoryId);

    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            await axios.patch(`/api/courses/${initialData.id}`, values)
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
                Course category
                <Button onClick={toggleEdit} variant="link">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit category
                        </>
                    )}
                </Button>
            </div>

            {!isEditing ? (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.categoryId && "text-slate-500 italic"
                )}>
                     {selectedOption?.label || "No category"}
                </p>

            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-3">
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue">
                                        Category
                                    </FormLabel>
                                    <FormControl>
                                    <Combobox
                                        options={options}
                                        {...field}
                                      />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                                variant="primary"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}

        </div>
    )
}

export default CategoryForm