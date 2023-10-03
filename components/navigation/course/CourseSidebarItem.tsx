"use client"
import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";


interface CourseSidebarItemProps {
    label: string;
    id: string;
    isCompleted: boolean;
    courseId: string;
    isLocked: boolean;
};

export const CourseSidebarItem = ({
    label,
    id,
    isCompleted,
    courseId,
    isLocked,
}: CourseSidebarItemProps) => {

    const pathname = usePathname()
    const router = useRouter()

    const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle);

    const isActive = pathname?.includes(id);

    const onClick = () => {
        router.push(`/courses/${courseId}/chapters/${id}`);
    }


    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-blue text-sm font-[500] pl-6 transition-all  hover:bg-slate-300/20",
                isActive && "text-purple bg-slate-200/20 hover:bg-slate-200/20 hover:text-purple",
                isLocked && "text-slate-500 hover:text-slate-600",
                isCompleted && "text-emerald-400 hover:text-emerald-400",
                isCompleted && isActive && "bg-emerald-200/20",
            )}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={22}
                    className={cn(
                        "text-blue",
                        isActive && "text-purple",
                        isLocked && "text-slate-500",
                        isCompleted && "text-emerald-400"
                    )}
                />
                {label}
            </div>
            <div className={cn(
                "ml-auto opacity-0 border-2 border-purple h-full transition-all",
                
                isActive && "opacity-100 ",
                isCompleted && "border-emerald-400"
            )} />
        </button>
    )
}

export default CourseSidebarItem