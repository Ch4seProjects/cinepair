# CinePair — MVP Feature Spec & Application Architecture

> A couples-first movie logging and discovery app built with Next.js + Supabase.
> Mobile-first. Two linked accounts. Private by default, shareable later.

---

## 1. Product Vision

CinePair is Letterboxd for two. Couples log movies they watch together, rate them individually (plus see a computed "couple score"), and get personalized movie suggestions based on their shared taste history. The experience is intimate and private first, with a future path toward a shareable couple profile.

---

## 2. Core Concepts

| Concept | Description |
|---|---|
| **User** | An individual account with their own profile and ratings |
| **Pair** | Two linked User accounts that form a couple |
| **Watch Log** | A movie entry logged under a Pair — both partners can rate it |
| **Couple Score** | Auto-computed average of both partners' individual ratings |
| **Watchlist** | A shared queue of movies the Pair wants to watch |
| **Suggestion** | A movie recommended based on the Pair's last 5 Watch Log entries |

---

## 3. MVP Features

### 3.1 Authentication & Pairing

- Email/password sign-up and login (Supabase Auth)
- After sign-up, user can either:
  - **Create a Pair** — generates a unique invite code/link
  - **Join a Pair** — enter a partner's invite code
- A user can only belong to one active Pair
- Pair status shown on home screen (e.g., "Paired with Maria ❤️")

### 3.2 Movie Search & Logging

- Search movies by title using the **TMDB API** (free tier)
- Movie detail shows poster, year, genre, overview (pulled from TMDB)
- Either partner can log a movie to the Pair's Watch Log
- When logging, the partner who logs it can:
  - Set the watch date (defaults to today)
  - Give their own star rating (1–5, half stars allowed)
  - Add an optional note (e.g., "watched this on our anniversary 🎂")
- The other partner is notified (in-app) and can add their own rating + note to the same log entry
- Couple Score = average of both ratings (shown once both have rated)

### 3.3 Watch Log (Shared Feed)

- Chronological feed of all movies the Pair has logged
- Each entry shows:
  - Movie poster + title + year
  - Watch date
  - Partner A rating + Partner B rating + Couple Score (if both rated)
  - Note snippet (expandable)
- Tap an entry to see full detail (both notes, full ratings, movie info)
- Either partner can edit or delete their own rating/note

### 3.4 Shared Watchlist

- Either partner can add a movie to the shared Watchlist
- Watchlist shows who added each movie and when
- Swipe-to-remove or mark as "watched" (moves to Watch Log)
- Simple sort: newest added / by genre / by TMDB popularity

### 3.5 Movie Suggestions

Two modes, both available:

**AI-Powered (based on taste history)**
- Triggered manually via a "Suggest a movie" button
- Sends the Pair's last 5 logged movie titles + both partners' ratings to an LLM (via a Supabase Edge Function calling the Anthropic API)
- Returns 3–5 movie suggestions with a one-line reason for each ("You both loved slow-burn thrillers like Parasite")
- Results are non-persistent — refreshed each time

**Mood/Vibe Filter**
- Quick-pick UI: user selects a mood ("Something funny", "Need a cry", "Edge of our seats", "Feel-good", "Mind-bending")
- Optionally pick a runtime preference (under 90 min / any / over 2 hrs)
- Fetches matching movies from TMDB's Discover endpoint filtered by genre + rating
- Shows a short curated list (6–10 results) the couple can swipe through and add directly to Watchlist

### 3.6 Couple Profile (Semi-Public, Phase 1.5)

- Each Pair has a `/pair/[slug]` public profile page (opt-in)
- Displays: couple name, number of movies watched together, Couple Score average, top genres, and a recent log excerpt (no personal notes shown publicly)
- Toggle in Settings to make the profile public or private (default: private)
- Shareable link ("Share our movie diary")

### 3.7 Notifications (In-App Only for MVP)

