import { PlaceHolderImages, type ImagePlaceholder } from './placeholder-images';
import { add, sub } from 'date-fns';

// Types
export interface Vaccine {
  id: string;
  tipoVacuna: string;
  fechaAplicacion: Date;
  fechaProximaDosis: Date;
  veterinario: string;
  lote?: string;
  etiquetaUrl?: string;
}

export interface Deworming {
  id: string;
  tipo: 'interna' | 'externa';
  fechaAplicacion: Date;
  fechaProximaDosis: Date;
  observaciones?: string;
}

export interface Treatment {
  id: string;
  nombreMedicamento: string;
  dosificacion: string;
  duracion: string;
  fechaInicio: Date;
  fechaFin?: Date;
}

export interface ReproductiveEvent {
  id: string;
  tipoEvento: 'Celo' | 'Parto' | 'Monta';
  fecha: Date;
  observaciones?: string;
}

export interface Weight {
  id: string;
  fecha: Date;
  peso: number;
}

export interface Pet {
  id: string;
  nombre: string;
  especie: 'Perro' | 'Gato' | 'Ave' | string;
  raza: string;
  fechaNacimiento: Date;
  sexo: 'Macho' | 'Hembra';
  color: string;
  fotoPerfil: ImagePlaceholder;
  vacunas: Vaccine[];
  desparasitaciones: Deworming[];
  tratamientos: Treatment[];
  eventosReproductivos: ReproductiveEvent[];
  pesos: Weight[];
}

export interface CalendarEvent {
  petName: string;
  petId: string;
  date: Date;
  type: 'Vacuna' | 'Desparasitación' | 'Tratamiento' | 'Celo' | 'Evento Reproductivo';
  description: string;
}

export const VACCINE_TYPES = {
  Perro: [
    { name: 'Rabia', mandatory: true },
    { name: 'Moquillo/Distemper', mandatory: true },
    { name: 'Parvovirus', mandatory: true },
    { name: 'Hepatitis Infecciosa', mandatory: true },
    { name: 'Leptospirosis', mandatory: true },
    { name: 'Tos de las perreras', mandatory: false },
  ],
  Gato: [
    { name: 'Rabia', mandatory: true },
    { name: 'Triple Felina (Panleucopenia, Rinotraqueitis, Calicivirus)', mandatory: true },
    { name: 'Leucemia Felina', mandatory: false },
  ]
};

