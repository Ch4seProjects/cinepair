import { createClient } from "./supabase/client";

import {
  GetMyPairParams,
  GetPairMembersParams,
  GetMyPairResult,
  GetPairMembersResult,
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
  `,
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
      "user_id, profiles (display_name, avatar_url), id, pair_id, joined_at",
    )
    .eq("pair_id", pairId);

  return data ?? [];
}
