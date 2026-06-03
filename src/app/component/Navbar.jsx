"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { href: "/", label: "Popular" },
  { href: "/pages/trending", label: "Trending", badge: "Live" },
  { href: "/pages/Top-rated", label: "Top Rated" },
  { href: "/pages/upcoming", label: "Upcoming" },
  { href: "/pages/search", label: "Search" },
];

/* ── Avatar initials helper ── */
function getInitials(name = "") {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

/* ── User Dropdown ── */
function UserDropdown({ user, onLogout, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-56 bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
      style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.8)" }}
    >
      {/* Top accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />

      {/* User info */}
      <div className="px-4 py-4 border-b border-white/6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-black text-sm shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {user?.name || "User"}
            </p>
            <p className="text-white/35 text-[11px] truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1.5">
        {[
          {
            label: "My Watchlist",
            icon: (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            ),
            href: "/pages/watchlist",
          },
          {
            label: "Profile",
            icon: (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            ),
            href: "/pages/profile",
          },
          {
            label: "Settings",
            icon: (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ),
            href: "/pages/settings",
          },
        ].map(({ label, icon, href }) => (
          <Link
            key={label}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/55 hover:text-white hover:bg-white/6 transition-all"
          >
            <span className="text-white/30">{icon}</span>
            {label}
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="px-2 pb-2 pt-1 border-t border-white/6">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded-xl transition-all"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* ── Main Navbar ── */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, [pathname]); // re-check on route change

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    setOpen(false);
    router.push("/");
  };

  const handleProtectedLink = (e, href) => {
    if (!user) {
      e.preventDefault();
      router.push("/pages/login");
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* ── Top Announcement Bar (shows when NOT scrolled) ── */}
        <div
          className={`bg-red-600/95 transition-all duration-500 overflow-hidden ${
            scrolled || user ? "h-0 opacity-0" : "h-8 opacity-100"
          }`}
        >
          <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <p className="text-white text-xs font-semibold tracking-wide">
              Sign in to unlock movie details, trailers & your watchlist
            </p>
            <Link
              href="/pages/login"
              className="text-white/80 hover:text-white text-xs font-bold underline underline-offset-2 transition-colors"
            >
              Login →
            </Link>
          </div>
        </div>

        {/* ── Main Nav ── */}
        <nav
          className={`transition-all duration-500 ${
            scrolled
              ? "bg-black/95 backdrop-blur-2xl border-b border-white/6 shadow-2xl shadow-black/60"
              : "bg-gradient-to-b from-black/85 to-transparent backdrop-blur-sm"
          }`}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-between h-16">
              {/* ── Logo ── */}
              <Link
                href="/"
                className="flex items-center gap-2.5 group shrink-0"
              >
                <div className="relative w-9 h-9 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-xl bg-red-600 group-hover:bg-red-500 transition-colors duration-300 shadow-lg shadow-red-900/50" />
                  <svg
                    className="relative w-4.5 h-4.5 text-white w-5 h-5"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M2 2h3v12H2zM11 2h3v12h-3zM5.5 5h5l-2.5 3 2.5 3h-5l2.5-3z" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <span className="text-white font-black text-lg tracking-tight">
                    Movie<span className="text-red-500">App</span>
                  </span>
                </div>
              </Link>

              {/* ── Desktop Nav Links ── */}
              <ul className="hidden md:flex items-center gap-0.5">
                {navLinks.map(({ href, label, badge }) => {
                  const isActive = pathname === href;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={(e) => handleProtectedLink(e, href)}
                        className={`relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? "text-white bg-white/10"
                            : "text-white/55 hover:text-white hover:bg-white/7"
                        }`}
                      >
                        {label}
                        {badge && (
                          <span className="flex items-center gap-1 text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full leading-none">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            {badge}
                          </span>
                        )}
                        {isActive && (
                          <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-500 rounded-full" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* ── Desktop Right ── */}
              <div className="hidden md:flex items-center gap-2.5">
                {/* Search pill */}
                <Link
                  href="/pages/search"
                  className="flex items-center gap-2 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/18 transition-all duration-200 rounded-xl px-3 py-2 text-sm"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-xs">Search…</span>
                  <kbd className="text-[10px] bg-white/8 rounded px-1.5 py-0.5 font-mono text-white/30">
                    ⌘K
                  </kbd>
                </Link>

                <div className="w-px h-5 bg-white/10" />

                {/* ── LOGGED IN: User Avatar + Dropdown ── */}
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2.5 bg-white/6 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl pl-1.5 pr-3 py-1.5 transition-all duration-200"
                    >
                      {/* Avatar */}
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-black text-xs">
                        {getInitials(user?.name)}
                      </div>
                      <span className="text-white text-sm font-medium max-w-[80px] truncate">
                        {user?.name?.split(" ")[0] || "User"}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                      <UserDropdown
                        user={user}
                        onLogout={handleLogout}
                        onClose={() => setDropdownOpen(false)}
                      />
                    )}
                  </div>
                ) : (
                  /* ── NOT LOGGED IN: Auth Buttons ── */
                  <>
                    <Link
                      href="/pages/login"
                      className="text-white/60 hover:text-white text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-white/8 transition-all"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/pages/register"
                      className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-red-900/40"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              {/* ── Mobile: right side ── */}
              <div className="md:hidden flex items-center gap-2">
                {/* Mobile avatar if logged in */}
                {user && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-black text-xs">
                    {getInitials(user?.name)}
                  </div>
                )}
                {/* Hamburger */}
                <button
                  onClick={() => setOpen(!open)}
                  className="relative w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Menu"
                >
                  <span
                    className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 origin-center ${
                      open ? "rotate-45 translate-y-2" : ""
                    }`}
                  />
                  <span
                    className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${
                      open ? "opacity-0 scale-x-0" : ""
                    }`}
                  />
                  <span
                    className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 origin-center ${
                      open ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile Overlay ── */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-neutral-950 border-l border-white/8 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer top accent */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/7">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M2 2h3v12H2zM11 2h3v12h-3zM5.5 5h5l-2.5 3 2.5 3h-5l2.5-3z" />
              </svg>
            </div>
            <span className="text-white font-black text-lg">
              Movie<span className="text-red-500">App</span>
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ── Drawer User Panel ── */}
        {user ? (
          <div className="mx-3 mt-4 bg-white/5 border border-white/8 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-black text-sm shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-sm truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-white/35 text-[11px] truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-red-400 hover:text-red-300 bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 text-xs font-semibold py-2 px-3 rounded-xl transition-all"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        ) : (
          <div className="px-3 pt-4 grid grid-cols-2 gap-2">
            <Link
              href="/pages/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold py-2.5 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/pages/register"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center text-white bg-red-600 hover:bg-red-500 text-sm font-bold py-2.5 rounded-xl transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}

        {/* Search */}
        <div className="px-4 pt-4 pb-2">
          <Link
            href="/pages/search"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 w-full bg-white/5 border border-white/8 hover:border-white/15 rounded-xl px-4 py-2.5 text-sm text-white/35 hover:text-white/60 transition-all"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search movies…
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.18em] px-3 mb-3">
            Browse
          </p>
          {navLinks.map(({ href, label, badge }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={(e) => {
                  handleProtectedLink(e, href);
                  setOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "text-white bg-white/10 border border-white/8"
                    : "text-white/45 hover:text-white hover:bg-white/6"
                }`}
              >
                <span>{label}</span>
                <div className="flex items-center gap-2">
                  {badge && (
                    <span className="flex items-center gap-1 text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                      {badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                  {!user && (
                    <svg
                      className="w-3 h-3 text-white/20"
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
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="px-5 py-4 border-t border-white/7 flex items-center justify-between">
          <p className="text-[11px] text-white/20">Powered by TMDB</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-white/25">Live</span>
          </div>
        </div>
      </div>
    </>
  );
}
