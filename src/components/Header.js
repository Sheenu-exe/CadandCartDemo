"use client"
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/app/providers'
import CartDropdown from './CartDropdown'
import SearchBar from './SearchBar'

export default function Header() {
  const { state } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="bg-zinc-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            ProductCatalog
          </Link>

          <div className="flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="flex items-center space-x-2 text-gray-100 hover:text-blue-600"
            >
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden md:inline font-medium">
                Rs. {state.total.toFixed(2)}
              </span>
            </button>

            {isCartOpen && <CartDropdown onClose={() => setIsCartOpen(false)} />}
          </div>
        </div>
      </div>
    </header>
  )
}
