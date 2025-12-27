'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/catalog')
    }
  }

  return (
    <form 
      onSubmit={handleSearch} 
      className="ml-4 flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-[#71b3c9] transition-all group"
    >
      <Search size={10} className="text-white/20 group-focus-within:text-[#71b3c9] mr-2 transition-colors" />
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="SEARCH..." 
        className="bg-transparent border-none outline-none text-[8px] tracking-[0.2em] text-white w-24 lg:w-32 uppercase font-bold placeholder:text-gray-600"
      />
      {query && (
        <button type="button" onClick={() => { setQuery(''); router.push('/catalog'); }}>
          <X size={10} className="ml-2 text-white/20 hover:text-white" />
        </button>
      )}
    </form>
  )
}