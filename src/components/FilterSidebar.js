"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  })

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  )

  const [minRating, setMinRating] = useState(
    searchParams.get('rating') || ''
  )

  const [categories, setCategories] = useState([]) 


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = 'https://dummyjson.com/products/category-list'
        const response = await fetch(url)
        const data = await response.json()
        setCategories(data) 
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, []) 

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (priceRange.min) params.set('minPrice', priceRange.min)
    if (priceRange.max) params.set('maxPrice', priceRange.max)
    if (minRating) params.set('rating', minRating)

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="w-1/2 p-2 border rounded"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Minimum Rating</label>
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Any Rating</option>
          {[4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating}+ Stars
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleFilter}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  )
}