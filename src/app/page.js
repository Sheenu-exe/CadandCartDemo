import FilterSidebar from "@/components/FilterSidebar"
import ProductGrid from "@/components/ProductsGrid"
export default function Home() {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <FilterSidebar />
      <ProductGrid />
    </div>
  )
}