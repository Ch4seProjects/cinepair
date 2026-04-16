import { z } from "zod";

export const joinPairSchema = z.object({
  inviteCode: z.string().min(6, "Invite code must be at least 6 characters"),
});

export const createPairSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
});

export type JoinPairFormData = z.infer<typeof joinPairSchema>;
export type CreatePairFormData = z.infer<typeof createPairSchema>;
