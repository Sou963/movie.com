"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API_KEY = "2fedec819e2e136af6fdf068408a3ea3";
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

/* ─── helpers ─── */
function formatDate(str) {
  if (!str) return "N/A";
  return new Date(str).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ratingColor(n) {
  if (n >= 7.5) return "#22c55e";
  if (n >= 6) return "#eab308";
  return "#ef4444";
}

function timeFormat(mins) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/* ─── sub-components ─── */

function ScoreBadge({ score, size = "md" }) {
  const color = ratingColor(score);
  const cls =
    size === "lg"
      ? "text-3xl font-black w-20 h-20 rounded-2xl"
      : "text-sm font-bold px-2.5 py-1 rounded-xl";
  return (
    <span
      className={`inline-flex items-center justify-center border ${cls}`}
      style={{ color, borderColor: color + "44", background: color + "15" }}
    >
      {size === "lg" ? (
        <span>
          ★<br />
          <span className="text-xl">{score?.toFixed(1)}</span>
        </span>
      ) : (
        `★ ${score?.toFixed(1)}`
      )}
    </span>
  );
}

function CastCard({ person }) {
  const photo = person.profile_path
    ? `${IMG}/w185${person.profile_path}`
    : null;
  return (
    <div className="flex-none w-28 rounded-xl overflow-hidden bg-neutral-900 border border-white/6">
      <div className="w-full h-36 bg-neutral-800 overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt={person.name}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-3xl">
            👤
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="text-white text-[11px] font-semibold leading-tight truncate">
          {person.name}
        </p>
        <p className="text-white/40 text-[10px] truncate mt-0.5">
          {person.character}
        </p>
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const avatar = review.author_details?.avatar_path;
  const avatarUrl =
    avatar && !avatar.startsWith("/https")
      ? `${IMG}/w45${avatar}`
      : avatar?.replace("/https://", "https://") || null;

  const rating = review.author_details?.rating;
  const content = review.content || "";
  const isLong = content.length > 320;
  const initials = review.author
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="bg-neutral-900/70 border border-white/7 rounded-2xl p-5 hover:border-white/14 transition-colors">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800 flex items-center justify-center text-white/60 text-sm font-bold shrink-0 border border-white/10">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={review.author}
              className="w-full h-full object-cover"
            />
          ) : (
            initials || "?"
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white font-semibold text-sm">{review.author}</p>
            {rating && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg border"
                style={{
                  color: ratingColor(rating),
                  borderColor: ratingColor(rating) + "44",
                  background: ratingColor(rating) + "15",
                }}
              >
                ★ {rating}/10
              </span>
            )}
          </div>
          <p className="text-white/35 text-[11px] mt-0.5">
            {formatDate(review.created_at)}
          </p>
        </div>
      </div>

      {/* Body */}
      <p className="text-white/65 text-sm leading-relaxed">
        {isLong && !expanded ? content.slice(0, 320) + "…" : content}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-red-400 hover:text-red-300 text-xs font-semibold transition-colors"
        >
          {expanded ? "Show less ↑" : "Read more ↓"}
        </button>
      )}
    </div>
  );
}

