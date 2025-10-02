'use client';

import { useState } from 'react';
import { HeartPulse, Pill, Syringe, Bug, Scale, Eye, Pencil, Trash2, ChevronDown, CheckCircle, Clock, AlertCircle, MoreHorizontal } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from '@/components/ui/badge';
import { add, isBefore, isPast } from 'date-fns';
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

const getVaccineStatus = (latestDose: Vaccine): { text: string, className: string, isComplete: boolean, isExpired: boolean } => {
    const today = new Date();
    const warningDate = add(today, { days: 30 });
    
    const isComplete = latestDose.dosisAplicadas === latestDose.dosisTotales || (!latestDose.dosisTotales && latestDose.dosisAplicadas === 1);
    
    if (isComplete) {
        if (isPast(latestDose.fechaProximaDosis)) {
            return { text: 'Refuerzo Vencido', className: 'bg-destructive text-destructive-foreground', isComplete: false, isExpired: true };
        }
        return { text: 'Completa', className: 'bg-green-600 text-white', isComplete: true, isExpired: false };
    }

    if (isPast(latestDose.fechaProximaDosis)) {
      return { text: 'Dosis Vencida', className: 'bg-destructive text-destructive-foreground', isComplete: false, isExpired: true };
    }
    if (isBefore(latestDose.fechaProximaDosis, warningDate)) {
      return { text: 'Próxima a Vencer', className: 'bg-yellow-500 text-yellow-900', isComplete: false, isExpired: false };
    }
    return { text: 'Vigente', className: 'bg-blue-500 text-white', isComplete: false, isExpired: false };
};
  

const groupVaccines = (vaccines: Vaccine[]) => {
  return vaccines.reduce((acc, vaccine) => {
    (acc[vaccine.tipoVacuna] = acc[vaccine.tipoVacuna] || []).push(vaccine);
    acc[vaccine.tipoVacuna].sort((a, b) => new Date(b.fechaAplicacion).getTime() - new Date(a.fechaAplicacion).getTime());
    return acc;
  }, {} as Record<string, Vaccine[]>);
};
  

