"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useForm } from "react-hook-form";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Textarea } from "../../ui/textarea";
import Image from "next/image";
import { FileUpload } from "../../reusalbles/FileUpload";

interface ImageFormProps {
  initialData: Course & { attachments: Attachment[] }
};

const formSchema = z.object({
  url: z.string().min(1)
})

const AttachmentForm = ({ initialData }: ImageFormProps) => {

  const [isEditing, setIsEditing] = useState(false)
  const toggleEdit = () => setIsEditing((current) => !current);
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const router = useRouter()




  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post(`/api/courses/${initialData.id}/attachments`, values)
      toast.success('Changes saved')
      toggleEdit()
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  async function onDelete(attachmentId: string) {
    try {
      setDeletingId(attachmentId)
      await axios.delete(`/api/courses/${initialData.id}/attachments/${attachmentId}`)
      router.refresh()
    } catch (error) {
      console.log("ss")
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="mt-6 bg-black-100 text-slate-200 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button onClick={toggleEdit} variant="link">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}

        </Button>
      </div>

      {!isEditing ? (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full text-blue hover:text-purple rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">
                    {attachment.name}
                  </p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              console.log("g")
              if (url) {

                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your student might need to complete this course
          </div>
        </div>

      )}

    </div>
  )
}

export default AttachmentForm