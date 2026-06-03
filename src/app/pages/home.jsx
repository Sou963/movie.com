"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("user");
};

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

const SITE_REVIEWS = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Movie Lover",
    avatar: "https://i.pravatar.cc/100?img=12",
    text: "This platform feels just like Netflix! Smooth UI, fast loading, and the genre filter is incredibly clean ❤️",
    stars: 5,
  },
  {
    id: 2,
    name: "Sara Khan",
    role: "UI Designer",
    avatar: "https://i.pravatar.cc/100?img=32",
    text: "Beautiful hover effects and cinematic design. The detail page with cast info is absolutely top-tier 🔥",
    stars: 4,
  },
  {
    id: 3,
    name: "John Smith",
    role: "Developer",
    avatar: "https://i.pravatar.cc/100?img=45",
    text: "API integration is smooth and pagination works perfectly. Great job on overall performance!",
    stars: 5,
  },
  {
    id: 4,
    name: "Mia Chen",
    role: "Film Critic",
    avatar: "https://i.pravatar.cc/100?img=47",
    text: "Finding hidden gems has never been this easy. The skeleton loading and animations are impressive 🎬",
    stars: 5,
  },
  {
    id: 5,
    name: "Ravi Patel",
    role: "Cinephile",
    avatar: "https://i.pravatar.cc/100?img=60",
    text: "I check upcoming releases here every week. The trailer modal is an absolute game-changer for me!",
    stars: 4,
  },
  {
    id: 6,
    name: "Layla Hassan",
    role: "Content Creator",
    avatar: "https://i.pravatar.cc/100?img=23",
    text: "Clean dark design and blazing fast load times. The watchlist feature keeps me coming back daily 👏",
    stars: 5,
  },
];

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */

