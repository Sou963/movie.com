"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

function DateBadge({ date }) {
  return (
    <div className="inline-flex items-center gap-1 bg-white/10 border border-white/20 text-white px-2.5 py-1 rounded-md text-[10px] font-black backdrop-blur-md">
      📅 {date}
    </div>
  );
}

function Hero({ movie }) {
  if (!movie) return null;

  return (
    <section className="relative h-[70vh] min-h-[550px] overflow-hidden">
      {/* Background Image */}
      <img
        src={`${IMG}/original${movie.backdrop_path}`}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Content Container (max-w-6xl) */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex items-end pb-16">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-red-600 text-white text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded">
              Anticipated
            </span>
            <DateBadge date={movie.release_date} />
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
            {movie.title}
          </h1>

          <p className="text-white/60 text-sm leading-relaxed mb-8 line-clamp-3">
            {movie.overview}
          </p>

          <div className="flex gap-4">
            <Link
              href={`/movie/${movie.id}`}
              className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105"
            >
              Watch Details
            </Link>
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold px-8 py-3.5 rounded-xl transition-colors">
              Set Reminder
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function UpcomingPage() {
  const [movies, setMovies] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpcoming() {
      try {
        const res = await fetch(`${BASE}/movie/upcoming?api_key=${API_KEY}`);
        const data = await res.json();
        setMovies(data.results);
        setHero(data.results?.[0]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUpcoming();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
          Scanning Future Releases
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Section */}
      <Hero movie={hero} />

      {/* Main Content (max-w-6xl) */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Coming Soon <span className="text-red-600">🚀</span>
            </h2>
            <p className="text-white/30 text-[11px] uppercase tracking-widest mt-1 font-bold">
              Mark your calendars for these premieres
            </p>
          </div>
          <div className="h-px flex-1 bg-white/5 mx-8 hidden md:block" />
          <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
            2024 - 2025 Schedule
          </span>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.slice(1).map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-neutral-900 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)]">
                {/* Poster */}
                <img
                  src={`${IMG}/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                {/* Info Container */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-xs sm:text-sm line-clamp-1 mb-1.5">
                    {movie.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="text-red-500 text-[10px] font-black uppercase tracking-tighter">
                      {new Date(movie.release_date).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </div>
                    <div className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] font-bold text-white/60">
                      COMING
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Subtle Footer Glow */}
      <div className="relative py-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-red-600/5 blur-3xl rounded-full" />
      </div>
    </div>
  );
}