- "Your partner just rated [Movie]"
- "Your partner added [Movie] to the watchlist"
- "You have an unrated movie: [Movie]" (when partner logs but you haven't rated yet)
- Shown as a badge/notification bell in the top nav; no push notifications in MVP

---

## 4. Out of Scope for MVP

The following are explicitly deferred to keep the MVP lean:

- Push notifications
- Social feed / following other couples
- Comments or reactions from other users
- TV shows / non-movie media
- Streaming service availability ("where to watch")
- Import from Letterboxd
- Custom lists beyond Watchlist

---

## 5. Application Architecture

### 5.1 Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Mobile-first, SSR for profile pages |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| Backend / DB | Supabase (free tier) | Postgres, Auth, Storage, Edge Functions |
| Movie Data | TMDB API | Free, extensive, reliable |
| AI Suggestions | Anthropic API (claude-haiku) | Called from Edge Function, cost-efficient |
| Deployment | Vercel (free tier) | Works seamlessly with Next.js |

### 5.2 Database Schema

```sql
-- Users (extends Supabase auth.users)
profiles
  id            uuid  PK  references auth.users
  username      text  unique
  display_name  text
  avatar_url    text
  created_at    timestamptz

-- Pairs (couples)
pairs
  id            uuid  PK
  slug          text  unique  -- for public profile URL
  name          text          -- couple display name, e.g. "Jake & Maria"
  invite_code   text  unique
  is_public     boolean  default false
  created_at    timestamptz

-- Pair membership (max 2 per pair)
pair_members
  id         uuid  PK
  pair_id    uuid  references pairs
  user_id    uuid  references profiles
  joined_at  timestamptz

-- Movies (cached from TMDB to avoid repeated API calls)
movies
  id            uuid  PK
  tmdb_id       integer  unique
  title         text
  year          integer
  poster_url    text
  genres        text[]
  overview      text
  runtime_mins  integer
  tmdb_rating   decimal

-- Watch log entries
watch_logs
  id          uuid  PK
  pair_id     uuid  references pairs
  movie_id    uuid  references movies
  logged_by   uuid  references profiles  -- who created the entry
  watch_date  date
  created_at  timestamptz

-- Individual ratings (one per user per watch_log entry)
ratings
  id            uuid  PK
  watch_log_id  uuid  references watch_logs
  user_id       uuid  references profiles
  stars         decimal  check (stars >= 1 AND stars <= 5)  -- supports .5 increments
  note          text
  created_at    timestamptz
  updated_at    timestamptz

-- Computed couple score (view or generated column)
-- couple_score = AVG(stars) across both ratings for the same watch_log_id

-- Watchlist
watchlist_items
  id         uuid  PK
  pair_id    uuid  references pairs
  movie_id   uuid  references movies
  added_by   uuid  references profiles
  added_at   timestamptz

-- Notifications
notifications
  id         uuid  PK
  user_id    uuid  references profiles  -- recipient
  type       text  -- 'partner_rated', 'partner_added', 'unrated_reminder'
  payload    jsonb -- { movie_title, watch_log_id, actor_id, ... }
  is_read    boolean  default false
  created_at timestamptz
```

**Row Level Security (RLS) rules:**
- Users can only read/write data belonging to their own Pair
- Public pair profile (`/pair/[slug]`) is readable without auth when `is_public = true`

### 5.3 Project Structure

```
/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (app)/                    # Protected routes
│   │   ├── layout.tsx            # Bottom nav shell
│   │   ├── home/page.tsx         # Watch log feed
│   │   ├── log/
│   │   │   ├── new/page.tsx      # Search + log a movie
│   │   │   └── [id]/page.tsx     # Log entry detail
│   │   ├── watchlist/page.tsx
│   │   ├── suggest/page.tsx      # AI + mood suggestions
│   │   ├── notifications/page.tsx
│   │   └── settings/page.tsx
│   ├── pair/
│   │   └── [slug]/page.tsx       # Public couple profile
│   └── invite/
│       └── [code]/page.tsx       # Invite link handler
├── components/
│   ├── ui/                       # Base components (Button, Card, etc.)
│   ├── movies/                   # MovieCard, RatingStars, SearchModal
│   ├── pair/                     # PairStatus, CoupleScore
│   └── layout/                   # BottomNav, TopBar
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client
│   ├── tmdb.ts                   # TMDB API helpers
│   └── utils.ts
└── supabase/
    ├── functions/
    │   └── suggest-movies/       # Edge Function: calls Anthropic API
    └── migrations/               # SQL schema files
```

### 5.4 Key Data Flows

**Logging a movie:**
1. User searches → TMDB API returns results
2. User selects movie → app upserts into `movies` table (cache)
3. `watch_logs` row created, `ratings` row created for logging partner
4. Notification created for other partner
5. Other partner taps notification → adds their own `ratings` row
6. Frontend computes Couple Score client-side from both ratings

**AI Suggestions:**
1. Client calls Supabase Edge Function `/suggest-movies`
2. Edge Function queries last 5 `watch_logs` + `ratings` for the Pair
3. Builds a prompt: *"This couple recently watched: [titles + ratings]. Suggest 3-5 movies they'd both enjoy."*
4. Calls Anthropic API (claude-haiku-4-5) — low latency, low cost
5. Returns structured JSON: `[{ tmdb_id, title, reason }]`
6. Client fetches poster/details from TMDB for display

**Mood Suggestions:**
1. User picks mood → mapped to TMDB genre IDs + sort params
2. Direct TMDB Discover API call from client
3. Results filtered against already-watched movies in the Pair's log
4. Displayed as swipeable cards; "Add to Watchlist" button on each

### 5.5 Mobile-First UI Patterns

- Bottom navigation bar: Home / Watchlist / + (Log) / Suggest / Profile
- Floating action button for quick "Log a movie"
- Swipe gestures on watchlist items (swipe right = watched, swipe left = remove)
- Pull-to-refresh on the watch log feed
- Sticky movie search modal (sheet-style, slides up from bottom)
- Rating input as a tap-on-stars component, not a slider

---

## 6. API & External Services

| Service | Usage | Free Tier Limit |
|---|---|---|
| TMDB API | Movie search, details, discover | 50 req/sec, unlimited/month |
| Supabase | DB, Auth, Storage, Edge Functions | 500MB DB, 2GB bandwidth, 500K Edge Function invocations/month |
| Anthropic API | AI suggestions (via Edge Function) | Pay-per-use (haiku is very cheap ~$0.001 per suggestion call) |
| Vercel | Hosting | 100GB bandwidth/month |

**Cost note:** The Anthropic API is the only paid component. At 1 suggestion call per session and a small user base, cost will be negligible (fractions of a cent per call with claude-haiku).

---

## 7. Phased Roadmap

### Phase 1 — MVP (build this first)
- Auth, pairing via invite code
- Movie logging with individual ratings + notes
- Watch log feed
- Shared watchlist
- Mood-based suggestions (no AI yet, just TMDB Discover)
- In-app notifications

### Phase 2 — Smarts
- AI-powered suggestions via Edge Function + Anthropic API
- Couple Score computation + display
- Public couple profile page (opt-in)

### Phase 3 — Polish & Social
- Push notifications (web push or Expo if going native)
- Shareable couple profile link
- Stats page: genres breakdown, ratings over time, most-watched directors
- "Movie Night Picker" — both partners swipe yes/no on suggestions, match on overlap

---

## 8. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # Edge Functions only, never expose client-side

# TMDB
NEXT_PUBLIC_TMDB_API_KEY=

# Anthropic (used in Edge Function only)
ANTHROPIC_API_KEY=
```

---

*Generated for CinePair MVP — Next.js 14 + Supabase + TMDB + Anthropic*
