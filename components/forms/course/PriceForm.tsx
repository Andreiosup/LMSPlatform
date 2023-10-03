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
import { Textarea } from "../../ui/textarea";
import { formatPrice } from "@/lib/format";

interface DescriptionFormProps {
    initialData: Course,
};

const formSchema = z.object({
    price: z.coerce.number()
})

const PriceForm = ({ initialData }: DescriptionFormProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined
        },
    })

    const { isSubmitting, isValid } = form.formState;

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
                Course price
                <Button onClick={toggleEdit} variant="link">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit price
                        </>
                    )}
                </Button>
            </div>

            {!isEditing ? (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.price && "text-slate-500 italic"
                )}>
                    {initialData.price
                        ? formatPrice(initialData.price)
                        : "No price"
                    }

                </p>

            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-3">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-blue">
                                        Price (in dollars)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="1"
                                            disabled={isSubmitting}
                                            className="text-blue bg-black-300 border-[2px] border-blue "
                                            placeholder="Give your course a price"
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

export default PriceForm