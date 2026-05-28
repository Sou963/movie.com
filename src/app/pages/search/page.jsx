"use client";

import { useState } from "react";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `${BASE}/search/movie?api_key=${API_KEY}&query=${query}`
      );
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-x-hidden">
      {/* Dynamic Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-red-600/[0.05] blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 flex-grow px-6 pt-24 pb-20 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <header className="mb-12 text-center md:text-left">
          <div className="inline-block bg-red-600 text-white text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded mb-4">
            Global Database
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-tight">
            Find Your Next <br className="hidden md:block" />
            <span className="text-red-600">Masterpiece.</span>
          </h1>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest max-w-lg">
            Search through millions of films, from cult classics to modern
            blockbusters.
          </p>
        </header>

        {/* Search Bar - Signature Style */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4 max-w-3xl mb-20"
        >
          <div className="relative flex-grow group">
            <input
              type="text"
              placeholder="Enter movie title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-8 py-5 rounded-2xl bg-neutral-900/40 border border-white/5 focus:outline-none focus:border-red-600/50 focus:ring-4 focus:ring-red-600/5 transition-all duration-500 placeholder:text-white/20 text-lg backdrop-blur-xl"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-red-600 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            className="bg-white text-black hover:bg-red-600 hover:text-white active:scale-95 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.1em] transition-all duration-500 shadow-2xl shadow-red-600/10"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Results Section Header */}
        {searched && !loading && (
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-xl font-black uppercase tracking-widest text-white/80">
              Results
            </h2>
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-white/20 text-[10px] font-bold">
              {movies.length} found
            </span>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
              <div className="relative bg-neutral-900/50 rounded-2xl overflow-hidden transition-all duration-700 group-hover:-translate-y-3 group-hover:shadow-[0_30px_60px_rgba(220,38,38,0.15)] border border-white/5">
                <div className="aspect-[2/3] w-full overflow-hidden">
                  <img
                    src={
                      movie.poster_path
                        ? `${IMG}/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Poster"
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>

                {/* Glass Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                <div className="p-4 relative">
                  <h2 className="text-sm font-bold truncate group-hover:text-red-500 transition-colors duration-300">
                    {movie.title}
                  </h2>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-tighter">
                      {movie.release_date
                        ? movie.release_date.split("-")[0]
                        : "Coming Soon"}
                    </p>
                    {movie.vote_average > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-[10px] font-black">
                          ⭐ {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results Empty State */}
        {!loading && searched && movies.length === 0 && (
          <div className="py-32 text-center border border-white/5 rounded-3xl bg-neutral-900/20 backdrop-blur-sm">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-white/60 font-bold uppercase tracking-widest text-sm italic">
              No results for "{query}"
            </h3>
            <p className="text-white/20 text-xs mt-2">
              Try checking the spelling or use broader keywords.
            </p>
          </div>
        )}
      </div>

      {/* Footer Distance Adjuster */}
      <div className="relative w-full h-32 md:h-48 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="w-[800px] h-32 bg-red-600/[0.03] blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
