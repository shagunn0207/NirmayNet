"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"phc-doctor" | "district-hospital" | "dho">("phc-doctor");
  const [username, setUsername] = useState("ASHA_NAND_023");
  const [password, setPassword] = useState("asha2024");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (newRole: "phc-doctor" | "district-hospital" | "dho") => {
    setRole(newRole);
    setError(null);
    if (newRole === "phc-doctor") {
      setUsername("ASHA_NAND_023");
      setPassword("asha2024");
    } else if (newRole === "district-hospital") {
      setUsername("HOSPITAL_NAND_001");
      setPassword("hospital2024");
    } else {
      setUsername("dho_nandurbar");
      setPassword("dho@2026");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post<any>("/auth/login", {
        username: username.trim(),
        password: password.trim(),
      });

      if (response.data && response.data.access_token) {
        // Store session under niramaynet_session in localStorage
        try {
          localStorage.setItem("niramaynet_session", JSON.stringify(response.data));
        } catch (e) {
          console.error("Failed to save session to localStorage:", e);
        }

        // Navigate based on user role returned or selected portal role
        const userRole = response.data.user?.role?.toUpperCase();
        if (userRole === "HOSPITAL") {
          router.push("/district-hospital");
        } else if (userRole === "DHO") {
          router.push("/dho");
        } else {
          router.push(`/${role}`);
        }
      } else {
        const errorMsg = response.error || "Invalid username or password";
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error("Login request error:", err);
      setError(err?.message || "Unable to connect to authentication server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-800 text-slate-900">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-2xl shadow-md mb-3">
          <Activity className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">NiramayNet Login</h1>
        <p className="text-xs text-slate-500 mt-1">
          Government of Maharashtra · Rural Healthcare Platform
        </p>
      </div>

      {/* Role Picker */}
      <div className="flex flex-col gap-2 mb-6">
        <label className="text-xs font-bold text-slate-600">Select Portal Role:</label>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => handleRoleSelect("phc-doctor")}
            className={`p-2 rounded-xl font-bold border transition-colors ${
              role === "phc-doctor"
                ? "bg-teal-700 text-white border-teal-800"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            PHC Doctor
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect("district-hospital")}
            className={`p-2 rounded-xl font-bold border transition-colors ${
              role === "district-hospital"
                ? "bg-blue-800 text-white border-blue-900"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            Hospital Staff
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect("dho")}
            className={`p-2 rounded-xl font-bold border transition-colors ${
              role === "dho"
                ? "bg-indigo-900 text-white border-indigo-950"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            DHO Officer
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        <div>
          <label className="font-bold text-slate-700 block mb-1">Username / ID</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-black text-sm shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        <Link href="/" className="font-bold text-teal-700 hover:underline">
          ← Return to Portal Gateway
        </Link>
      </div>
    </div>
  );
}
