import { SearchBar } from "@/components/search-bar"
import { PropertyCard } from "@/components/property-card"
import { getListings } from "@/lib/data"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { PropertyFilters } from "@/components/property-filters"

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get listings with filters from searchParams
  const listings = await getListings(searchParams)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Find your perfect stay</h1>
        <div className="bg-muted p-4 rounded-lg">
          <SearchBar />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0">
          <PropertyFilters />
        </aside>

        <div className="flex-1">
          <Suspense fallback={<ListingsSkeleton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.length > 0 ? (
                listings.map((property) => <PropertyCard key={property._id} property={property} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No listings found</h3>
                  <p className="text-muted-foreground">Try adjusting your search filters</p>
                </div>
              )}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function ListingsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
    </div>
  )
}
