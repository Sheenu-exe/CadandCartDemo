"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = "https://dummyjson.com/products";
        const category = searchParams.get("category");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const rating = searchParams.get("rating");

        if (category) {
          url = `https://dummyjson.com/products/category/${category}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        let filteredProducts = data.products;

        if (minPrice) {
          filteredProducts = filteredProducts.filter(
            (p) => p.price >= Number(minPrice)
          );
        }
        if (maxPrice) {
          filteredProducts = filteredProducts.filter(
            (p) => p.price <= Number(maxPrice)
          );
        }
        if (rating) {
          filteredProducts = filteredProducts.filter(
            (p) => p.rating >= Number(rating)
          );
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
