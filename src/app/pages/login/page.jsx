"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginModal({ onClose, switchToRegister }) {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-neutral-950 border border-white/10 rounded-2xl p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back 👋</h2>

        <p className="text-white/40 mb-6">Sign in to your account</p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
          />

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50"
            >
              👁
            </button>
          </div>

          <button className="w-full bg-red-600 hover:bg-red-500 py-3 rounded-xl font-semibold">
            Sign In
          </button>
        </div>

        <p className="text-center text-white/40 mt-5">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/pages/register")}
            className="text-red-500"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
