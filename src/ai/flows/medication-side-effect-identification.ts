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
  medicationName: z.string().describe('The name of the medication.'),
  dosificacion: z.string().describe('The dosage of the medication.'),
  duracion: z.string().describe('The duration of the medication.'),
  additionalDetails: z
    .string()
    .optional()
    .describe('Any additional details about the treatment.'),
});
export type MedicationDetailsInput = z.infer<typeof MedicationDetailsInputSchema>;

const MedicationSideEffectsOutputSchema = z.object({
  potentialSideEffects: z
    .string()
    .describe('A list of potential side effects associated with the medication or treatment.'),
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
  prompt: `You are a veterinary expert. Your task is to identify potential side effects of a given medication or treatment for a pet.

  Medication Name: {{{medicationName}}}
  Dosage: {{{dosificacion}}}
  Duration: {{{duracion}}}
  Additional Details: {{{additionalDetails}}}

  Based on the information above, provide a detailed list of potential side effects the pet might experience. Be specific and provide as much information as possible.`,
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
