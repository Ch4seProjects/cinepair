// ============================================================
// CinePair — Pairing Feature Types
// Covers: joined query shapes, helper function params & returns,
// and UI state for the pairing flow.
// ============================================================

import type { Pair, PairMember, Profile } from "./database";

// ------------------------------------------------------------
// Joined / enriched types (Supabase nested select results)
// ------------------------------------------------------------

/** pair_members row joined with its pairs row — returned by getMyPair */
export interface PairMemberWithPair extends PairMember {
  pairs: Pair;
}

/** pair_members row joined with the member's profile — returned by getPairMembers */
export interface PairMemberWithProfile extends PairMember {
  profiles: Pick<Profile, "display_name" | "avatar_url"> | null;
}

// ------------------------------------------------------------
// Helper function — param types
// ------------------------------------------------------------

/** getMyPair params */
export interface GetMyPairParams {
  /** UUID of the currently authenticated user */
  userId: string;
}

/** getPairMembers params */
export interface GetPairMembersParams {
  /** UUID of the pair to fetch members for */
  pairId: string;
}

/** createPair params */
export interface CreatePairParams {
  /** UUID of the authenticated user creating the pair */
  userId: string;
  /**
   * Optional display name for the couple, e.g. "Jake & Maria".
   * Defaults to "Our Pair" if omitted.
   */
  displayName?: string;
}

/** joinPair params */
export interface JoinPairParams {
  /** UUID of the authenticated user joining the pair */
  userId: string;
  /**
   * The 8-character invite code shared by the pair creator.
   * Case-insensitive — normalised internally.
   */
  inviteCode: string;
}

// ------------------------------------------------------------
// Helper function — return types
// ------------------------------------------------------------

/** Returned by getMyPair — null when the user is not yet in a pair */
export type GetMyPairResult = Pair | null;

/** Returned by getPairMembers */
export type GetPairMembersResult = PairMemberWithProfile[];

/** Returned by createPair — includes invite_code to share with partner */
export type CreatePairResult = Pair;

/** Returned by joinPair */
export type JoinPairResult = Pick<Pair, "id">;

// ------------------------------------------------------------
// UI state
// ------------------------------------------------------------

export type PairingStatus =
  | "loading" // checking pair status on mount
  | "unpaired" // user has no pair yet
  | "waiting" // user created a pair, waiting for partner to join
  | "paired" // both members present
  | "error"; // something went wrong

export interface PairingState {
  status: PairingStatus;
  pair: Pair | null;
  members: PairMemberWithProfile[];
  error: string | null;
}
