export type Movie = {
  id: string;
  tmdb_id: number;
  title: string;
  year: number;
  poster_url: string;
  genres: string[];
  overview: string;
  runtime_mins: number;
  tmdb_rating: number;
};
