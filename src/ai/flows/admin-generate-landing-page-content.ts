'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating multiple creative variations of taglines or short descriptive texts for landing page sections.
 *
 * - adminGenerateLandingPageContent - A function that generates landing page content variations.
 * - AdminGenerateLandingPageContentInput - The input type for the adminGenerateLandingPageContent function.
 * - AdminGenerateLandingPageContentOutput - The return type for the adminGenerateLandingPageContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AdminGenerateLandingPageContentInputSchema = z.object({
  context: z.string().describe('The context or topic for which to generate content (e.g., "hero section tagline about 3D interactive experiences", "feature description for responsive design").'),
  numVariations: z.number().int().min(1).max(5).default(3).describe('The number of content variations to generate, between 1 and 5.'),
});
export type AdminGenerateLandingPageContentInput = z.infer<typeof AdminGenerateLandingPageContentInputSchema>;

const AdminGenerateLandingPageContentOutputSchema = z.array(z.string()).describe('An array of generated creative taglines or short descriptive texts.');
export type AdminGenerateLandingPageContentOutput = z.infer<typeof AdminGenerateLandingPageContentOutputSchema>;

export async function adminGenerateLandingPageContent(input: AdminGenerateLandingPageContentInput): Promise<AdminGenerateLandingPageContentOutput> {
  return adminGenerateLandingPageContentFlow(input);
}

const adminGenerateLandingPageContentPrompt = ai.definePrompt({
  name: 'adminGenerateLandingPageContentPrompt',
  input: { schema: AdminGenerateLandingPageContentInputSchema },
  output: { schema: AdminGenerateLandingPageContentOutputSchema },
  prompt: `You are an expert marketing copywriter specializing in creating compelling content for landing pages.

Generate {{numVariations}} distinct, creative, and engaging taglines or short descriptive texts for a landing page section based on the following context:

Context: """{{context}}"""

Each variation should be concise, impactful, and suitable for a modern website. Provide the output as a JSON array of strings, as defined by the output schema.`,
});

const adminGenerateLandingPageContentFlow = ai.defineFlow(
  {
    name: 'adminGenerateLandingPageContentFlow',
    inputSchema: AdminGenerateLandingPageContentInputSchema,
    outputSchema: AdminGenerateLandingPageContentOutputSchema,
  },
  async (input) => {
    const { output } = await adminGenerateLandingPageContentPrompt(input);
    return output!;
  }
);
