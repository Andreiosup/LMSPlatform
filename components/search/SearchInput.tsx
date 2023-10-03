"use client"

import { Search } from 'lucide-react'
import qs from "query-string";
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const SearchInput = () => {

  const [value, setValue] = useState("")
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        categoryId: currentCategoryId,
        title: debouncedValue,
      }
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname])

  return (
    <div className="relative text-blue">
      <Search className='h-4 w-4 absolute top-3 left-3'/>
      <Input
        className='w-full md:w-[300px] pl-9 rounded-full bg-slate-800 focus-visible:ring-blue'
        onChange={(e) => setValue(e.target.value)}
        value={value}
        placeholder="Search for a course"
      />
    </div>
  )
}

export default SearchInput