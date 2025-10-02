'use client';

import { useState } from 'react';
import { HeartPulse, Pill, Syringe, Bug, Scale, Image as ImageIcon, CalendarDays, ChevronDown } from 'lucide-react';
import type { Pet, Vaccine, Deworming, Treatment, ReproductiveEvent, Weight } from '@/lib/data';
import { formatDate, cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { add, isBefore } from 'date-fns';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { VaccinationForm } from './vaccination-form';
import { DewormingForm } from './deworming-form';
import { TreatmentForm } from './treatment-form';
import { ReproductiveEventForm } from './reproductive-event-form';
import { WeightForm } from './weight-form';
import { WeightChart } from './weight-chart';
import { ReproductiveCalendar } from './reproductive-calendar';

type HealthRecordsTabsProps = {
  pet: Pet;
};

type DialogState = 'vaccine' | 'deworming' | 'treatment' | 'reproductive' | 'weight' | null;

const getVaccineStatus = (nextDoseDate: Date): { text: string, className: string } => {
    const today = new Date();
    const warningDate = add(today, { days: 30 });
  
    if (isBefore(new Date(nextDoseDate), today)) {
      return { text: 'Vencida', className: 'bg-destructive text-destructive-foreground' };
    }
    if (isBefore(new Date(nextDoseDate), warningDate)) {
      return { text: 'Próxima a Vencer', className: 'bg-yellow-500 text-yellow-900' };
    }
    return { text: 'Vigente', className: 'bg-green-500 text-green-900' };
};
  

export default function HealthRecordsTabs({ pet }: HealthRecordsTabsProps) {
  const [openDialog, setOpenDialog] = useState<DialogState>(null);

  const renderEmptyState = (text: string, dialog: DialogState) => (
    <div className="text-center py-10 border-2 border-dashed rounded-lg">
      <p className="text-muted-foreground mb-2">{text}</p>
      <Button variant="link" onClick={() => setOpenDialog(dialog)}>
        Añadir el primer registro
      </Button>
    </div>
  );

  return (
    <Dialog open={!!openDialog} onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
      <Tabs defaultValue="vaccinations" className='w-full'>
        <TabsList className={cn("grid w-full h-auto", pet.sexo === 'Hembra' ? 'grid-cols-2 md:grid-cols-6' : 'grid-cols-2 md:grid-cols-5')}>
          <TabsTrigger value="vaccinations"><Syringe className="w-4 h-4 mr-2"/>Vacunas</TabsTrigger>
          <TabsTrigger value="deworming"><Bug className="w-4 h-4 mr-2"/>Desparasitación</TabsTrigger>
          <TabsTrigger value="treatments"><Pill className="w-4 h-4 mr-2"/>Tratamientos</TabsTrigger>
          {pet.sexo === 'Hembra' && <TabsTrigger value="reproductive"><HeartPulse className="w-4 h-4 mr-2"/>Reproductivo</TabsTrigger>}
          <TabsTrigger value="weight"><Scale className="w-4 h-4 mr-2"/>Peso</TabsTrigger>
          {pet.sexo === 'Hembra' && <TabsTrigger value="reproductive-calendar"><CalendarDays className="w-4 h-4 mr-2"/>Calendario</TabsTrigger>}
        </TabsList>
        
        {/* Vaccinations Tab */}
        <TabsContent value="vaccinations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Historial de Vacunación</CardTitle>
              <Button onClick={() => setOpenDialog('vaccine')}>Añadir Vacuna</Button>
            </CardHeader>
            <CardContent>
              {pet.vacunas.length > 0 ? (
                <div className="space-y-4">
                  {pet.vacunas.map((vaccine: Vaccine) => {
                    const status = getVaccineStatus(vaccine.fechaProximaDosis);
                    return (
                      <div key={vaccine.id} className="border rounded-lg p-4 transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{vaccine.tipoVacuna}</h3>
                                <Badge variant="secondary" className={cn("mt-1 font-semibold", status.className)}>
                                  {status.text}
                                </Badge>
                            </div>
                           {vaccine.etiquetaUrl ? (
                              <Link href={vaccine.etiquetaUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm">
                                  <ImageIcon className="mr-2 h-4 w-4" /> Ver Etiqueta
                                </Button>
                              </Link>
                            ) : <div className='w-[124px]'></div>}
                        </div>
                        <Separator className="my-3" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm">
                            <div>
                                <p className="font-semibold text-muted-foreground">Próxima Dosis</p>
                                <p>{formatDate(vaccine.fechaProximaDosis)}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-muted-foreground">Última Aplicación</p>
                                <p>{formatDate(vaccine.fechaAplicacion)}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-muted-foreground">Dosis</p>
                                <p>{vaccine.dosisAplicadas && vaccine.dosisTotales ? `${vaccine.dosisAplicadas} de ${vaccine.dosisTotales}` : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-muted-foreground">Veterinario</p>
                                <p>{vaccine.veterinario}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-muted-foreground">Lote</p>
                                <p>{vaccine.lote || 'N/A'}</p>
                            </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : renderEmptyState('No se encontraron registros de vacunación.', 'vaccine')}
            </CardContent>
          </Card>
        </TabsContent>


        {/* Deworming Tab */}
        <TabsContent value="deworming">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Historial de Desparasitación</CardTitle>
              <Button onClick={() => setOpenDialog('deworming')}>Añadir Registro</Button>
            </CardHeader>
            <CardContent>
              {pet.desparasitaciones.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Próxima Dosis</TableHead>
                      <TableHead>Observaciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pet.desparasitaciones.map((d: Deworming) => (
                      <TableRow key={d.id}>
                        <TableCell className="capitalize">{d.tipo}</TableCell>
                        <TableCell>{formatDate(d.fechaAplicacion)}</TableCell>
                        <TableCell>{formatDate(d.fechaProximaDosis)}</TableCell>
                        <TableCell>{d.observaciones || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : renderEmptyState('No se encontraron registros de desparasitación.', 'deworming')}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treatments Tab */}
        <TabsContent value="treatments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Historial de Tratamientos</CardTitle>
              <Button onClick={() => setOpenDialog('treatment')}>Añadir Tratamiento</Button>
            </CardHeader>
            <CardContent>
              {pet.tratamientos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicamento</TableHead>
                      <TableHead>Dosis</TableHead>
                      <TableHead>Fecha de Inicio</TableHead>
                      <TableHead>Duración</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pet.tratamientos.map((t: Treatment) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.nombreMedicamento}</TableCell>
                        <TableCell>{t.dosificacion}</TableCell>
                        <TableCell>{formatDate(t.fechaInicio)}</TableCell>
                        <TableCell>{t.duracion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : renderEmptyState('No se encontraron registros de tratamientos.', 'treatment')}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reproductive Events Tab */}
        {pet.sexo === 'Hembra' && (
        <TabsContent value="reproductive">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Historial Reproductivo</CardTitle>
              <Button onClick={() => setOpenDialog('reproductive')}>Añadir Evento</Button>
            </CardHeader>
            <CardContent>
              {pet.eventosReproductivos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Observaciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pet.eventosReproductivos.map((e: ReproductiveEvent) => (
                      <TableRow key={e.id}>
                        <TableCell>{e.tipoEvento}</TableCell>
                        <TableCell>{formatDate(e.fecha)}</TableCell>
                        <TableCell>{e.observaciones || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : renderEmptyState('No se encontraron eventos reproductivos.', 'reproductive')}
            </CardContent>
          </Card>
        </TabsContent>
        )}

         {/* Weight Tab */}
        <TabsContent value="weight">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Historial de Peso</CardTitle>
              <Button onClick={() => setOpenDialog('weight')}>Añadir Registro de Peso</Button>
            </CardHeader>
            <CardContent>
              {pet.pesos.length > 0 ? (
                <>
                  <WeightChart data={pet.pesos} />
                  <Table className="mt-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Peso (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pet.pesos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map((w: Weight) => (
                        <TableRow key={w.id}>
                          <TableCell>{formatDate(w.fecha)}</TableCell>
                          <TableCell>{w.peso} kg</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : renderEmptyState('No se encontraron registros de peso.', 'weight')}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reproductive Calendar Tab */}
        {pet.sexo === 'Hembra' && (
        <TabsContent value="reproductive-calendar">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Calendario Reproductivo</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-2 md:p-6 max-w-none">
                <ReproductiveCalendar events={pet.eventosReproductivos} species={pet.especie} />
            </CardContent>
          </Card>
        </TabsContent>
        )}
      </Tabs>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline">
            {openDialog === 'vaccine' && 'Añadir Nueva Vacuna'}
            {openDialog === 'deworming' && 'Añadir Nuevo Registro de Desparasitación'}
            {openDialog === 'treatment' && 'Añadir Nuevo Tratamiento'}
            {openDialog === 'reproductive' && 'Añadir Nuevo Evento Reproductivo'}
            {openDialog === 'weight' && 'Añadir Nuevo Registro de Peso'}
          </DialogTitle>
        </DialogHeader>
        {openDialog === 'vaccine' && <VaccinationForm petSpecies={pet.especie} closeDialog={() => setOpenDialog(null)} />}
        {openDialog === 'deworming' && <DewormingForm closeDialog={() => setOpenDialog(null)} />}
        {openDialog === 'treatment' && <TreatmentForm closeDialog={() => setOpenDialog(null)} />}
        {openDialog === 'reproductive' && <ReproductiveEventForm closeDialog={() => setOpenDialog(null)} />}
        {openDialog === 'weight' && <WeightForm closeDialog={() => setOpenDialog(null)} />}
      </DialogContent>
    </Dialog>
  );
}