export default function HealthRecordsTabs({ pet }: HealthRecordsTabsProps) {
  const [openDialog, setOpenDialog] = useState<DialogState>(null);
  const groupedVaccines = groupVaccines(pet.vacunas);

  const vaccineSummary = Object.values(groupedVaccines).reduce(
    (acc, doses) => {
        const latestDose = doses[0];
        const { isComplete, isExpired } = getVaccineStatus(latestDose);

        if (isComplete) {
            acc.completed++;
        } else if (isExpired) {
            acc.expired++;
        } else {
            acc.pending++;
        }
        return acc;
    },
    { completed: 0, pending: 0, expired: 0 }
  );

  const summaryItems = [
    { label: 'Completas', count: vaccineSummary.completed, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Pendientes', count: vaccineSummary.pending, icon: Clock, color: 'text-blue-500' },
    { label: 'Vencidas', count: vaccineSummary.expired, icon: AlertCircle, color: 'text-destructive' },
  ];

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
        <TabsList className="grid w-full h-auto grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="vaccinations"><Syringe className="w-4 h-4 mr-2"/>Vacunas</TabsTrigger>
          <TabsTrigger value="deworming"><Bug className="w-4 h-4 mr-2"/>Desparasit.</TabsTrigger>
          <TabsTrigger value="treatments"><Pill className="w-4 h-4 mr-2"/>Tratamientos</TabsTrigger>
          {pet.sexo === 'Hembra' && <TabsTrigger value="reproductive"><HeartPulse className="w-4 h-4 mr-2"/>Reproductivo</TabsTrigger>}
          <TabsTrigger value="weight"><Scale className="w-4 h-4 mr-2"/>Peso</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vaccinations">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="font-headline">Historial de Vacunación</CardTitle>
              <Button onClick={() => setOpenDialog('vaccine')} className="w-full sm:w-auto">Añadir Dosis</Button>
            </CardHeader>
            <CardContent>
             {Object.keys(groupedVaccines).length > 0 ? (
                 <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {summaryItems.map((item) => (
                        <div key={item.label} className="p-3 bg-muted rounded-lg flex items-center border">
                            <item.icon className={cn("h-6 w-6 mr-3", item.color)} />
                            <div>
                                <p className="text-xl sm:text-2xl font-bold">{item.count}</p>
                                <p className="text-xs text-muted-foreground">{item.label}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                      {Object.entries(groupedVaccines).map(([vaccineType, doses]) => {
                        const latestDose = doses[0];
                        const status = getVaccineStatus(latestDose);
                        const totalApplied = doses.length;
                        const totalDoses = latestDose.dosisTotales || 1;
                        return (
                          <Collapsible key={vaccineType} className="border rounded-lg">
                            <CollapsibleTrigger className="w-full p-4 hover:bg-muted/50 transition-colors rounded-t-lg">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
                                <div className="text-left">
                                  <h3 className="font-bold text-lg">{vaccineType}</h3>
                                  <Badge variant="secondary" className={cn("mt-1 font-semibold", status.className)}>
                                    {status.text}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                                   <div className="text-left sm:text-right">
                                    <p className="text-sm font-semibold">{totalApplied} de {totalDoses} dosis</p>
                                    <p className="text-xs text-muted-foreground">Próx: {formatDate(latestDose.fechaProximaDosis)}</p>
                                   </div>
                                   <ChevronDown className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
                                </div>
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="p-4 border-t space-y-4">
                                <h4 className="font-semibold">Historial de Dosis</h4>
                                {doses.map((dose) => (
                                  <div key={dose.id} className="p-3 bg-muted/30 rounded-md border">
                                     <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-semibold">Dosis {doses.length - doses.indexOf(dose)}</p>
                                          <p className="text-sm text-muted-foreground">Aplicada: {formatDate(dose.fechaAplicacion)}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          {dose.etiquetaUrl && (
                                              <Link href={dose.etiquetaUrl} target="_blank" rel="noopener noreferrer">
                                                  <Button variant="ghost" size="icon">
                                                      <Eye className="h-5 w-5" />
                                                      <span className="sr-only">Ver Etiqueta</span>
                                                  </Button>
                                              </Link>
                                          )}
                                          <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                  <Button variant="ghost" size="icon">
                                                      <MoreHorizontal className="h-5 w-5" />
                                                      <span className="sr-only">Más opciones</span>
                                                  </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end">
                                                  <DropdownMenuItem>
                                                      <Pencil className="mr-2 h-4 w-4" />
                                                      Editar
                                                  </DropdownMenuItem>
                                                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                      <Trash2 className="mr-2 h-4 w-4" />
                                                      Eliminar
                                                  </DropdownMenuItem>
                                              </DropdownMenuContent>
                                          </DropdownMenu>
                                      </div>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="text-xs space-y-1">
                                        <p><span className="font-medium text-muted-foreground">Veterinario:</span> {dose.veterinario}</p>
                                        {dose.lote && <p><span className="font-medium text-muted-foreground">Lote:</span> <span className="font-bold">{dose.lote}</span></p>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )
                      })}
                    </div>
                </>
              ) : renderEmptyState('No se encontraron registros de vacunación.', 'vaccine')}
            </CardContent>
          </Card>
        </TabsContent>


        {/* Deworming Tab */}
        <TabsContent value="deworming">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="font-headline">Historial de Desparasitación</CardTitle>
              <Button onClick={() => setOpenDialog('deworming')} className="w-full sm:w-auto">Añadir Registro</Button>
            </CardHeader>
            <CardContent>
              {pet.desparasitaciones.length > 0 ? (
                <div className="overflow-x-auto">
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
                            <TableCell className="min-w-[150px]">{d.observaciones || 'N/A'}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
              ) : renderEmptyState('No se encontraron registros de desparasitación.', 'deworming')}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treatments Tab */}
        <TabsContent value="treatments">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="font-headline">Historial de Tratamientos</CardTitle>
              <Button onClick={() => setOpenDialog('treatment')} className="w-full sm:w-auto">Añadir Tratamiento</Button>
            </CardHeader>
            <CardContent>
              {pet.tratamientos.length > 0 ? (
                <div className="overflow-x-auto">
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
                </div>
              ) : renderEmptyState('No se encontraron registros de tratamientos.', 'treatment')}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reproductive Events Tab */}
        {pet.sexo === 'Hembra' && (
        <TabsContent value="reproductive">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="font-headline">Historial Reproductivo</CardTitle>
              <Button onClick={() => setOpenDialog('reproductive')} className="w-full sm:w-auto">Añadir Evento</Button>
            </CardHeader>
            <CardContent>
              {pet.eventosReproductivos.length > 0 ? (
                <div className="overflow-x-auto">
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
                            <TableCell className="min-w-[150px]">{e.observaciones || 'N/A'}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
              ) : renderEmptyState('No se encontraron eventos reproductivos.', 'reproductive')}
            </CardContent>
          </Card>
        </TabsContent>
        )}

         {/* Weight Tab */}
        <TabsContent value="weight">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="font-headline">Historial de Peso</CardTitle>
              <Button onClick={() => setOpenDialog('weight')} className="w-full sm:w-auto">Añadir Peso</Button>
            </CardHeader>
            <CardContent>
              {pet.pesos.length > 0 ? (
                <>
                  <WeightChart data={pet.pesos} />
                  <div className="overflow-x-auto mt-4">
                    <Table>
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
                  </div>
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
            <CardContent className="max-w-none">
                <ReproductiveCalendar events={pet.eventosReproductivos} species={pet.especie} />
            </CardContent>
          </Card>
        </TabsContent>
        )}
      </Tabs>
      
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {openDialog === 'vaccine' && 'Añadir Nueva Dosis de Vacuna'}
            {openDialog === 'deworming' && 'Añadir Desparasitación'}
            {openDialog === 'treatment' && 'Añadir Nuevo Tratamiento'}
            {openDialog === 'reproductive' && 'Añadir Evento Reproductivo'}
            {openDialog === 'weight' && 'Añadir Registro de Peso'}
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