'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { Bell, Bug, HeartPulse, Pill, Syringe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const mockNotifications = [
  {
    pet: 'Buddy',
    event: 'Próxima vacuna de Rabia',
    dueDate: 'en 3 días',
    icon: Syringe,
    color: 'text-blue-500',
  },
  {
    pet: 'Lucy',
    event: 'Próxima desparasitación (externa)',
    dueDate: 'en 1 semana',
    icon: Bug,
    color: 'text-green-500',
  },
  {
    pet: 'Buddy',
    event: 'Fin de tratamiento con Apoquel',
    dueDate: 'en 10 días',
    icon: Pill,
    color: 'text-yellow-500',
  },
];

const reminderSettings = [
    { id: 'vaccine', label: 'Recordatorios de Vacunación', icon: Syringe },
    { id: 'deworming', label: 'Recordatorios de Desparasitación', icon: Bug },
    { id: 'treatment', label: 'Recordatorios de Tratamientos', icon: Pill },
    { id: 'reproductive', label: 'Registros de Eventos Reproductivos', icon: HeartPulse },
]

export default function NotificationsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-3/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-start space-x-4 p-4 rounded-lg border">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-1/4" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card className="lg:col-span-1 sticky top-20">
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-6 w-12" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Recordatorios y Notificaciones</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Próximos Recordatorios</CardTitle>
            <CardDescription>
                Estas son notificaciones de ejemplo para demostración.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockNotifications.map((notif, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className={`mt-1 p-2 bg-secondary rounded-full`}>
                    <notif.icon className={`h-5 w-5 ${notif.color}`} />
                </div>
                <div>
                    <p className="font-semibold">{notif.pet}: <span className="font-normal">{notif.event}</span></p>
                    <p className="text-sm text-muted-foreground">{notif.dueDate}</p>
                </div>
              </div>
            ))}
             {mockNotifications.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No hay próximos recordatorios.</p>
                </div>
             )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1 sticky top-20">
            <CardHeader>
                <CardTitle className="font-headline">Ajustes de Notificaciones</CardTitle>
                <CardDescription>
                    Gestiona qué recordatorios recibes.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {reminderSettings.map((setting, index) => (
                    <React.Fragment key={setting.id}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <setting.icon className="h-4 w-4 mr-3 text-muted-foreground" />
                                <label htmlFor={setting.id} className="text-sm font-medium">
                                    {setting.label}
                                </label>
                            </div>
                            <Switch id={setting.id} defaultChecked={index < 2} />
                        </div>
                        {index < reminderSettings.length - 1 && <Separator />}
                    </React.Fragment>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
