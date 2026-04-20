import { mockMovies } from "@/constant/mock";
import WatchLogItem from "./watch-log-item";

export default function WatchLogList() {
  const movies = mockMovies;

  return (
    <ul className="flex flex-col gap-2">
      {movies.map((movie, index) => (
        <WatchLogItem key={index} movie={movie} />
      ))}
    </ul>
  );
}
