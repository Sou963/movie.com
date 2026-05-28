import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Popular" },
  { href: "/trending", label: "Trending" },
  { href: "/top-rated", label: "Top Rated" },
  { href: "/upcoming", label: "Upcoming" },
  { href: "/search", label: "Search" },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-4 h-4"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-black overflow-hidden">
      {/* Background noise texture effect */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* Glow accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-red-700/10 blur-3xl rounded-full pointer-events-none" />

      {/* Main Container - Changed to max-w-6xl and reduced top padding to fill gap */}
      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 pt-4 pb-8">
        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-4 group w-fit"
            >
              <div className="w-9 h-9 bg-red-600 group-hover:bg-red-500 transition-colors rounded-lg flex items-center justify-center shrink-0">
                <svg viewBox="0 0 16 16" fill="white" className="w-4 h-4">
                  <path d="M2 2h3v12H2zM11 2h3v12h-3zM5.5 5h5l-2.5 3 2.5 3h-5l2.5-3z" />
                </svg>
              </div>
              <span className="text-white font-black text-xl tracking-tight">
                Movie<span className="text-red-500">App</span>
              </span>
            </Link>

            <p className="text-white/40 text-sm leading-relaxed mb-5">
              Your cinematic universe. Discover trending, top-rated, and
              upcoming movies powered by the TMDB API.
            </p>

            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/8 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/40 text-[11px] font-medium">
                Powered by TMDB
              </span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/30 mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors duration-200"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-red-500 transition-all duration-300 rounded-full" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/30 mb-4">
              Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Action",
                "Comedy",
                "Horror",
                "Drama",
                "Sci-Fi",
                "Thriller",
                "Romance",
                "Animation",
              ].map((g) => (
                <Link
                  key={g}
                  href={`/?genre=${g.toLowerCase()}`}
                  className="text-[11px] font-medium text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/20 px-2.5 py-1 rounded-full transition-all duration-200"
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>

          {/* Social + Newsletter */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/30 mb-4">
              Follow Us
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-2 text-xs text-white/45 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/20 rounded-lg px-3 py-2 transition-all duration-200"
                >
                  {icon}
                  {label}
                </a>
              ))}
            </div>

            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/30 mb-3">
              Newsletter
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 min-w-0 bg-white/5 border border-white/10 focus:border-red-500/50 focus:outline-none text-white text-xs placeholder-white/25 rounded-lg px-3 py-2 transition-colors"
              />
              <button className="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shrink-0">
                ✦
              </button>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px w-full bg-white/8 mb-6" />

        {/* ── Bottom Row ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © 2026 MovieApp. All rights reserved. Not affiliated with TMDB.
          </p>

          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Use", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-white/25 hover:text-white/60 text-xs transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
