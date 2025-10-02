'use client';

import { useState } from 'react';
import { HeartPulse, Pill, Syringe, Bug } from 'lucide-react';
import type { Pet, Vaccine, Deworming, Treatment, ReproductiveEvent } from '@/lib/data';
import { formatDate } from '@/lib/utils';
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
  DialogTrigger,
} from '@/components/ui/dialog';

import { VaccinationForm } from './vaccination-form';
import { DewormingForm } from './deworming-form';
import { TreatmentForm } from './treatment-form';
import { ReproductiveEventForm } from './reproductive-event-form';

type HealthRecordsTabsProps = {
  pet: Pet;
};

type DialogState = 'vaccine' | 'deworming' | 'treatment' | 'reproductive' | null;

export default function HealthRecordsTabs({ pet }: HealthRecordsTabsProps) {
  const [openDialog, setOpenDialog] = useState<DialogState>(null);

  const renderEmptyState = (text: string, dialog: DialogState) => (
    <div className="text-center py-10 border-2 border-dashed rounded-lg">
      <p className="text-muted-foreground mb-2">{text}</p>
      <Button variant="link" onClick={() => setOpenDialog(dialog)}>
        Add the first record
      </Button>
    </div>
  );

  return (
    <Dialog open={!!openDialog} onOpenChange={(isOpen) => !isOpen && setOpenDialog(null)}>
      <Tabs defaultValue="vaccinations">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="vaccinations"><Syringe className="w-4 h-4 mr-2"/>Vaccinations</TabsTrigger>
          <TabsTrigger value="deworming"><Bug className="w-4 h-4 mr-2"/>Deworming</TabsTrigger>
          <TabsTrigger value="treatments"><Pill className="w-4 h-4 mr-2"/>Treatments</TabsTrigger>
          <TabsTrigger value="reproductive"><HeartPulse className="w-4 h-4 mr-2"/>Reproductive</TabsTrigger>
        </TabsList>
        
        {/* Vaccinations Tab */}
        <TabsContent value="vaccinations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Vaccination History</CardTitle>
              <Button onClick={() => setOpenDialog('vaccine')}>Add Vaccine</Button>
            </CardHeader>
            <CardContent>
              {pet.vacunas.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vaccine</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Next Dose</TableHead>
                      <TableHead>Veterinarian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pet.vacunas.map((v: Vaccine) => (
                      <TableRow key={v.id}>
                        <TableCell>{v.tipoVacuna}</TableCell>
                        <TableCell>{formatDate(v.fechaAplicacion)}</TableCell>
                        <TableCell>{formatDate(v.fechaProximaDosis)}</TableCell>
                        <TableCell>{v.veterinario}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : renderEmptyState('No vaccination records found.', 'vaccine')}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deworming Tab */}
        <TabsContent value="deworming">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Deworming History</CardTitle>
              <Button onClick={() => setOpenDialog('deworming')}>Add Record</Button>
            </CardHeader>
            <CardContent>
              {pet.desparasitaciones.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Next Dose</TableHead>
                      <TableHead>Observations</TableHead>
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
              ) : renderEmptyState('No deworming records found.', 'deworming')}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treatments Tab */}
        <TabsContent value="treatments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Treatment History</CardTitle>
              <Button onClick={() => setOpenDialog('treatment')}>Add Treatment</Button>
            </CardHeader>
            <CardContent>
              {pet.tratamientos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Duration</TableHead>
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
              ) : renderEmptyState('No treatment records found.', 'treatment')}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reproductive Events Tab */}
        <TabsContent value="reproductive">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Reproductive History</CardTitle>
              <Button onClick={() => setOpenDialog('reproductive')}>Add Event</Button>
            </CardHeader>
            <CardContent>
              {pet.eventosReproductivos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Observations</TableHead>
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
              ) : renderEmptyState('No reproductive events found.', 'reproductive')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline">
            {openDialog === 'vaccine' && 'Add New Vaccine'}
            {openDialog === 'deworming' && 'Add New Deworming Record'}
            {openDialog === 'treatment' && 'Add New Treatment'}
            {openDialog === 'reproductive' && 'Add New Reproductive Event'}
          </DialogTitle>
        </DialogHeader>
        {openDialog === 'vaccine' && <VaccinationForm closeDialog={() => setOpenDialog(null)} />}
        {openDialog === 'deworming' && <DewormingForm closeDialog={() => setOpenDialog(null)} />}
        {openDialog === 'treatment' && <TreatmentForm closeDialog={() => setOpenDialog(null)} />}
        {openDialog === 'reproductive' && <ReproductiveEventForm closeDialog={() => setOpenDialog(null)} />}
      </DialogContent>
    </Dialog>
  );
}
