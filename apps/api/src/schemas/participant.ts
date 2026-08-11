import { z } from 'zod';

export const createParticipantSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.email().optional(),
});

export const participantSchema = z.object({
  id: z.number().int(),
  tripId: z.number().int(),
  name: z.string(),
  email: z.string().nullable(),
  isOwner: z.boolean(),
});

export type CreateParticipantInput = z.infer<typeof createParticipantSchema>;
export type ParticipantDto = z.infer<typeof participantSchema>;
