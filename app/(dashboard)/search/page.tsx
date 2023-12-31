import { getCourses } from '@/actions/getCourses'
import CoursesList from '@/components/search/CoursesList'
import Categories from '@/components/search/Categories'
import SearchInput from '@/components/search/SearchInput'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
};

const Browse = async ({
  searchParams
}: SearchPageProps) => {

  const { userId } = auth();

  if (!userId) return redirect("/");

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  })

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <div className='p-6'>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </div>
  )
}

export default Browse