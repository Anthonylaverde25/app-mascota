import { Card } from '@/components/ui/card'
import { FileText, CalendarCheck, HeartHandshake } from 'lucide-react'

const features = [
    {
        icon: FileText,
        title: 'Historial Centralizado',
        description:
            'Mantén todas las vacunas, tratamientos y pesos de tu mascota en un solo lugar seguro y accesible.',
    },
    {
        icon: CalendarCheck,
        title: 'Recordatorios Automáticos',
        description:
            'Nunca olvides una cita importante, una vacuna o una dosis de medicamento con nuestras notificaciones.',
    },
    {
        icon: HeartHandshake,
        title: 'Comunidad Confiable',
        description:
            'Encuentra y conecta con los mejores veterinarios, paseadores y tiendas recomendados por otros dueños.',
    },
]

export function FeaturesSection() {
    return (
        <section className="py-20 bg-secondary dark:bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-headline font-bold mb-4">
                    Una App, Todo lo que Necesitas
                </h2>
                <p className="max-w-3xl mx-auto text-muted-foreground mb-12">
                    PawsHealth es la plataforma definitiva para gestionar la
                    salud y el bienestar de tus mascotas, conectándote con una
                    comunidad de profesionales y amantes de los animales.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {features.map((feature, index) => (
                        <Card key={index} className="p-6">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-headline font-semibold mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground">
                                {feature.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