// Mock Data
const MOCK_PETS: Pet[] = [
  {
    id: '1',
    nombre: 'Buddy',
    especie: 'Perro',
    raza: 'Golden Retriever',
    fechaNacimiento: new Date('2020-05-15'),
    sexo: 'Macho',
    color: 'Dorado',
    fotoPerfil: PlaceHolderImages.find(img => img.id === 'pet-1')!,
    vacunas: [
      { id: 'v1', tipoVacuna: 'Rabia', fechaAplicacion: new Date('2023-06-01'), fechaProximaDosis: new Date('2024-06-01'), veterinario: 'Dr. Smith', lote: 'RAB-123' },
      { id: 'v2', tipoVacuna: 'Moquillo/Distemper', fechaAplicacion: new Date('2023-06-01'), fechaProximaDosis: new Date('2024-06-01'), veterinario: 'Dr. Smith', lote: 'DIS-456' },
    ],
    desparasitaciones: [
      { id: 'd1', tipo: 'interna', fechaAplicacion: new Date('2023-03-10'), fechaProximaDosis: new Date('2024-06-10') },
    ],
    tratamientos: [
       { id: 't1', nombreMedicamento: 'Apoquel', dosificacion: '16mg una vez al día', duracion: '30 días', fechaInicio: new Date('2023-08-01') },
    ],
    eventosReproductivos: [],
    pesos: [
      { id: 'w1', fecha: new Date('2022-01-01'), peso: 30 },
      { id: 'w2', fecha: new Date('2022-07-01'), peso: 32 },
      { id: 'w3', fecha: new Date('2023-01-01'), peso: 33 },
      { id: 'w4', fecha: new Date('2023-07-01'), peso: 32.5 },
      { id: 'w5', fecha: new Date('2024-01-01'), peso: 34 },
    ],
  },
  {
    id: '2',
    nombre: 'Lucy',
    especie: 'Gato',
    raza: 'Siberiano',
    fechaNacimiento: new Date('2022-01-20'),
    sexo: 'Hembra',
    color: 'Gris',
    fotoPerfil: PlaceHolderImages.find(img => img.id === 'pet-2')!,
    vacunas: [
      { id: 'v3', tipoVacuna: 'Triple Felina (Panleucopenia, Rinotraqueitis, Calicivirus)', fechaAplicacion: new Date('2024-03-15'), fechaProximaDosis: new Date('2025-03-15'), veterinario: 'Dr. Smith', lote: 'FEL-789' },
    ],
    desparasitaciones: [
        { id: 'd2', tipo: 'externa', fechaAplicacion: new Date('2024-05-01'), fechaProximaDosis: new Date('2024-08-01') },
    ],
    tratamientos: [],
    eventosReproductivos: [
        { id: 'er1', tipoEvento: 'Celo', fecha: new Date('2023-09-05'), observaciones: 'Primer celo' },
        { id: 'er2', tipoEvento: 'Celo', fecha: new Date('2024-03-20'), observaciones: 'Celo de primavera' }
    ],
    pesos: [
      { id: 'w6', fecha: new Date('2022-04-01'), peso: 3 },
      { id: 'w7', fecha: new Date('2023-04-01'), peso: 4 },
      { id: 'w8', fecha: new Date('2024-04-01'), peso: 4.5 },
    ],
  },
  {
    id: '3',
    nombre: 'Rocky',
    especie: 'Perro',
    raza: 'Bulldog Francés',
    fechaNacimiento: new Date('2023-07-30'),
    sexo: 'Macho',
    color: 'Negro',
    fotoPerfil: PlaceHolderImages.find(img => img.id === 'pet-3')!,
    vacunas: [
      { id: 'v4', tipoVacuna: 'Parvovirus', fechaAplicacion: new Date('2023-09-15'), fechaProximaDosis: new Date('2024-09-15'), veterinario: 'Dr. Jones', lote: 'PAR-101' },
    ],
    desparasitaciones: [],
    tratamientos: [],
    eventosReproductivos: [],
    pesos: [],
  },
  {
    id: '4',
    nombre: 'Kiwi',
    especie: 'Ave',
    raza: 'Loro',
    fechaNacimiento: new Date('2019-11-10'),
    sexo: 'Hembra',
    color: 'Verde',
    fotoPerfil: PlaceHolderImages.find(img => img.id === 'pet-4')!,
    vacunas: [],
    desparasitaciones: [],
    tratamientos: [],
    eventosReproductivos: [],
    pesos: [],
  },
  {
    id: '5',
    nombre: 'Lola',
    especie: 'Perro',
    raza: 'Beagle',
    fechaNacimiento: new Date('2021-09-01'),
    sexo: 'Hembra',
    color: 'Tricolor',
    fotoPerfil: PlaceHolderImages.find(img => img.id === 'pet-5')!,
    vacunas: [],
    desparasitaciones: [],
    tratamientos: [],
    eventosReproductivos: [],
    pesos: [],
  },
];

// Data Access Functions
export function getPets(): Pet[] {
  return MOCK_PETS;
}

export function getPetById(id: string): Pet | undefined {
  return MOCK_PETS.find(pet => pet.id === id);
}

export function getCalendarEvents(): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    MOCK_PETS.forEach(pet => {
        pet.vacunas.forEach(v => {
            if (v.fechaProximaDosis > new Date()) {
                events.push({
                    petName: pet.nombre,
                    petId: pet.id,
                    date: v.fechaProximaDosis,
                    type: 'Vacuna',
                    description: `Próxima dosis: ${v.tipoVacuna}`
                });
            }
        });
        pet.desparasitaciones.forEach(d => {
            if (d.fechaProximaDosis > new Date()) {
                events.push({
                    petName: pet.nombre,
                    petId: pet.id,
                    date: d.fechaProximaDosis,
                    type: 'Desparasitación',
                    description: `Próxima desparasitación ${d.tipo}`
                });
            }
        });
    });
    return events;
}
