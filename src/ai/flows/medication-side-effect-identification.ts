'use server';
/**
 * @fileOverview Identifies potential side effects of a medication or treatment for a pet.
 *
 * - identifyMedicationSideEffects - A function that identifies potential side effects of a medication or treatment.
 * - MedicationDetailsInput - The input type for the identifyMedicationSideEffects function.
 * - MedicationSideEffectsOutput - The return type for the identifyMedicationSideEffects function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationDetailsInputSchema = z.object({
  medicationName: z.string().describe('El nombre del medicamento.'),
  dosificacion: z.string().describe('La dosis del medicamento.'),
  duracion: z.string().describe('La duración del medicamento.'),
  additionalDetails: z
    .string()
    .optional()
    .describe('Cualquier detalle adicional sobre el tratamiento.'),
});
export type MedicationDetailsInput = z.infer<typeof MedicationDetailsInputSchema>;

const MedicationSideEffectsOutputSchema = z.object({
  potentialSideEffects: z
    .string()
    .describe('Una lista de posibles efectos secundarios asociados con el medicamento o tratamiento.'),
});
export type MedicationSideEffectsOutput = z.infer<typeof MedicationSideEffectsOutputSchema>;

export async function identifyMedicationSideEffects(
  input: MedicationDetailsInput
): Promise<MedicationSideEffectsOutput> {
  return medicationSideEffectsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicationSideEffectsPrompt',
  input: {schema: MedicationDetailsInputSchema},
  output: {schema: MedicationSideEffectsOutputSchema},
  prompt: `Eres un experto veterinario. Tu tarea es identificar los posibles efectos secundarios de un medicamento o tratamiento para una mascota.

  Nombre del Medicamento: {{{medicationName}}}
  Dosis: {{{dosificacion}}}
  Duración: {{{duracion}}}
  Detalles Adicionales: {{{additionalDetails}}}

  Basado en la información anterior, proporciona una lista detallada de los posibles efectos secundarios que la mascota podría experimentar. Sé específico y proporciona la mayor cantidad de información posible.`,
});

const medicationSideEffectsFlow = ai.defineFlow(
  {
    name: 'medicationSideEffectsFlow',
    inputSchema: MedicationDetailsInputSchema,
    outputSchema: MedicationSideEffectsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
