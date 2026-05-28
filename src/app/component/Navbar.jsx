"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/60"
            : "bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
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

            {/* Desktop Search Button */}
            <div className="hidden md:flex items-center gap-3">
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
                <span>Search movies…</span>
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

      {/* Mobile Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-neutral-950 border-l border-white/8 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 bg-red-600 rounded-md flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-white"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M2 2h3v12H2zM11 2h3v12h-3zM5.5 5h5l-2.5 3 2.5 3h-5l2.5-3z" />
              </svg>
            </div>
            <span className="text-white font-bold text-base">
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

        {/* Search Bar */}
        <div className="px-5 pt-4 pb-2">
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 w-full bg-white/5 border border-white/8 hover:border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white/40 hover:text-white/60 transition-all"
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
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-3">
            Browse
          </p>
          {navLinks.map(({ href, label, badge }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "text-white bg-white/10 border border-white/10"
                    : "text-white/50 hover:text-white hover:bg-white/6"
                }`}
              >
                <span>{label}</span>
                {badge && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold bg-red-600 text-white px-2 py-0.5 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                    {badge}
                  </span>
                )}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="px-5 py-4 border-t border-white/8">
          <p className="text-[11px] text-white/20 text-center">
            Powered by TMDB
          </p>
        </div>
      </div>
    </>
  );
}
