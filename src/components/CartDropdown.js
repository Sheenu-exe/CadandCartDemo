"use client"
import { useCart } from '@/app/providers'
import { Minus, Plus, ShoppingCart, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'

export default function CartDropdown({ onClose }) {
  const { state, dispatch } = useCart()
  const dropdownRef = useRef()

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id })
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    }
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute w-fit right-0 mt-2 max-w-[100vw] bg-card text-card-foreground rounded-lg shadow-2xl z-50 border animate-in fade-in-0 zoom-in-95"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {state.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-sm">Your cart is empty</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[320px] pr-4 w-fit -mr-4">
              <div className="space-y-4 w-[100%]">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50"
                  >
                    <div className="relative w-16 h-16 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <ShoppingCart className="h-6 w-6 text-muted-foreground/50" />
                      )}
                    </div>

                    <div className="flex-1 w-[90%]">
                      <h4 className="font-medium truncate w-[50%]">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center border rounded-lg overflow-hidden flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none border-r hover:bg-muted"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none border-l hover:bg-muted"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-6 space-y-4">
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span className="text-lg">${state.total.toFixed(2)}</span>
              </div>
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
