"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

const GENRES = [
  { id: null, label: "All" },
  { id: 28, label: "Action" },
  { id: 35, label: "Comedy" },
  { id: 27, label: "Horror" },
  { id: 10749, label: "Romance" },
  { id: 878, label: "Sci-Fi" },
  { id: 18, label: "Drama" },
  { id: 16, label: "Animation" },
  { id: 53, label: "Thriller" },
];

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl overflow-hidden bg-neutral-900">
      <div className="w-full h-64 bg-neutral-800" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-neutral-700 rounded w-3/4" />
        <div className="h-3 bg-neutral-800 rounded w-1/3" />
      </div>
    </div>
  );
}

function StarRating({ score }) {
  const pct = Math.round((score / 10) * 100);
  const color = score >= 7.5 ? "#22c55e" : score >= 6 ? "#eab308" : "#ef4444";
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full border"
      style={{ color, borderColor: color + "55", background: color + "18" }}
    >
      ★ {score.toFixed(1)}
    </span>
  );
}

function MovieCard({ movie }) {
  const [hovered, setHovered] = useState(false);
  const poster = movie.poster_path
    ? `${IMG}/w500${movie.poster_path}`
    : "/no-poster.jpg";
  const backdrop = movie.backdrop_path
    ? `${IMG}/w780${movie.backdrop_path}`
    : null;

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative rounded-xl overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="group relative rounded-xl overflow-hidden cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform: hovered ? "translateY(-6px) scale(1.02)" : "none",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: hovered
            ? "0 24px 48px rgba(0,0,0,0.7)"
            : "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        {/* Poster */}
        <div className="relative w-full aspect-[2/3] bg-neutral-900">
          <img
            src={poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient overlay always */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

          {/* Rating badge top-right */}
          <div className="absolute top-2 right-2">
            <StarRating score={movie.vote_average} />
          </div>

          {/* Hover overlay */}
          <div
            className="absolute inset-0 flex flex-col justify-end p-3 transition-opacity duration-300"
            style={{
              opacity: hovered ? 1 : 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.7) 60%, transparent 100%)",
            }}
          >
            {backdrop && (
              <div
                className="absolute inset-0 -z-10 transition-opacity duration-500"
                style={{ opacity: hovered ? 0.18 : 0 }}
              >
                <img
                  src={`${IMG}/w780${movie.backdrop_path}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="text-white/75 text-[11px] leading-relaxed line-clamp-3 mb-2">
              {movie.overview || "No overview available."}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="bg-red-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                ▶ Details
              </span>
              <span className="text-white/40 text-[10px]">
                {movie.release_date?.slice(0, 4)}
              </span>
            </div>
          </div>

          {/* Bottom title strip (visible when not hovered) */}
          <div
            className="absolute bottom-0 left-0 right-0 p-2.5 transition-opacity duration-300"
            style={{ opacity: hovered ? 0 : 1 }}
          >
            <p className="text-white text-xs font-semibold leading-tight truncate">
              {movie.title}
            </p>
            <p className="text-white/45 text-[10px] mt-0.5">
              {movie.release_date?.slice(0, 4)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function HeroSection({ movie }) {
  if (!movie) return null;
  const backdrop = movie.backdrop_path
    ? `${IMG}/original${movie.backdrop_path}`
    : null;
  const poster = movie.poster_path ? `${IMG}/w500${movie.poster_path}` : null;

  return (
    <div className="relative w-full h-[80vh] min-h-[520px] overflow-hidden">
      {/* Backdrop */}
      {backdrop && (
        <img
          src={backdrop}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.45)" }}
        />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-16 px-6 sm:px-12 max-w-6xl mx-auto w-full">
        <div className="flex gap-6 items-end">
          {poster && (
            <img
              src={poster}
              alt={movie.title}
              className="hidden sm:block w-32 md:w-40 rounded-xl shadow-2xl border border-white/10 shrink-0"
            />
          )}
          <div className="max-w-xl">
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-red-400 mb-3">
              ✦ Featured Today
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
              {movie.title}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <StarRating score={movie.vote_average} />
              <span className="text-white/40 text-sm">
                {movie.release_date?.slice(0, 4)}
              </span>
              <span className="text-white/40 text-sm">
                {(movie.vote_count / 1000).toFixed(1)}k votes
              </span>
            </div>
            <p className="text-white/65 text-sm leading-relaxed line-clamp-3 mb-5">
              {movie.overview}
            </p>
            <div className="flex gap-3">
              <Link
                href={`/movie/${movie.id}`}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                <span>▶</span> Watch Details
              </Link>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/18 border border-white/15 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
                + Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeGenre, setActiveGenre] = useState(null);
  const [activeGenreLabel, setActiveGenreLabel] = useState("All");

  const fetchMovies = useCallback(
    async (pageNum = 1, genreId = null, replace = false) => {
      try {
        const endpoint = genreId
          ? `${BASE}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${pageNum}&sort_by=popularity.desc`
          : `${BASE}/movie/popular?api_key=${API_KEY}&page=${pageNum}`;

        const res = await fetch(endpoint);
        const data = await res.json();

        if (replace) {
          setMovies(data.results);
          setHero(data.results[0]);
        } else {
          setMovies((prev) =>
            pageNum === 1 ? data.results : [...prev, ...data.results]
          );
          if (pageNum === 1) setHero(data.results[0]);
        }
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchMovies(1, null);
  }, [fetchMovies]);

  const handleGenre = (id, label) => {
    if (id === activeGenre) return;
    setActiveGenre(id);
    setActiveGenreLabel(label);
    setPage(1);
    setLoading(true);
    fetchMovies(1, id, true);
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    setLoadingMore(true);
    fetchMovies(next, activeGenre);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero */}
      {!loading && <HeroSection movie={hero} />}

      {/* Loading Hero Placeholder */}
      {loading && (
        <div className="w-full h-[80vh] min-h-[520px] bg-neutral-950 animate-pulse flex items-end p-12">
          <div className="space-y-3 max-w-lg">
            <div className="h-3 w-24 bg-neutral-800 rounded-full" />
            <div className="h-10 w-96 bg-neutral-800 rounded-lg" />
            <div className="h-3 w-72 bg-neutral-800 rounded-full" />
            <div className="h-3 w-64 bg-neutral-800 rounded-full" />
            <div className="flex gap-3 mt-4">
              <div className="h-10 w-32 bg-neutral-800 rounded-xl" />
              <div className="h-10 w-28 bg-neutral-800 rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-white">
              {activeGenreLabel === "All" ? "Popular Movies" : activeGenreLabel}
            </h2>
            <p className="text-white/35 text-sm mt-0.5">
              {activeGenreLabel === "All"
                ? "Most watched movies right now"
                : `Top ${activeGenreLabel} movies`}
            </p>
          </div>

          {/* Genre Filter Chips */}
          <div className="flex gap-2 flex-wrap">
            {GENRES.map(({ id, label }) => (
              <button
                key={label}
                onClick={() => handleGenre(id, label)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
                  activeGenreLabel === label
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-white/5 border-white/10 text-white/55 hover:text-white hover:border-white/25"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {loading
            ? Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}

          {loadingMore &&
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={`more-${i}`} />
            ))}
        </div>

        {/* Load More */}
        {!loading && movies.length > 0 && page < totalPages && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="flex items-center gap-2.5 bg-white/6 hover:bg-white/12 disabled:opacity-50 border border-white/12 hover:border-white/25 text-white font-semibold text-sm px-8 py-3 rounded-2xl transition-all duration-200"
            >
              {loadingMore ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Loading…
                </>
              ) : (
                <>Load More Movies ↓</>
              )}
            </button>
          </div>
        )}

        {/* End of results */}
        {!loading && page >= totalPages && movies.length > 0 && (
          <p className="text-center text-white/25 text-sm mt-12">
            — You've seen them all —
          </p>
        )}
      </div>

      {/* Client Reviews Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-4 py-16">
        <h2 className="text-2xl font-black text-white mb-2">
          What People Say 💬
        </h2>
        <p className="text-white/35 text-sm mb-8">
          Real reactions from movie lovers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur hover:bg-white/10 transition">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="https://i.pravatar.cc/100?img=12"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Alex Johnson
                </h4>
                <p className="text-white/40 text-xs">Movie Lover</p>
              </div>
            </div>

            <p className="text-white/60 text-sm">
              “This platform feels like Netflix! Smooth UI and fast movie
              loading. Love it ❤️”
            </p>

            <div className="text-yellow-400 text-sm mt-3">★★★★★</div>
          </div>

          {/* Review 2 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur hover:bg-white/10 transition">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="https://i.pravatar.cc/100?img=32"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="text-sm font-semibold text-white">Sara Khan</h4>
                <p className="text-white/40 text-xs">UI Designer</p>
              </div>
            </div>

            <p className="text-white/60 text-sm">
              “Beautiful UI and amazing hover effects. This is next-level
              frontend work 🔥”
            </p>

            <div className="text-yellow-400 text-sm mt-3">★★★★☆</div>
          </div>

          {/* Review 3 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur hover:bg-white/10 transition">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="https://i.pravatar.cc/100?img=45"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="text-sm font-semibold text-white">John Smith</h4>
                <p className="text-white/40 text-xs">Developer</p>
              </div>
            </div>

            <p className="text-white/60 text-sm">
              “API integration is smooth and pagination works perfectly. Great
              job!”
            </p>

            <div className="text-yellow-400 text-sm mt-3">★★★★★</div>
          </div>
        </div>
      </div>
    </div>
  );
}
