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
import { Card, CardContent } from '@/components/ui/card'
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
    Calendar,
    IdCard,
    Building,
    MoreHorizontal,
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
import { useAuthContext } from '@/context/Auth/AuthContext'

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
    website: z
        .string()
        .url({ message: 'Por favor, introduce una URL válida.' })
        .optional()
        .or(z.literal('')),
})

function EditServiceForm({ closeDialog }: { closeDialog: () => void }) {
    const { toast } = useToast()
    const form = useForm<z.infer<typeof serviceProfileSchema>>({
        resolver: zodResolver(serviceProfileSchema),
        defaultValues: {
            serviceName: 'Clínica Veterinaria Amigo Fiel',
            category: 'Veterinario',
            description:
                'Atención 24 horas, cirugía especializada y vacunación. Contamos con más de 15 años de experiencia.',
            location: 'Ciudad Capital, Av. Principal 123',
            phone: '+54 11 4555-1234',
            website: 'https://vet-amigofiel.com',
        },
    })

    function onSubmit(values: z.infer<typeof serviceProfileSchema>) {
        console.log(values)
        toast({
            title: 'Perfil Actualizado',
            description: 'La información de tu servicio ha sido guardada.',
        })
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

const jobData = [
    {
        department: 'Cirugía Veterinaria',
        division: 'Especialidades',
        manager: 'Dr. Carlos Méndez',
        hireDate: 'May 13, 2024',
        location: 'Buenos Aires, AR',
    },
    {
        department: 'Consultas Generales',
        division: 'Atención Primaria',
        manager: 'Dra. Ana Torres',
        hireDate: 'Sep 05, 2024',
        location: 'Córdoba, AR',
    },
    {
        department: 'Emergencias',
        division: 'Cuidados Intensivos',
        manager: 'Dr. Luis Ramírez',
        hireDate: 'Jun 08, 2023',
        location: 'Rosario, AR',
    },
]

const activityData = [
    {
        name: 'Dr. Juan Pérez',
        action: 'realizó una cirugía',
        date: 'Jul 13, 2024',
        time: '05:35 PM',
        avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
        name: 'Dra. María González',
        action: 'atendió consulta',
        date: 'Sep 08, 2024',
        time: '03:12 PM',
        avatar: 'https://i.pravatar.cc/150?img=45',
    },
    {
        name: 'Dr. Roberto Silva',
        action: 'actualizó expediente',
        date: 'Aug 15, 2023',
        time: '05:35 PM',
        avatar: 'https://i.pravatar.cc/150?img=33',
    },
]

const compensationData = [
    {
        amount: '862.00 USD',
        period: 'por mes',
        effectiveDate: 'May 10, 2015',
    },
    {
        amount: '1560.00 USD',
        period: 'por trimestre',
        effectiveDate: 'Jun 08, 2022',
    },
    {
        amount: '378.00 USD',
        period: 'por semana',
        effectiveDate: 'Jun 08, 2022',
    },
]

export default function ProfileVeterinariaPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <div className="min-h-screen bg-secondary/30 dark:bg-background">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold font-headline">
                        Perfil del Proveedor
                    </h1>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Empleado
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

                {/* Tabs */}
                <Tabs defaultValue="overview" className="mb-6">
                    <TabsList className="bg-transparent border-b rounded-none h-auto p-0 w-full justify-start">
                        <TabsTrigger
                            value="overview"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
                        >
                            Vista General
                        </TabsTrigger>
                        <TabsTrigger
                            value="compensation"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
                        >
                            Compensación
                        </TabsTrigger>
                        <TabsTrigger
                            value="emergency"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
                        >
                            Emergencias
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <div className="grid grid-cols-12 gap-6">
                            {/* Left Column - About */}
                            <div className="col-span-12 lg:col-span-3 space-y-6">
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
                                                Clínica Veterinaria Amigo Fiel
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                #VET249654
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-semibold mb-3">
                                                    Contacto
                                                </h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-muted-foreground text-xs">
                                                                Teléfono
                                                            </p>
                                                            <p className="font-medium">
                                                                (629) 555-0123
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-muted-foreground text-xs">
                                                                Email
                                                            </p>
                                                            <p className="font-medium text-xs break-all">
                                                                clinicavet.fiel@example.com
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t pt-4">
                                                <h3 className="text-sm font-semibold mb-3">
                                                    Dirección
                                                </h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-muted-foreground text-xs">
                                                                Dirección
                                                            </p>
                                                            <p className="font-medium">
                                                                390 Market
                                                                Street, Suite
                                                                200
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-muted-foreground text-xs">
                                                                Ciudad/Estado
                                                            </p>
                                                            <p className="font-medium">
                                                                Buenos Aires, AR
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-muted-foreground text-xs">
                                                                Código Postal
                                                            </p>
                                                            <p className="font-medium">
                                                                94102
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t pt-4">
                                                <h3 className="text-sm font-semibold mb-3">
                                                    Detalles del Equipo
                                                </h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <IdCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-muted-foreground text-xs">
                                                                Gerente General
                                                            </p>
                                                            <p className="font-medium">
                                                                Dr. Ricardo
                                                                Pérez
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-muted-foreground text-xs">
                                                                Fecha de
                                                                Fundación
                                                            </p>
                                                            <p className="font-medium">
                                                                Jan 05, 2010
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column - Job Information */}
                            <div className="col-span-12 lg:col-span-9 space-y-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">
                                                Staff Profesional
                                            </h3>
                                            <Button
                                                variant="link"
                                                className="text-primary hover:text-primary/80 p-0"
                                            >
                                                + Agregar Staff
                                            </Button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b text-left text-xs text-muted-foreground uppercase">
                                                        <th className="pb-3 font-medium">
                                                            Departamento
                                                        </th>
                                                        <th className="pb-3 font-medium">
                                                            División
                                                        </th>
                                                        <th className="pb-3 font-medium">
                                                            Responsable
                                                        </th>
                                                        <th className="pb-3 font-medium">
                                                            Fecha de
                                                            Contratación
                                                        </th>
                                                        <th className="pb-3 font-medium">
                                                            Ubicación
                                                        </th>
                                                        <th className="pb-3 font-medium"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    {jobData.map(
                                                        (job, index) => (
                                                            <tr
                                                                key={index}
                                                                className="border-b last:border-0"
                                                            >
                                                                <td className="py-4">
                                                                    {
                                                                        job.department
                                                                    }
                                                                </td>
                                                                <td className="py-4">
                                                                    {
                                                                        job.division
                                                                    }
                                                                </td>
                                                                <td className="py-4">
                                                                    {
                                                                        job.manager
                                                                    }
                                                                </td>
                                                                <td className="py-4">
                                                                    {
                                                                        job.hireDate
                                                                    }
                                                                </td>
                                                                <td className="py-4">
                                                                    {
                                                                        job.location
                                                                    }
                                                                </td>
                                                                <td className="py-4 text-right">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardContent className="p-6">
                                            <h3 className="text-lg font-semibold mb-4">
                                                Actividad Reciente
                                            </h3>
                                            <div className="space-y-4">
                                                {activityData.map(
                                                    (activity, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-start gap-3"
                                                        >
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage
                                                                    src={
                                                                        activity.avatar
                                                                    }
                                                                />
                                                                <AvatarFallback>
                                                                    {activity.name.charAt(
                                                                        0
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm">
                                                                    <span className="font-medium">
                                                                        {
                                                                            activity.name
                                                                        }
                                                                    </span>{' '}
                                                                    <span className="text-muted-foreground">
                                                                        {
                                                                            activity.action
                                                                        }
                                                                    </span>{' '}
                                                                    <span className="text-muted-foreground">
                                                                        el{' '}
                                                                        {
                                                                            activity.date
                                                                        }
                                                                    </span>
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {
                                                                        activity.time
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                                <Button
                                                    variant="link"
                                                    className="text-primary hover:text-primary/80 p-0 text-sm"
                                                >
                                                    Ver todo
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-6">
                                            <h3 className="text-lg font-semibold mb-4">
                                                Facturación Reciente
                                            </h3>
                                            <div className="space-y-4">
                                                {compensationData.map(
                                                    (comp, index) => (
                                                        <div
                                                            key={index}
                                                            className="border-b last:border-0 pb-4 last:pb-0"
                                                        >
                                                            <p className="text-lg font-semibold">
                                                                {comp.amount}{' '}
                                                                <span className="text-sm font-normal text-muted-foreground">
                                                                    {
                                                                        comp.period
                                                                    }
                                                                </span>
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Fecha efectiva
                                                                el{' '}
                                                                {
                                                                    comp.effectiveDate
                                                                }
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                                <Button
                                                    variant="link"
                                                    className="text-primary hover:text-primary/80 p-0 text-sm"
                                                >
                                                    Ver todo
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
