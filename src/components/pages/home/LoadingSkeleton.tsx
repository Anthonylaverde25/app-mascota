import { Skeleton } from '@/components/ui/skeleton'

export function LoadingSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-[60vh] w-full rounded-lg" />
            <div className="py-12">
                <Skeleton className="h-12 w-1/2 mx-auto" />
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    )
}
