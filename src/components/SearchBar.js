"use client"
import { useState, useEffect } from 'react'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import debounce from 'lodash/debounce'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()
  const searchRef = useRef()

  const fetchSuggestions = debounce(async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${searchQuery}&limit=5`
      )
      const data = await response.json()
      setSuggestions(data.products || [])
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    }
  }, 300)

  useEffect(() => {
    fetchSuggestions(query)
    return () => fetchSuggestions.cancel()
  }, [query])

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (searchQuery) => {
    if (searchQuery) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`)
    }
    setShowSuggestions(false)
  }

  return (
    <div ref={searchRef} className="relative">
      <div className="relative text-black">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query)
            }
          }}
          placeholder="Search products..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => handleSearch(query)}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-1 bg-white text-black rounded-lg shadow-lg z-50">
          {suggestions.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                setQuery(product.title)
                handleSearch(product.title)
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-medium">{product.title}</div>
              <div className="text-sm text-gray-600">${product.price}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