function StarDisplay({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${
            i < count ? "text-yellow-400" : "text-white/15"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function StarRating({ score }) {
  const color = score >= 7.5 ? "#22c55e" : score >= 6 ? "#eab308" : "#ef4444";
  return (
    <span
      className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
      style={{ color, borderColor: color + "55", background: color + "18" }}
    >
      ★ {score.toFixed(1)}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl overflow-hidden bg-neutral-900">
      <div className="w-full aspect-[2/3] bg-neutral-800" />
      <div className="p-2.5 space-y-2">
        <div className="h-3 bg-neutral-700 rounded w-3/4" />
        <div className="h-2.5 bg-neutral-800 rounded w-1/3" />
      </div>
    </div>
  );
}

/* ── Login Gate Modal ── */
function LoginGate({ onClose, router }) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative w-full max-w-sm bg-neutral-950 border border-white/10 rounded-3xl p-7 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-px w-full absolute top-0 left-0 bg-gradient-to-r from-transparent via-red-600/70 to-transparent rounded-t-3xl" />
        <div className="w-14 h-14 bg-red-600/15 border border-red-600/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h3 className="text-white font-black text-xl mb-2">Login Required</h3>
        <p className="text-white/45 text-sm mb-6 leading-relaxed">
          Sign in to view movie details, trailers, cast info, and more.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/8 hover:bg-white/12 border border-white/10 text-white/70 text-sm font-semibold py-2.5 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => router.push("/pages/login")}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
          >
            Sign In →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Movie Card ── */
function MovieCard({ movie, onLoginRequired }) {
  const [hovered, setHovered] = useState(false);
  const poster = movie.poster_path
    ? `${IMG}/w500${movie.poster_path}`
    : "/no-poster.jpg";

  const handleClick = (e) => {
    if (!isLoggedIn()) {
      e.preventDefault();
      onLoginRequired();
    }
  };

  return (
    <Link href={`/movie/${movie.id}`} onClick={handleClick}>
      <div
        className="group relative rounded-xl overflow-hidden cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform: hovered ? "translateY(-4px) scale(1.02)" : "none",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: hovered
            ? "0 20px 40px rgba(0,0,0,0.7)"
            : "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        <div className="relative w-full aspect-[2/3] bg-neutral-900">
          <img
            src={poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Mobile-tap lock indicator (shows briefly) */}
          {!isLoggedIn() && hovered && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-10">
              <div className="bg-black/85 border border-white/15 rounded-xl px-3 py-2 flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-red-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-white text-[11px] font-semibold">
                  Login to view
                </span>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

          {/* Rating */}
          <div className="absolute top-1.5 right-1.5">
            <StarRating score={movie.vote_average} />
          </div>

          {/* Hover overlay — desktop only */}
          {isLoggedIn() && (
            <div
              className="absolute inset-0 hidden sm:flex flex-col justify-end p-3 transition-opacity duration-300"
              style={{
                opacity: hovered ? 1 : 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.7) 60%, transparent 100%)",
              }}
            >
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
          )}

          {/* Bottom title strip */}
          <div
            className="absolute bottom-0 left-0 right-0 p-2 transition-opacity duration-300"
            style={{ opacity: hovered && isLoggedIn() ? 0 : 1 }}
          >
            <p className="text-white text-[11px] sm:text-xs font-semibold leading-tight truncate">
              {movie.title}
            </p>
            <p className="text-white/40 text-[10px] mt-0.5">
              {movie.release_date?.slice(0, 4)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Hero Section ── */
function HeroSection({ movie, onLoginRequired }) {
  const router = useRouter();
  if (!movie) return null;

  const backdrop = movie.backdrop_path
    ? `${IMG}/original${movie.backdrop_path}`
    : null;
  const poster = movie.poster_path ? `${IMG}/w342${movie.poster_path}` : null;

  const handleWatch = () => {
    if (!isLoggedIn()) {
      onLoginRequired();
      return;
    }
    router.push(`/movie/${movie.id}`);
  };

  return (
    /* Mobile: 60vh | Tablet+: 85vh */
    <div className="relative w-full h-[62vh] sm:h-[85vh] min-h-[380px] sm:min-h-[540px] overflow-hidden">
      {backdrop && (
        <img
          src={backdrop}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.35) saturate(1.1)" }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

      {/* Score badge — hidden on small mobile, shown from sm */}
      <div className="absolute top-20 right-4 sm:top-24 sm:right-10 flex flex-col gap-2 items-end">
        <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 text-center">
          <p className="text-yellow-400 font-black text-xl sm:text-2xl leading-none">
            {movie.vote_average?.toFixed(1)}
          </p>
          <p className="text-white/35 text-[9px] font-bold uppercase tracking-wider mt-0.5">
            TMDB
          </p>
        </div>
      </div>

      {/* Content — bottom aligned */}
      <div className="absolute inset-0 flex items-end pb-8 sm:pb-14 px-4 sm:px-10">
        <div className="max-w-6xl w-full mx-auto flex gap-5 items-end">
          {/* Poster — only md+ */}
          {poster && (
            <img
              src={poster}
              alt={movie.title}
              className="hidden md:block w-32 lg:w-44 rounded-2xl shadow-2xl border border-white/10 shrink-0"
            />
          )}

          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-red-400 mb-2 sm:mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Featured Today
            </span>

            {/* Title — responsive font */}
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-2 sm:mb-3 line-clamp-2">
              {movie.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <StarRating score={movie.vote_average} />
              <span className="text-white/40 text-xs sm:text-sm">
                {movie.release_date?.slice(0, 4)}
              </span>
              <span className="text-white/35 text-[10px] sm:text-xs">
                {(movie.vote_count / 1000).toFixed(1)}k votes
              </span>
              {movie.original_language && (
                <span className="text-white/35 text-[10px] border border-white/15 px-1.5 py-0.5 rounded-full uppercase font-medium">
                  {movie.original_language}
                </span>
              )}
            </div>

            {/* Overview — hidden on very small screens */}
            <p className="hidden sm:block text-white/55 text-sm leading-relaxed line-clamp-2 mb-5 max-w-lg">
              {movie.overview}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={handleWatch}
                className="flex items-center gap-1.5 sm:gap-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-colors shadow-lg shadow-red-900/40"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Details
              </button>

              {!isLoggedIn() ? (
                <Link
                  href="/pages/login"
                  className="flex items-center gap-1.5 bg-white/8 hover:bg-white/15 active:bg-white/20 border border-white/15 text-white text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all"
                >
                  🔐 <span className="hidden sm:inline">Login to Explore</span>
                  <span className="sm:hidden">Login</span>
                </Link>
              ) : (
                <button className="flex items-center gap-1.5 bg-white/8 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all">
                  + <span className="hidden sm:inline">Add to</span> Watchlist
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Home() {
  const [movies, setMovies] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeGenre, setActiveGenre] = useState(null);
  const [activeGenreLabel, setActiveGenreLabel] = useState("All");
  const [showLoginGate, setShowLoginGate] = useState(false);
  const router = useRouter();

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
    <div
      style={{ backgroundColor: "#000000" }}
      className="min-h-screen text-white"
    >
      {showLoginGate && (
        <LoginGate onClose={() => setShowLoginGate(false)} router={router} />
      )}

      {/* ── Hero ── */}
      {loading ? (
        <div className="w-full h-[62vh] sm:h-[85vh] min-h-[380px] sm:min-h-[540px] bg-neutral-950 animate-pulse flex items-end p-5 sm:p-12">
          <div className="max-w-6xl w-full mx-auto space-y-3 sm:space-y-4">
            <div className="h-2.5 w-20 sm:w-28 bg-neutral-800 rounded-full" />
            <div className="h-7 sm:h-10 w-60 sm:w-80 bg-neutral-800 rounded-xl" />
            <div className="h-2.5 sm:h-3 w-44 sm:w-64 bg-neutral-800 rounded-full" />
            <div className="hidden sm:block h-3 w-56 bg-neutral-800 rounded-full" />
            <div className="flex gap-2 sm:gap-3 pt-1">
              <div className="h-10 sm:h-11 w-28 sm:w-36 bg-neutral-800 rounded-xl" />
              <div className="h-10 sm:h-11 w-20 sm:w-32 bg-neutral-800 rounded-xl" />
            </div>
          </div>
        </div>
      ) : (
        <HeroSection
          movie={hero}
          onLoginRequired={() => setShowLoginGate(true)}
        />
      )}

      {/* ── Login Banner (not logged in) ── */}
      {!isLoggedIn() && !loading && (
        <div
          style={{ backgroundColor: "#0d0707" }}
          className="border-y border-red-900/25"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-600/15 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <p className="text-white/55 text-xs sm:text-sm truncate">
                <span className="text-white font-semibold">Login required</span>
                <span className="hidden sm:inline">
                  {" "}
                  — unlock trailers, cast info & watchlist
                </span>
              </p>
            </div>
            <Link
              href="/pages/login"
              className="shrink-0 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors"
            >
              Sign In →
            </Link>
          </div>
        </div>
      )}

      {/* ── Movies Section ── */}
      <div
        style={{ backgroundColor: "#000000" }}
        className="max-w-6xl mx-auto px-3 sm:px-8 py-8 sm:py-10"
      >
        {/* Section Header */}
        <div className="mb-5 sm:mb-7">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {activeGenreLabel === "All"
                  ? "Popular Movies"
                  : activeGenreLabel}
              </h2>
              <p className="text-white/30 text-xs sm:text-sm mt-0.5">
                {activeGenreLabel === "All"
                  ? "Most watched right now"
                  : `Top ${activeGenreLabel} movies`}
              </p>
            </div>
          </div>

          {/* Genre chips — horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap">
            {GENRES.map(({ id, label }) => (
              <button
                key={label}
                onClick={() => handleGenre(id, label)}
                className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  activeGenreLabel === label
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/25 active:bg-white/15"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Movie Grid: 2 cols mobile → 3 → 4 → 5 → 6 */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onLoginRequired={() => setShowLoginGate(true)}
                />
              ))}
          {loadingMore &&
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={`more-${i}`} />
            ))}
        </div>

        {/* Load More */}
        {!loading && movies.length > 0 && page < totalPages && (
          <div className="flex justify-center mt-10 sm:mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="flex items-center gap-2.5 bg-white/6 hover:bg-white/12 active:bg-white/18 disabled:opacity-50 border border-white/12 hover:border-white/25 text-white font-semibold text-sm px-7 sm:px-8 py-3 rounded-2xl transition-all w-full sm:w-auto justify-center"
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
                "Load More Movies ↓"
              )}
            </button>
          </div>
        )}

        {!loading && page >= totalPages && movies.length > 0 && (
          <p className="text-center text-white/20 text-xs sm:text-sm mt-10">
            — You've seen them all —
          </p>
        )}
      </div>

      {/* ── Stats Bar ── */}
      <div
        style={{ backgroundColor: "#0a0a0a" }}
        className="border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Movies", value: "500K+", icon: "🎬" },
              { label: "Users", value: "12K+", icon: "👥" },
              { label: "Updates", value: "24/7", icon: "🔄" },
              { label: "Rating", value: "4.8★", icon: "⭐" },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-neutral-900 border border-white/7 rounded-2xl p-4 sm:p-5 text-center hover:border-white/15 transition-colors"
              >
                <p className="text-xl sm:text-2xl mb-1">{icon}</p>
                <p className="text-white font-black text-xl sm:text-2xl">
                  {value}
                </p>
                <p className="text-white/35 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reviews Section ── */}
      <div
        style={{ backgroundColor: "#0a0a0a" }}
        className="border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-8 py-12 sm:py-16">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <span className="text-[11px] font-bold tracking-widest uppercase text-red-400 block mb-2">
              ✦ Community
            </span>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  What People Say
                </h2>
                <p className="text-white/35 text-xs sm:text-sm mt-1">
                  Real reviews from movie lovers around the world
                </p>
              </div>

              {/* Aggregate Score — compact on mobile */}
              <div className="flex items-center gap-3 sm:gap-4 bg-neutral-900 border border-white/8 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 self-start">
                <div className="text-center">
                  <p className="text-white font-black text-2xl sm:text-3xl leading-none">
                    4.8
                  </p>
                  <p className="text-white/30 text-[10px] mt-0.5">/ 5</p>
                </div>
                <div className="w-px h-8 bg-white/8" />
                <div>
                  <StarDisplay count={5} />
                  <p className="text-white/40 text-[10px] mt-1">
                    {SITE_REVIEWS.length} reviews
                  </p>
                  <div className="mt-1.5 space-y-0.5">
                    {[
                      { stars: 5, pct: 72 },
                      { stars: 4, pct: 20 },
                      { stars: 3, pct: 8 },
                    ].map(({ stars, pct }) => (
                      <div key={stars} className="flex items-center gap-1.5">
                        <span className="text-white/25 text-[9px] w-3">
                          {stars}★
                        </span>
                        <div className="w-14 sm:w-20 h-1 bg-white/8 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400/70 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {SITE_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="bg-neutral-900 border border-white/7 rounded-2xl p-4 sm:p-5 hover:border-white/15 hover:bg-neutral-800/60 transition-all duration-200 flex flex-col gap-3 sm:gap-4"
              >
                <StarDisplay count={review.stars} />
                <p className="text-white/60 text-sm leading-relaxed flex-1">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/6">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold leading-tight truncate">
                      {review.name}
                    </p>
                    <p className="text-white/35 text-[11px]">{review.role}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full shrink-0">
                    ✓<span className="hidden sm:inline"> Verified</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 sm:mt-12 bg-gradient-to-r from-red-950/40 via-neutral-900 to-red-950/40 border border-red-900/20 rounded-3xl p-7 sm:p-10 text-center">
            <p className="text-white font-black text-xl sm:text-2xl mb-2">
              Ready to explore? 🎬
            </p>
            <p className="text-white/40 text-xs sm:text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Join thousands of movie lovers. Access trailers, cast info,
              reviews and your personal watchlist.
            </p>
            <div className="flex gap-3 justify-center flex-col xs:flex-row sm:flex-row">
              <Link
                href="/pages/login"
                className="bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-sm px-7 py-3 rounded-xl transition-colors text-center"
              >
                Sign In Free →
              </Link>
              <Link
                href="/pages/search"
                className="bg-white/8 hover:bg-white/15 border border-white/12 text-white text-sm font-medium px-7 py-3 rounded-xl transition-all text-center"
              >
                Browse Movies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
