"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterModal({ onClose }) {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose?.();

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        "https://movie-backend-gules.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert(data.message || "Registration successful!");

      if (data.success) {
        router.push("/pages/login");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error: " + error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-neutral-950 border border-white/10 rounded-2xl p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          Create Account 🎬
        </h2>

        <p className="text-white/40 mb-6">Join MovieApp today</p>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
          />

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
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

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50"
            >
              👁
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-red-600 hover:bg-red-500 py-3 rounded-xl font-semibold"
          >
            Create Account
          </button>
        </div>

        <p className="text-center text-white/40 mt-5">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/pages/login")}
            className="text-red-500"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
