"use client";

import { Movie } from "@/types/movie";
import { useRouter } from "next/navigation";

export default function WatchLogItem({ movie }: { movie: Movie }) {
  const router = useRouter();
  return (
    <div
      className="border-2 border-green-600 cursor-pointer"
      onClick={() => router.push(`/log/${movie.id}`)}
    >
      {movie.title}
    </div>
  );
}
