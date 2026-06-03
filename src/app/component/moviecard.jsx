"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const IMG = "https://image.tmdb.org/t/p";

export default function MovieCard({ movie }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const poster = movie.poster_path
    ? `${IMG}/w500${movie.poster_path}`
    : "/no-poster.jpg";

  const handleClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      router.push("/pages/login");
    } else {
      router.push(`/movie/${movie.id}`); // ✅ correct route
    }
  };

  return (
    <div
      className="group relative rounded-xl overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <div className="relative w-full aspect-[2/3] bg-neutral-900">
        <img
          src={poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div
          className={`absolute inset-0 flex items-center justify-center transition ${
            hovered ? "opacity-100" : "opacity-0"
          } bg-black/60`}
        >
          <span className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold">
            ▶ Watch
          </span>
        </div>
      </div>

      <div className="p-2">
        <p className="text-white text-sm truncate">{movie.title}</p>
      </div>
    </div>
  );
}
