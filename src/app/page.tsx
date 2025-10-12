'use client'

import { useEffect } from 'react'
import { useUser } from '@/firebase'
import {
    HeroSection,
    FeaturesSection,
    TestimonialsSection,
    LoadingSkeleton,
} from '@/components/pages/home'

export default function Home() {
    const { user, isUserLoading } = useUser()

    useEffect(() => {
        // We keep the logic to redirect if needed, but for now we'll show the page to everyone
        // if (!isUserLoading && !user) {
        //     router.push('/login')
        // }
    }, [user, isUserLoading])

    if (isUserLoading) {
        return <LoadingSkeleton />
    }

    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <TestimonialsSection />
        </>
    )
}
