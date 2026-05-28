"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

function RatingBadge({ value }) {
  return (
    <div className="inline-flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md text-[10px] font-black backdrop-blur-md">
      ⭐ {value?.toFixed(1)}
    </div>
  );
}

function Hero({ movie }) {
  if (!movie) return null;
  return (
    <section className="relative h-[65vh] min-h-[500px] overflow-hidden">
      <img
        src={`${IMG}/original${movie.backdrop_path}`}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex items-end pb-16">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-yellow-500 text-black text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded">
              All-Time Top Rated
            </span>
            <RatingBadge value={movie.vote_average} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
            {movie.title}
          </h1>
          <p className="text-white/60 text-sm leading-relaxed mb-8 line-clamp-3">
            {movie.overview}
          </p>
          <Link
            href={`/movie/${movie.id}`}
            className="inline-block bg-white text-black hover:bg-red-600 hover:text-white text-sm font-black px-8 py-3.5 rounded-xl transition-all duration-300"
          >
            View Masterpiece
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function TopRatedPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopRated() {
      try {
        const res = await fetch(`${BASE}/movie/top_rated?api_key=${API_KEY}`);
        const data = await res.json();
        setMovies(data.results);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopRated();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
          Curating Excellence
        </p>
      </div>
    );
  }

  const topMovie = movies[0];
  const remainingMovies = movies.slice(1);

  return (
    /* Added overflow-x-hidden to prevent the glow from breaking the mobile layout */
    <div className="min-h-screen bg-black text-white flex flex-col overflow-x-hidden">
      <div className="flex-grow">
        <Hero movie={topMovie} />

        <main className="max-w-6xl mx-auto px-6 pt-16 pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                The Gold Standard <span className="text-yellow-500">⭐</span>
              </h2>
              <p className="text-white/30 text-[11px] uppercase tracking-widest mt-1 font-bold">
                Highest rated by the global community
              </p>
            </div>
            <div className="h-px flex-1 bg-white/5 mx-8 hidden md:block" />
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
              TMDB Verified
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {remainingMovies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-neutral-900 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(234,179,8,0.15)]">
                  <img
                    src={`${IMG}/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                  <div className="absolute top-2 right-2">
                    <RatingBadge value={movie.vote_average} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-xs sm:text-sm line-clamp-1 mb-1">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-[10px]">
                        {movie.release_date?.slice(0, 4)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      {/* FOOTER SPACER FIX:
          - Added 'overflow-hidden' to the container.
          - Changed glow width to 'max-w-full' for mobile safety.
      */}
      <div className="relative w-full py-9 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-40 bg-yellow-500/[0.03] blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
