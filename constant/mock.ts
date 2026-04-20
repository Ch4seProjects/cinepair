import { v4 as uuidv4 } from "uuid";
import { Movie } from "@/types/movie";

export const mockMovies: Movie[] = [
  {
    id: uuidv4(),
    tmdb_id: 27205,
    title: "Inception",
    year: 2010,
    poster_url:
      "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    genres: ["Action", "Science Fiction", "Adventure"],
    overview:
      "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    runtime_mins: 148,
    tmdb_rating: 8.4,
  },
  {
    id: uuidv4(),
    tmdb_id: 238,
    title: "The Godfather",
    year: 1972,
    poster_url:
      "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLeBHka4yL09.jpg",
    genres: ["Drama", "Crime"],
    overview:
      "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",
    runtime_mins: 175,
    tmdb_rating: 8.7,
  },
  {
    id: uuidv4(),
    tmdb_id: 603,
    title: "The Matrix",
    year: 1999,
    poster_url:
      "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    genres: ["Action", "Science Fiction"],
    overview:
      "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting against the powerful computers.",
    runtime_mins: 136,
    tmdb_rating: 8.2,
  },
  {
    id: uuidv4(),
    tmdb_id: 13,
    title: "Forrest Gump",
    year: 1994,
    poster_url:
      "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    genres: ["Comedy", "Drama", "Romance"],
    overview:
      "A man with a low IQ has accomplished great things in his life and been present during significant historic events through a series of happy accidents.",
    runtime_mins: 142,
    tmdb_rating: 8.5,
  },
  {
    id: uuidv4(),
    tmdb_id: 157336,
    title: "Interstellar",
    year: 2014,
    poster_url:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    genres: ["Adventure", "Drama", "Science Fiction"],
    overview:
      "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
    runtime_mins: 169,
    tmdb_rating: 8.4,
  },
  {
    id: uuidv4(),
    tmdb_id: 424,
    title: "Schindler's List",
    year: 1993,
    poster_url:
      "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    genres: ["Drama", "History", "War"],
    overview:
      "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during WWII.",
    runtime_mins: 195,
    tmdb_rating: 8.9,
  },
  {
    id: uuidv4(),
    tmdb_id: 278,
    title: "The Shawshank Redemption",
    year: 1994,
    poster_url:
      "https://image.tmdb.org/t/p/w500/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg",
    genres: ["Drama", "Crime"],
    overview:
      "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank State Penitentiary.",
    runtime_mins: 142,
    tmdb_rating: 8.7,
  },
  {
    id: uuidv4(),
    tmdb_id: 11,
    title: "Star Wars: A New Hope",
    year: 1977,
    poster_url:
      "https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
    genres: ["Adventure", "Action", "Science Fiction"],
    overview:
      "Princess Leia is captured and held hostage by the evil Imperial forces. Farm boy Luke Skywalker and roguish Han Solo must free the princess and save the galaxy.",
    runtime_mins: 121,
    tmdb_rating: 8.2,
  },
  {
    id: uuidv4(),
    tmdb_id: 680,
    title: "Pulp Fiction",
    year: 1994,
    poster_url:
      "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    genres: ["Thriller", "Crime"],
    overview:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of bandits intertwine in four tales of violence and redemption.",
    runtime_mins: 154,
    tmdb_rating: 8.5,
  },
  {
    id: uuidv4(),
    tmdb_id: 289,
    title: "Casablanca",
    year: 1942,
    poster_url:
      "https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg",
    genres: ["Drama", "Romance"],
    overview:
      "A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape French Morocco.",
    runtime_mins: 102,
    tmdb_rating: 8.0,
  },
];
