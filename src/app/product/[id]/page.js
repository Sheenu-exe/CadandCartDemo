"use client"
import { useEffect, useState, use } from 'react'
import Image from 'next/image'
import { useCart } from '@/app/providers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ChevronLeft, 
  Star, 
  StarHalf,
  Minus,
  Plus,
  Package,
  Tags,
  Box
} from 'lucide-react'

export default function ProductPage({ params }) {
  const unwrappedParams = use(params)
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState([])
  const { dispatch } = useCart()
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${unwrappedParams.id}`)
        const data = await response.json()
        setProduct(data)
        setSelectedImage(0)

        const relatedResponse = await fetch(
          `https://dummyjson.com/products/category/${data.category}`
        )
        const relatedData = await relatedResponse.json()
        setRelatedProducts(
          relatedData.products.filter(p => p.id !== parseInt(unwrappedParams.id)).slice(0, 4)
        )
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductAndRelated()
  }, [unwrappedParams.id])

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: quantity,
        thumbnail: product.thumbnail
      }
    })
  }

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(product.stock, value))
    setQuantity(newQuantity)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
            <Image
              src={product.images[selectedImage]}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square w-24 flex-none rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-primary'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant="outline">{product.brand}</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{product.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => {
                  const rating = product.rating - index;
                  return rating >= 1 ? (
                    <Star key={index} className="w-5 h-5 fill-primary text-primary" />
                  ) : rating > 0 ? (
                    <StarHalf key={index} className="w-5 h-5 fill-primary text-primary" />
                  ) : (
                    <Star key={index} className="w-5 h-5 text-muted" />
                  );
                })}
              </div>
              <span className="text-muted-foreground">
                {product.rating.toFixed(1)} rating
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold">${product.price}</span>
              <span className="text-lg text-muted-foreground line-through">
                ${Math.round(product.price * (1 + product.discountPercentage / 100))}
              </span>
              <Badge variant="destructive" className="ml-2">
                {product.discountPercentage}% OFF
              </Badge>
            </div>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <Separator />

          <div className="space-y-6">
            <div className="flex items-center gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-none border-r"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="w-16 text-center focus:outline-none"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="h-10 w-10 rounded-none border-l"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium block mb-2">Availability</span>
                <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Badge>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full text-lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <h4 className="font-medium">Brand</h4>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
            </div>
            <div className="space-y-2">
              <Tags className="h-5 w-5 text-muted-foreground" />
              <h4 className="font-medium">Category</h4>
              <p className="text-sm text-muted-foreground">{product.category}</p>
            </div>
            <div className="space-y-2">
              <Box className="h-5 w-5 text-muted-foreground" />
              <h4 className="font-medium">Stock</h4>
              <p className="text-sm text-muted-foreground">{product.stock} units</p>
            </div>
          </div>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-bold">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group overflow-hidden">
                <Link href={`/product/${relatedProduct.id}`}>
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={relatedProduct.thumbnail}
                        alt={relatedProduct.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                        {relatedProduct.title}
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        ${relatedProduct.price}
                      </p>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}