"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter

const navLinks = [
  { href: "/", label: "Popular" },
  { href: "/pages/trending", label: "Trending", badge: "Live" },
  { href: "/pages/Top-rated", label: "Top Rated" },
  { href: "/pages/upcoming", label: "Upcoming" },
  { href: "/pages/search", label: "Search" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500`}
      >
        {/* ── Top Auth Bar ── */}
        <div
          className={`bg-black/40 border-b border-white/5 transition-all duration-300 ${
            scrolled ? "h-0 opacity-0 overflow-hidden" : "h-10 opacity-100"
          }`}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 h-full flex items-center justify-end gap-6">
            <button
              onClick={() => router.push("/pages/login")} // Corrected: use router.push
              className="text-[12px] font-medium text-white/60 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/pages/register")} // Corrected: use router.push
              className="text-[12px] font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider"
            >
              Register
            </button>
          </div>
        </div>

        {/* ── Main Navbar ── */}
        <nav
          className={`${
            scrolled
              ? "bg-black/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/60"
              : "bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm"
          }`}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2.5 group shrink-0"
              >
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-lg bg-red-600 group-hover:bg-red-500 transition-colors duration-300" />
                  <svg
                    className="relative w-4 h-4 text-white"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M2 2h3v12H2zM11 2h3v12h-3zM5.5 5h5l-2.5 3 2.5 3h-5l2.5-3z" />
                  </svg>
                </div>
                <span className="text-white font-bold text-lg tracking-tight">
                  Movie<span className="text-red-500">App</span>
                </span>
              </Link>

              {/* Desktop Nav */}
              <ul className="hidden md:flex items-center gap-1">
                {navLinks.map(({ href, label, badge }) => {
                  const isActive = pathname === href;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? "text-white bg-white/10"
                            : "text-white/60 hover:text-white hover:bg-white/8"
                        }`}
                      >
                        {label}
                        {badge && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold bg-red-600 text-white px-1.5 py-0.5 rounded-full leading-none">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            {badge}
                          </span>
                        )}
                        {isActive && (
                          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-500 rounded-full" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Search */}
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/pages/search"
                  className="flex items-center gap-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 transition-all duration-200 rounded-lg px-3 py-1.5 text-sm"
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
                  <span>Search…</span>
                  <kbd className="text-[10px] bg-white/8 rounded px-1 py-0.5 font-mono">
                    ⌘K
                  </kbd>
                </Link>
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
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
        </nav>
      </header>
    </>
  );
}
