"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/app/providers'

export default function ProductCard({ id, title, description, price, thumbnail, rating, stock }) {
  const { dispatch } = useCart()

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { id, title, price, quantity: 1 }
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-blue-600">
            {title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold">Rs {price}</span>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-sm text-gray-600">{rating}</span>
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className={`w-full py-2 px-4 rounded ${
            stock > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 cursor-not-allowed text-gray-500'
          }`}
        >
          {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}