function SimilarCard({ movie }) {
  const poster = movie.poster_path ? `${IMG}/w342${movie.poster_path}` : null;
  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="flex-none w-32 group cursor-pointer">
        <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-neutral-900 border border-white/6 group-hover:border-white/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/50">
          {poster ? (
            <img
              src={poster}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">
              🎬
            </div>
          )}
        </div>
        <p className="text-white/70 text-[11px] font-medium mt-1.5 leading-tight line-clamp-2 group-hover:text-white transition-colors">
          {movie.title}
        </p>
        {movie.vote_average > 0 && (
          <p className="text-yellow-400/70 text-[10px] mt-0.5">
            ★ {movie.vote_average.toFixed(1)}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ─── Main Page ─── */
export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setActiveTab("overview");

    async function load() {
      try {
        const [movieRes, creditsRes, reviewsRes, similarRes, videosRes] =
          await Promise.all([
            fetch(`${BASE}/movie/${id}?api_key=${API_KEY}`),
            fetch(`${BASE}/movie/${id}/credits?api_key=${API_KEY}`),
            fetch(`${BASE}/movie/${id}/reviews?api_key=${API_KEY}`),
            fetch(`${BASE}/movie/${id}/similar?api_key=${API_KEY}`),
            fetch(`${BASE}/movie/${id}/videos?api_key=${API_KEY}`),
          ]);

        const [movieData, creditsData, reviewsData, similarData, videosData] =
          await Promise.all([
            movieRes.json(),
            creditsRes.json(),
            reviewsRes.json(),
            similarRes.json(),
            videosRes.json(),
          ]);

        setMovie(movieData);
        setCast(creditsData.cast?.slice(0, 20) || []);
        setReviews(reviewsData.results || []);
        setSimilar(similarData.results?.slice(0, 16) || []);

        const yt = videosData.results?.find(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );
        setTrailer(yt || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  /* ── skeleton ── */
  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <div className="w-full h-[60vh] bg-neutral-950 animate-pulse" />
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-4">
          <div className="h-8 w-64 bg-neutral-800 rounded-lg animate-pulse" />
          <div className="h-4 w-96 bg-neutral-900 rounded animate-pulse" />
          <div className="h-4 w-80 bg-neutral-900 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!movie || movie.success === false) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-6xl mb-4">🎬</p>
          <h2 className="text-2xl font-bold mb-2">Movie not found</h2>
          <Link
            href="/"
            className="text-red-400 hover:text-red-300 text-sm underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const backdrop = movie.backdrop_path
    ? `${IMG}/original${movie.backdrop_path}`
    : null;
  const poster = movie.poster_path ? `${IMG}/w500${movie.poster_path}` : null;

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "cast", label: `Cast (${cast.length})` },
    { key: "reviews", label: `Reviews (${reviews.length})` },
    { key: "similar", label: "Similar" },
  ];

  return (
    <div className="bg-black min-h-screen text-white">
      {/* ── Hero Backdrop ── */}
      <div className="relative w-full h-[65vh] min-h-[480px] overflow-hidden">
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.35) saturate(1.1)" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 text-sm font-medium transition-all"
          >
            ← Back
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end pb-12 px-6 sm:px-12">
          <div className="max-w-6xl w-full mx-auto flex gap-6 items-end">
            {/* Poster */}
            {poster && (
              <img
                src={poster}
                alt={movie.title}
                className="hidden sm:block w-36 md:w-48 rounded-2xl shadow-2xl border border-white/10 shrink-0"
              />
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Tagline */}
              {movie.tagline && (
                <p className="text-red-400/80 text-xs font-semibold tracking-widest uppercase mb-2 italic">
                  "{movie.tagline}"
                </p>
              )}

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-2">
                {movie.title}
              </h1>
              {movie.original_title !== movie.title && (
                <p className="text-white/35 text-sm mb-3">
                  {movie.original_title}
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <ScoreBadge score={movie.vote_average} />
                <span className="text-white/40 text-sm">
                  {movie.release_date?.slice(0, 4)}
                </span>
                {timeFormat(movie.runtime) && (
                  <span className="text-white/40 text-sm">
                    ⏱ {timeFormat(movie.runtime)}
                  </span>
                )}
                <span className="text-white/40 text-sm">
                  {(movie.vote_count / 1000).toFixed(1)}k votes
                </span>
                {movie.adult && (
                  <span className="text-red-400 border border-red-400/30 text-[10px] font-bold px-2 py-0.5 rounded">
                    18+
                  </span>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-5">
                {movie.genres?.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs text-white/60 bg-white/8 border border-white/10 px-2.5 py-1 rounded-full"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
                  >
                    ▶ Watch Trailer
                  </button>
                )}
                {movie.homepage && (
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/8 hover:bg-white/15 border border-white/12 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                  >
                    🌐 Official Site
                  </a>
                )}
                <button className="flex items-center gap-2 bg-white/8 hover:bg-white/15 border border-white/12 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
                  + Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trailer Modal ── */}
      {showTrailer && trailer && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="w-full max-w-4xl bg-neutral-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
              <p className="text-white font-semibold text-sm">
                🎬 {movie.title} — Trailer
              </p>
              <button
                onClick={() => setShowTrailer(false)}
                className="text-white/50 hover:text-white text-xl transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title="Trailer"
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: "Budget",
              val:
                movie.budget > 0
                  ? `$${(movie.budget / 1e6).toFixed(0)}M`
                  : "N/A",
            },
            {
              label: "Revenue",
              val:
                movie.revenue > 0
                  ? `$${(movie.revenue / 1e6).toFixed(0)}M`
                  : "N/A",
            },
            { label: "Status", val: movie.status || "N/A" },
            {
              label: "Language",
              val: movie.original_language?.toUpperCase() || "N/A",
            },
          ].map(({ label, val }) => (
            <div
              key={label}
              className="bg-neutral-900/60 border border-white/7 rounded-xl p-4"
            >
              <p className="text-white/35 text-[11px] font-semibold uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="text-white font-bold text-sm">{val}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 border-b border-white/8 mb-8 overflow-x-auto scrollbar-none">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`shrink-0 px-5 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
                activeTab === key
                  ? "border-red-500 text-white"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab: Overview ── */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
                  Synopsis
                </h3>
                <p className="text-white/75 leading-relaxed text-sm sm:text-base">
                  {movie.overview || "No overview available."}
                </p>
              </div>

              {/* Production Companies */}
              {movie.production_companies?.length > 0 && (
                <div>
                  <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
                    Production
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.production_companies.map((c) => (
                      <span
                        key={c.id}
                        className="text-xs text-white/55 bg-white/5 border border-white/8 px-3 py-1.5 rounded-lg"
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Countries */}
              {movie.production_countries?.length > 0 && (
                <div>
                  <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
                    Countries
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.production_countries.map((c) => (
                      <span
                        key={c.iso_3166_1}
                        className="text-xs text-white/55 bg-white/5 border border-white/8 px-3 py-1.5 rounded-lg"
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-4">
              <div className="bg-neutral-900/60 border border-white/7 rounded-2xl p-5 space-y-4">
                {[
                  {
                    label: "Release Date",
                    val: formatDate(movie.release_date),
                  },
                  { label: "Runtime", val: timeFormat(movie.runtime) || "N/A" },
                  { label: "Popularity", val: movie.popularity?.toFixed(0) },
                  {
                    label: "Vote Count",
                    val: movie.vote_count?.toLocaleString(),
                  },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <p className="text-white/35 text-[11px] font-bold uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-white text-sm font-semibold mt-0.5">
                      {val}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Cast ── */}
        {activeTab === "cast" && (
          <div>
            {cast.length === 0 ? (
              <p className="text-white/35 text-sm">
                No cast information available.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
                {cast.map((person) => (
                  <CastCard key={person.cast_id ?? person.id} person={person} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Reviews ── */}
        {activeTab === "reviews" && (
          <div>
            {reviews.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">💬</p>
                <p className="text-white/40 text-sm">
                  No reviews yet for this movie.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary bar */}
                <div className="flex items-center gap-4 bg-neutral-900/60 border border-white/7 rounded-2xl p-5 mb-6">
                  <ScoreBadge score={movie.vote_average} size="lg" />
                  <div>
                    <p className="text-white font-black text-2xl">
                      {movie.vote_average?.toFixed(1)}{" "}
                      <span className="text-white/30 font-normal text-base">
                        / 10
                      </span>
                    </p>
                    <p className="text-white/45 text-sm">
                      Based on {movie.vote_count?.toLocaleString()} ratings
                    </p>
                    <p className="text-white/35 text-xs mt-0.5">
                      {reviews.length} written review
                      {reviews.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Similar ── */}
        {activeTab === "similar" && (
          <div>
            {similar.length === 0 ? (
              <p className="text-white/35 text-sm">No similar movies found.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {similar.map((m) => (
                  <SimilarCard key={m.id} movie={m} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
