"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { useHealthcare } from "@/context/HealthcareContext";
import { Stethoscope, Building2, BarChart3, Activity, ArrowLeft, ChevronRight } from "lucide-react";

type RoleType = "HOSPITAL" | "DHO" | "ADMIN" | "ASHA" | null;

export default function RootHomePage() {
  const router = useRouter();
  const { isLoggedIn, currentRole, login } = useHealthcare();
  
  const [step, setStep] = useState<"role-selection" | "auth">("role-selection");
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);
  
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to respective portal
  useEffect(() => {
    if (isLoggedIn) {
      if (currentRole === "district-hospital") router.push("/district-hospital");
      else if (currentRole === "dho") router.push("/dho");
      else router.push("/phc-doctor");
    }
  }, [isLoggedIn, currentRole, router]);

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setStep("auth");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

    try {
      if (isLogin) {
        // Login Flow
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }).catch(() => {
          throw new Error("Backend is unreachable. Please ensure the server is running on " + API_BASE);
        });
        
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || "Invalid credentials. Please try again.");
        }
        
        const data = await res.json();
        login(data.user || { username, role: selectedRole }, data.access_token);
        
      } else {
        // Signup Flow
        if (password !== confirmPassword) throw new Error("Passwords do not match");
        
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            password,
            name,
            role: selectedRole,
            fullName: name
          }),
        }).catch(() => {
          throw new Error("Backend is unreachable. Please ensure the server is running on " + API_BASE);
        });
        
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || "Registration failed. Username may already exist.");
        }
        
        // Auto-login after signup
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        
        if (loginRes.ok) {
          const data = await loginRes.json();
          login(data.user || { username, role: selectedRole }, data.access_token);
        } else {
          setIsLogin(true);
          setError("Registration successful! Please log in.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleInfo = (role: RoleType) => {
    if (role === "ADMIN") return { title: "PHC Doctor", icon: Stethoscope, theme: { bgHeader: 'bg-teal-900', bgIcon: 'bg-teal-800/80', textLink: 'text-teal-600 hover:text-teal-700', deco: 'decoration-teal-200 hover:decoration-teal-400', btn: 'bg-teal-600 hover:bg-teal-700' } };
    if (role === "HOSPITAL") return { title: "District Hospital", icon: Building2, theme: { bgHeader: 'bg-blue-900', bgIcon: 'bg-blue-800/80', textLink: 'text-blue-600 hover:text-blue-700', deco: 'decoration-blue-200 hover:decoration-blue-400', btn: 'bg-blue-600 hover:bg-blue-700' } };
    if (role === "DHO") return { title: "District Health Officer", icon: BarChart3, theme: { bgHeader: 'bg-indigo-900', bgIcon: 'bg-indigo-800/80', textLink: 'text-indigo-600 hover:text-indigo-700', deco: 'decoration-indigo-200 hover:decoration-indigo-400', btn: 'bg-indigo-600 hover:bg-indigo-700' } };
    return { title: "Portal", icon: Activity, theme: { bgHeader: 'bg-slate-900', bgIcon: 'bg-slate-800/80', textLink: 'text-slate-600 hover:text-slate-700', deco: 'decoration-slate-200 hover:decoration-slate-400', btn: 'bg-slate-600 hover:bg-slate-700' } };
  };

  const roleInfo = getRoleInfo(selectedRole);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-sky-50 to-indigo-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 py-12">
        {step === "role-selection" ? (
          <div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-xs mb-4">
                <Activity className="w-8 h-8 text-teal-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-3">
                Welcome to NiramayNet
              </h1>
              <p className="text-slate-500 text-lg">
                Select your secure portal to continue
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* PHC Doctor */}
              <button
                onClick={() => handleRoleSelect("ADMIN")}
                className="group relative flex items-center p-6 bg-white rounded-2xl shadow-xs hover:shadow-md border border-slate-100 hover:border-teal-200 transition-all duration-300 text-left overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 w-1.5 bg-teal-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-14 h-14 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-teal-100 transition-all">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-800 mb-1">PHC Doctor Portal</h2>
                  <p className="text-sm text-slate-500">Primary Health Centre doctors & medical officers</p>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-teal-500 transition-colors" />
              </button>

              {/* District Hospital */}
              <button
                onClick={() => handleRoleSelect("HOSPITAL")}
                className="group relative flex items-center p-6 bg-white rounded-2xl shadow-xs hover:shadow-md border border-slate-100 hover:border-blue-200 transition-all duration-300 text-left overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 w-1.5 bg-blue-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-800 mb-1">District Hospital</h2>
                  <p className="text-sm text-slate-500">Casualty coordinators, specialists & facility staff</p>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </button>

              {/* DHO */}
              <button
                onClick={() => handleRoleSelect("DHO")}
                className="group relative flex items-center p-6 bg-white rounded-2xl shadow-xs hover:shadow-md border border-slate-100 hover:border-indigo-200 transition-all duration-300 text-left overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 w-1.5 bg-indigo-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mr-6 group-hover:scale-110 group-hover:bg-indigo-100 transition-all">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-800 mb-1">DHO Portal</h2>
                  <p className="text-sm text-slate-500">District Health Officers and executive administration</p>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Header */}
            <div className={`${roleInfo.theme.bgHeader} px-8 py-10 text-center text-white relative overflow-hidden`}>
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
              
              <button 
                onClick={() => setStep("role-selection")} 
                className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-all flex items-center gap-1 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              
              <div className={`w-16 h-16 rounded-2xl ${roleInfo.theme.bgIcon} border border-white/20 flex items-center justify-center shadow-inner mx-auto mb-5 relative z-10`}>
                <RoleIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight relative z-10">{roleInfo.title}</h1>
              <p className="text-sm text-white/70 mt-2 font-medium relative z-10">
                {isLogin ? "Sign in to access your secure portal" : "Register a new facility account"}
              </p>
            </div>

            <div className="p-8 pb-10">
              {error && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-700 text-sm font-semibold rounded-xl border border-rose-100 flex items-start gap-3 shadow-xs">
                  <div className="mt-0.5">⚠️</div>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name / Facility</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all font-medium text-slate-800"
                      placeholder="E.g. Dr. Sanjay Mehta"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Username / ID</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all font-medium text-slate-800"
                    placeholder="Enter your user ID"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all font-medium text-slate-800"
                    placeholder="Enter your password"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all font-medium text-slate-800"
                      placeholder="Confirm your password"
                    />
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 ${roleInfo.theme.btn} text-white rounded-xl font-bold text-[15px] transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2`}
                  >
                    {isLoading ? "Please wait..." : isLogin ? "Secure Login" : "Create Account"}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 font-medium">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => { setIsLogin(!isLogin); setError(""); }}
                    className={`font-bold transition-all underline underline-offset-4 decoration-2 ${roleInfo.theme.textLink} ${roleInfo.theme.deco}`}
                  >
                    {isLogin ? "Sign up" : "Log in"}
                  </button>
                </p>
              </div>
              
              {/* Quick test accounts */}
              <div className="mt-8 bg-slate-50 rounded-xl p-4 text-center">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Test Fillers</p>
                 <div className="flex justify-center gap-3">
                   {selectedRole === "ADMIN" && <button type="button" onClick={() => { setUsername("dr_sanjay"); setPassword("123456"); setName("Dr. Sanjay"); }} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-slate-300 hover:shadow-xs transition-all">PHC (dr_sanjay)</button>}
                   {selectedRole === "HOSPITAL" && <button type="button" onClick={() => { setUsername("HOSPITAL_NAND_001"); setPassword("hospital2024"); setName("District Civil Hospital"); }} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-slate-300 hover:shadow-xs transition-all">Hospital</button>}
                   {selectedRole === "DHO" && <button type="button" onClick={() => { setUsername("dho_arvind"); setPassword("123456"); setName("Dr. Arvind Patil"); }} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-slate-300 hover:shadow-xs transition-all">DHO</button>}
                 </div>
              </div>
              
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
