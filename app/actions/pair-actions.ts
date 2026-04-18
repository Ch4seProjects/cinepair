"use server";

import { createClient as createServerSideClient } from "@/lib/supabase/server";
import {
  CreatePairParams,
  JoinPairParams,
  CreatePairResult,
  JoinPairResult,
  GetMyPairResult,
  GetPairMembersResult,
  ActionResult,
  UpdatePairParams,
  UpdatePairResult,
} from "@/types";

export async function getMyPair(): Promise<ActionResult<GetMyPairResult>> {
  const supabase = await createServerSideClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("pair_members")
    .select(
      `
      pair_id,
      pairs (id, name, invite_code, slug, is_public, created_at),
      joined_at
    `
    )
    .eq("user_id", user?.id ?? "")
    .maybeSingle();

  if (error) {
    return {
      success: false,
      error: { code: error.code, message: error.message },
    };
  }

  return { success: true, data: data?.pairs ?? null };
}

export async function getPairMembers(): Promise<
  ActionResult<GetPairMembersResult>
> {
  const supabase = await createServerSideClient();

  const { data, error } = await supabase
    .from("pair_members")
    .select(
      "user_id, profiles (display_name, avatar_url), id, pair_id, joined_at"
    );

  if (error) {
    return {
      success: false,
      error: { code: error.code, message: error.message },
    };
  }

  return { success: true, data: data ?? [] };
}

// Create a new pair — makes the user the first member
export async function createPair({
  userId,
  displayName,
}: CreatePairParams): Promise<ActionResult<CreatePairResult>> {
  const supabase = await createServerSideClient();

  // 1. Create the pair row
  const { data: pair, error } = await supabase
    .from("pairs")
    .insert({ name: displayName ?? "Our Pair" })
    .select()
    .single();

  if (error) {
    if (error.code === "23505")
      return {
        success: false,
        error: {
          code: "23505",
          message: "A pair with that name already exists.",
        },
      };
    return {
      success: false,
      error: { code: error.code, message: error.message },
    };
  }

  // 2. Add creator as first member
  const { error: memberError } = await supabase
    .from("pair_members")
    .insert({ pair_id: pair.id, user_id: userId });

  if (memberError)
    return {
      success: false,
      error: { code: memberError.code, message: memberError.message },
    };

  return { success: true, data: pair, message: "Pair created successfully." };
}

// Join an existing pair via invite code
export async function joinPair({
  userId,
  inviteCode,
}: JoinPairParams): Promise<ActionResult<JoinPairResult>> {
  const supabase = await createServerSideClient();

  // 1. Look up the pair
  const { data: pair, error } = await supabase
    .from("pairs")
    .select("id")
    .eq("invite_code", inviteCode.toUpperCase().trim())
    .single();

  if (error || !pair)
    return {
      success: false,
      error: { code: "NOT_FOUND", message: "Invalid invite code." },
    };

  // 2. Join the pair
  const { error: joinError } = await supabase
    .from("pair_members")
    .insert({ pair_id: pair.id, user_id: userId });

  if (joinError) {
    if (joinError.code === "23505")
      return {
        success: false,
        error: { code: "23505", message: "You are already in a pair." },
      };
    if (joinError.code === "42501")
      // RLS violation
      return {
        success: false,
        error: { code: "PAIR_FULL", message: "This pair is already full." },
      };
    return {
      success: false,
      error: { code: joinError.code, message: joinError.message },
    };
  }

  return { success: true, data: pair, message: "Pair joined successfully." };
}

export async function updatePair({
  name,
}: UpdatePairParams): Promise<ActionResult<UpdatePairResult>> {
  const supabase = await createServerSideClient();

  // 1. Check pair exists
  const pairId = await supabase
    .from("pair_members")
    .select("pair_id")
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id ?? "")
    .maybeSingle();

  if (!pairId.data)
    return {
      success: false,
      error: { code: "NOT_FOUND", message: "You are not in a pair." },
    };

  // 2. Update pair name
  const { data, error } = await supabase
    .from("pairs")
    .update({ name: name.trim() })
    .eq("id", pairId.data.pair_id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505")
      return {
        success: false,
        error: {
          code: "23505",
          message: "A pair with that name already exists.",
        },
      };
    return {
      success: false,
      error: { code: error.code, message: error.message },
    };
  }

  return { success: true, data, message: "Pair updated successfully." };
}

export async function deletePair(): Promise<ActionResult<null>> {
  const supabase = await createServerSideClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Check pair exists
  const { data: member } = await supabase
    .from("pair_members")
    .select("pair_id")
    .eq("user_id", user?.id ?? "")
    .maybeSingle();

  if (!member)
    return {
      success: false,
      error: { code: "NOT_FOUND", message: "You are not in a pair." },
    };

  // 2. Delete pair
  const { error } = await supabase
    .from("pairs")
    .delete()
    .eq("id", member.pair_id);

  if (error)
    return {
      success: false,
      error: { code: error.code, message: error.message },
    };

  return { success: true, data: null };
}
