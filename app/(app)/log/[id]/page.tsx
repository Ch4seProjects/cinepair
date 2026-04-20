import { mockMovies } from "@/constant/mock";
import { notFound } from "next/navigation";

export default async function LogDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = mockMovies.find((m) => m.id === id);

  if (!movie) notFound();

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
    </div>
  );
}
