"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

function Rating({ value }) {
  return (
    <div className="inline-flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md">
      ⭐ {value?.toFixed(1)}
    </div>
  );
}

function MovieCard({ movie }) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="group relative overflow-hidden rounded-xl bg-neutral-900 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(220,38,38,0.15)]">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={`${IMG}/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Overlay - Smoother gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

          {/* Rating */}
          <div className="absolute top-2 right-2">
            <Rating value={movie.vote_average} />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h2 className="text-white font-bold text-xs sm:text-sm line-clamp-1 mb-0.5">
              {movie.title}
            </h2>
            <p className="text-white/40 text-[10px] mb-2">
              {movie.release_date?.slice(0, 4)}
            </p>

            <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300">
              <button className="w-full bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold py-2 rounded-lg transition-colors">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Hero({ movie }) {
  if (!movie) return null;

  return (
    <section className="relative h-[75vh] min-h-[550px] overflow-hidden">
      {/* Background with subtle zoom effect */}
      <img
        src={`${IMG}/original${movie.backdrop_path}`}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover scale-105 animate-pulse-slow"
      />

      {/* Overlays to match footer vibe */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Content restricted to max-w-6xl */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex items-end pb-16">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block bg-red-600 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-md">
              Trending Today
            </span>
            <Rating value={movie.vote_average} />
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
            {movie.title}
          </h1>

          <p className="text-white/60 text-sm leading-relaxed mb-8 line-clamp-3 max-w-lg">
            {movie.overview}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={`/movie/${movie.id}`}
              className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105"
            >
              Watch Now
            </Link>
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold px-8 py-3.5 rounded-xl backdrop-blur-md transition-all">
              + Watchlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TrendingPage() {
  const [movies, setMovies] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch(
          `${BASE}/trending/movie/day?api_key=${API_KEY}`
        );
        const data = await res.json();
        setMovies(data.results);
        setHero(data.results[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
          Loading Universe
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      <Hero movie={hero} />

      {/* Main Content Container - Aligned to max-w-6xl */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              Trending Now <span className="text-red-600 text-xl">🔥</span>
            </h2>
            <p className="text-white/30 text-xs mt-1 uppercase tracking-wider font-medium">
              Top picks for you today
            </p>
          </div>
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full border border-white/5">
            Updated Hourly • TMDB
          </div>
        </div>

        {/* Grid adjusted for 6xl width */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {movies.slice(1).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Bottom Banner adjusted to max-w-6xl */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/50 p-10 sm:p-16">
          {/* Subtle decorative glow to match footer */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-xl text-center md:text-left">
            <span className="text-red-500 text-[10px] font-black tracking-[0.2em] uppercase">
              The Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-6 leading-tight">
              Cinematic magic in <br /> the palm of your hand.
            </h2>
            <button className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-8 py-3.5 rounded-xl transition-transform hover:scale-105">
              Explore All Categories
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
