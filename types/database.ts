export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Pair {
  id: string;
  slug: string | null;
  name: string | null;
  invite_code: string;
  is_public: boolean;
  created_at: string;
}

export interface PairMember {
  id: string;
  pair_id: string;
  user_id: string;
  joined_at: string;
}
