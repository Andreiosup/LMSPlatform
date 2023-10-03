import { Chapter, Course, UserProgress } from "@prisma/client";
import TopbarRoutes from "../TopbarRoutes";
import { CourseMobileSidebar } from "./CourseMobileSidebart";

interface CourseTopbarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
    };
    progressCount: number;
};

export const CourseTopbar = ({
    course,
    progressCount,
}: CourseTopbarProps) => {
    return (
        <div className="p-4 border-b border-black h-full flex items-center bg-black-100 shadow-sm">
            <CourseMobileSidebar
                course={course}
                progressCount={progressCount}
            />
            <TopbarRoutes />
        </div>
    )
}

export default CourseTopbar