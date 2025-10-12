import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

const testimonials = [
    {
        name: 'Ana García',
        role: 'Dueña de Max',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        rating: 5,
        comment:
            '¡PawsHealth ha sido un salvavidas! Ahora tengo todo el historial de mi perro Max en mi teléfono. Los recordatorios de vacunas son geniales.',
    },
    {
        name: 'Carlos Rodriguez',
        role: 'Dueño de Luna',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
        rating: 5,
        comment:
            'Encontré un paseador increíble para Luna a través de la sección de comunidad. La app es súper fácil de usar y muy completa. ¡La recomiendo!',
    },
    {
        name: 'Veterinaria San Martín',
        role: 'Socio de la Comunidad',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
        rating: 5,
        comment:
            'Como clínica, unirnos a la comunidad de PawsHealth nos ha dado una visibilidad increíble. La plataforma es ideal para conectar con dueños de mascotas.',
    },
]

export function TestimonialsSection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-headline font-bold text-center mb-12">
                    Amado por Dueños y Profesionales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="flex flex-col justify-between p-6"
                        >
                            <div>
                                <div className="flex items-center mb-4">
                                    <Avatar className="h-12 w-12 mr-4">
                                        <AvatarImage
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                        />
                                        <AvatarFallback>
                                            {testimonial.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-semibold">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground italic">
                                    &quot;{testimonial.comment}&quot;
                                </p>
                            </div>
                            <div className="flex mt-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="h-5 w-5 text-yellow-400 fill-current"
                                    />
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
