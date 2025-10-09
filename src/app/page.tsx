'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@/firebase'

import { Button } from '@/components/ui/button'
import {
    Search,
    Stethoscope,
    Footprints,
    Store,
    MapPin,
    HeartHandshake,
    CalendarCheck,
    FileText,
    Star,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PlaceHolderImages } from '@/lib/placeholder-images'

const features = [
    {
        icon: FileText,
        title: 'Historial Centralizado',
        description: 'Mantén todas las vacunas, tratamientos y pesos de tu mascota en un solo lugar seguro y accesible.',
    },
    {
        icon: CalendarCheck,
        title: 'Recordatorios Automáticos',
        description: 'Nunca olvides una cita importante, una vacuna o una dosis de medicamento con nuestras notificaciones.',
    },
    {
        icon: HeartHandshake,
        title: 'Comunidad Confiable',
        description: 'Encuentra y conecta con los mejores veterinarios, paseadores y tiendas recomendados por otros dueños.',
    },
]

const testimonials = [
    {
        name: 'Ana García',
        role: 'Dueña de Max',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        rating: 5,
        comment: '¡PawsHealth ha sido un salvavidas! Ahora tengo todo el historial de mi perro Max en mi teléfono. Los recordatorios de vacunas son geniales.',
    },
    {
        name: 'Carlos Rodriguez',
        role: 'Dueño de Luna',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
        rating: 5,
        comment: 'Encontré un paseador increíble para Luna a través de la sección de comunidad. La app es súper fácil de usar y muy completa. ¡La recomiendo!',
    },
    {
        name: 'Veterinaria San Martín',
        role: 'Socio de la Comunidad',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
        rating: 5,
        comment: 'Como clínica, unirnos a la comunidad de PawsHealth nos ha dado una visibilidad increíble. La plataforma es ideal para conectar con dueños de mascotas.',
    },
]

export default function Home() {
    const { user, isUserLoading } = useUser()
    const router = useRouter()
    const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-main')

    useEffect(() => {
        // We keep the logic to redirect if needed, but for now we'll show the page to everyone
        // if (!isUserLoading && !user) {
        //     router.push('/login')
        // }
    }, [user, isUserLoading, router])

    if (isUserLoading) {
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

    const handleSearch = () => {
        router.push('/community')
    }

    return (
        <>
            {/* Section 1: Hero & Search */}
            <section className="relative w-full h-[calc(100vh-80px)] flex items-center justify-center">
                {heroImage && (
                    <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        data-ai-hint={heroImage.imageHint}
                        fill
                        className="object-cover object-center"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col items-center text-center text-white px-4">
                    <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-md">
                        El cuidado que tu mascota merece
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow">
                        Encuentra veterinarios, paseadores y tiendas cerca de ti.
                        Todo en un solo lugar.
                    </p>
                    <Card className="mt-8 p-4 w-full max-w-3xl bg-background/90 text-foreground shadow-2xl backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row gap-2">
                             <Select defaultValue="veterinario">
                                <SelectTrigger className="w-full md:w-[180px] text-sm">
                                    <SelectValue placeholder="Tipo de servicio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="veterinario">
                                        <div className="flex items-center">
                                            <Stethoscope className="mr-2 h-4 w-4" />
                                            Veterinario
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="paseador">
                                        <div className="flex items-center">
                                            <Footprints className="mr-2 h-4 w-4" />
                                            Paseador
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="tienda">
                                        <div className="flex items-center">
                                            <Store className="mr-2 h-4 w-4" />
                                            Tienda
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="relative flex-grow">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Ingresá tu ubicación"
                                    className="pl-10 w-full"
                                />
                            </div>
                            <Button
                                size="lg"
                                className="w-full md:w-auto"
                                onClick={handleSearch}
                            >
                                <Search className="mr-2 h-5 w-5" />
                                Buscar
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>

             {/* Section 2: App Description */}
            <section className="py-20 bg-secondary dark:bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-headline font-bold mb-4">Una App, Todo lo que Necesitas</h2>
                    <p className="max-w-3xl mx-auto text-muted-foreground mb-12">
                        PawsHealth es la plataforma definitiva para gestionar la salud y el bienestar de tus mascotas, conectándote con una comunidad de profesionales y amantes de los animales.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {features.map((feature, index) => (
                            <Card key={index} className="p-6">
                                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-headline font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Testimonials */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <h2 className="text-3xl font-headline font-bold text-center mb-12">Amado por Dueños y Profesionales</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="flex flex-col justify-between p-6">
                                <div>
                                    <div className="flex items-center mb-4">
                                        <Avatar className="h-12 w-12 mr-4">
                                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold">{testimonial.name}</h4>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground italic">&quot;{testimonial.comment}&quot;</p>
                                </div>
                                <div className="flex mt-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                            </Card>
                        ))}
                     </div>
                </div>
            </section>
        </>
    )
}

    