'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Briefcase,
    Plus,
    MapPin,
    Phone,
    Mail,
    Globe,
    Pencil
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

const serviceProfileSchema = z.object({
    serviceName: z
        .string()
        .min(3, { message: 'El nombre del servicio es requerido.' }),
    category: z.enum(['Veterinario', 'Paseador', 'Tienda']),
    description: z
        .string()
        .max(200, {
            message: 'La descripción no puede exceder los 200 caracteres.',
        })
        .optional(),
    location: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email({ message: 'Por favor, introduce una URL válida.' }).optional(),
    website: z
        .string()
        .url({ message: 'Por favor, introduce una URL válida.' })
        .optional()
        .or(z.literal('')),
})

function EditServiceForm({ closeDialog }: { closeDialog: () => void }) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof serviceProfileSchema>>({
        resolver: zodResolver(serviceProfileSchema),
        defaultValues: {
            serviceName: 'Clínica Veterinaria Amigo Fiel',
            category: 'Veterinario',
            description:
                'Atención 24 horas, cirugía especializada y vacunación. Contamos con más de 15 años de experiencia.',
            location: 'Ciudad Capital, Av. Principal 123',
            phone: '+54 11 4555-1234',
            email: 'contacto@vet-amigofiel.com',
            website: 'https://vet-amigofiel.com',
        },
    })

    function onSubmit(values: z.infer<typeof serviceProfileSchema>) {
        console.log(values)
        toast({
            title: "Perfil Actualizado",
            description: "La información de tu servicio ha sido guardada."
        });
        closeDialog()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="serviceName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Servicio</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ej: Veterinaria San Roque"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoría</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Veterinario">
                                            Veterinario
                                        </SelectItem>
                                        <SelectItem value="Paseador">
                                            Paseador
                                        </SelectItem>
                                        <SelectItem value="Tienda">
                                            Tienda
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción Breve</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe tu servicio en pocas palabras..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ubicación</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ej: Av. Principal 123, Ciudad"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teléfono de Contacto</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="(123) 456-7890"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email de Contacto</FormLabel>
                            <FormControl>
                                <Input placeholder="contacto@tu-servicio.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Sitio Web o Red Social (Opcional)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="https://tu-sitio.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end pt-4">
                    <Button type="submit">Guardar Perfil</Button>
                </div>
            </form>
        </Form>
    )
}

const activityData = [
    { name: 'Dr. Juan Pérez', action: 'atendió una emergencia.', time: 'hace 35 min', avatar: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Dra. María González', action: 'completó una cirugía.', time: 'hace 2 horas', avatar: 'https://i.pravatar.cc/150?img=45' },
    { name: 'Recepción', action: 'agendó una nueva cita.', time: 'hace 3 horas', avatar: 'https://i.pravatar.cc/150?img=3' },
]


export default function ProfileVeterinariaPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <div className="min-h-screen bg-secondary/30 dark:bg-background">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold font-headline">Perfil de Servicio</h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                             <Button>
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar Perfil
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                                <DialogTitle>
                                    Editar Perfil de Servicio
                                </DialogTitle>
                            </DialogHeader>
                            <EditServiceForm
                                closeDialog={() => setIsDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                <Tabs defaultValue="overview" className="mb-6">
                    <TabsList className="bg-transparent border-b rounded-none h-auto p-0 w-full justify-start">
                        <TabsTrigger
                            value="overview"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
                        >
                            Resumen
                        </TabsTrigger>
                        <TabsTrigger
                            value="team"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
                        >
                            Equipo
                        </TabsTrigger>
                        <TabsTrigger
                            value="services"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
                        >
                            Servicios
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center text-center mb-6">
                                            <Avatar className="h-24 w-24 mb-4">
                                                <AvatarImage src="https://images.unsplash.com/photo-1583224964986-6f5d68352654?w=400" />
                                                <AvatarFallback className="bg-primary/10">
                                                    <Briefcase className="h-12 w-12 text-primary" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <h2 className="text-xl font-bold mb-1">
                                                Clínica Amigo Fiel
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                Veterinaria
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-semibold mb-3">
                                                    Acerca de
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Atención 24 horas, cirugía especializada y vacunación. Con más de 15 años de experiencia.
                                                </p>
                                            </div>
                                            <div className="border-t pt-4">
                                                <h3 className="text-sm font-semibold mb-3">
                                                    Contacto
                                                </h3>
                                                <div className="space-y-3">
                                                     <div className="flex items-start gap-3 text-sm">
                                                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-muted-foreground text-xs">Ubicación</p>
                                                            <p className="font-medium">Ciudad Capital, Av. Principal 123</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-muted-foreground text-xs">Teléfono</p>
                                                            <p className="font-medium">+54 11 4555-1234</p>
                                                        </div>
                                                    </div>
                                                     <div className="flex items-start gap-3 text-sm">
                                                        <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-muted-foreground text-xs">Email</p>
                                                            <p className="font-medium text-xs break-all">contacto@vet-amigofiel.com</p>
                                                        </div>
                                                    </div>
                                                     <div className="flex items-start gap-3 text-sm">
                                                        <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-muted-foreground text-xs">Sitio Web</p>
                                                            <a href="#" className="font-medium text-primary hover:underline">vet-amigofiel.com</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Actividad Reciente</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {activityData.map(
                                                (activity, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={activity.avatar} />
                                                            <AvatarFallback>
                                                                {activity.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm">
                                                                <span className="font-medium">{activity.name}</span>{' '}
                                                                <span className="text-muted-foreground">{activity.action}</span>
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="team" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Equipo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Información sobre el equipo de la veterinaria (en construcción).</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                     <TabsContent value="services" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Servicios Ofrecidos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Detalles de los servicios ofrecidos (en construcción).</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
