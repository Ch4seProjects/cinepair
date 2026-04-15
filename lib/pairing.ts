import { createClient } from "./supabase/client";
import {
  GetMyPairParams,
  GetPairMembersParams,
  CreatePairParams,
  JoinPairParams,
  GetMyPairResult,
  GetPairMembersResult,
  CreatePairResult,
  JoinPairResult,
} from "@/types";

// Get current user's pair (null if unpaired)
export async function getMyPair({
  userId,
}: GetMyPairParams): Promise<GetMyPairResult> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pair_members")
    .select(
      `
    pair_id,
    pairs (id, name, invite_code, slug, is_public, created_at),
    joined_at
  `
    )
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data.pairs;
}

// Get both members of a pair with their profiles
export async function getPairMembers({
  pairId,
}: GetPairMembersParams): Promise<GetPairMembersResult> {
  const supabase = createClient();

  const { data } = await supabase
    .from("pair_members")
    .select(
      "user_id, profiles (display_name, avatar_url), id, pair_id, joined_at"
    )
    .eq("pair_id", pairId);

  return data ?? [];
}

// Create a new pair — makes the user the first member
export async function createPair({
  userId,
  displayName,
}: CreatePairParams): Promise<CreatePairResult> {
  const supabase = createClient();

  // 1. Create the pair row
  const { data: pair, error } = await supabase
    .from("pairs")
    .insert({ name: displayName ?? "Our Pair" })
    .select()
    .single();

  if (error) throw error;

  // 2. Add creator as first member
  const { error: memberError } = await supabase
    .from("pair_members")
    .insert({ pair_id: pair.id, user_id: userId });

  if (memberError) throw memberError;

  return pair; // pair.invite_code is the shareable code
}

// Join an existing pair via invite code
export async function joinPair({
  userId,
  inviteCode,
}: JoinPairParams): Promise<JoinPairResult> {
  const supabase = createClient();

  // 1. Look up the pair
  const { data: pair, error } = await supabase
    .from("pairs")
    .select("id")
    .eq("invite_code", inviteCode.toUpperCase().trim())
    .single();

  if (error || !pair) throw new Error("Invalid invite code.");

  // 2. Check pair isn't already full (max 2 members)
  const { count } = await supabase
    .from("pair_members")
    .select("*", { count: "exact", head: true })
    .eq("pair_id", pair.id);

  if (count && count >= 2) throw new Error("This pair is already full.");

  // 3. Join the pair
  const { error: joinError } = await supabase
    .from("pair_members")
    .insert({ pair_id: pair.id, user_id: userId });

  if (joinError) {
    // unique constraint on user_id = already in a pair
    if (joinError.code === "23505")
      throw new Error("You are already in a pair.");
    throw joinError;
  }

  return pair;
}
