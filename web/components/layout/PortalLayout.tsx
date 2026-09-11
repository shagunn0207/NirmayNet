"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Activity, LucideIcon, X } from "lucide-react";
import Link from "next/link";

export interface NavTabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
  badgeColor?: string;
  urgent?: boolean;
}

interface PortalLayoutProps {
  roleTitle: string;
  facilityName: string;
  tabs: NavTabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  roleTitle,
  facilityName,
  tabs,
  activeTab,
  onTabChange,
  children,
  headerAction,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#f4f6f8] text-slate-900">
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 bg-white fixed inset-y-0 z-20 shadow-sm">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 bg-white shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:bg-teal-700 transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Niramay<span className="text-teal-600">Net</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                Integrated Rural Care
              </p>
            </div>
          </Link>
          
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-0.5">
              {roleTitle}
            </span>
            <h2 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2" title={facilityName}>
              {facilityName}
            </h2>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all text-left w-full ${
                  isActive
                    ? "bg-teal-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4.5 h-4.5 shrink-0 ${
                      isActive ? "text-teal-200" : "text-slate-400"
                    }`}
                  />
                  <span className="truncate">{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? "bg-teal-900/60 text-white"
                        : tab.badgeColor || "bg-slate-100 text-slate-700"
                    } ${tab.urgent ? "animate-pulse ring-2 ring-red-400" : ""}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen w-full">
        {/* Navbar sits on top of main content */}
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
          hideBrandOnDesktop={true}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full mx-auto flex flex-col">
          {/* Header Action Bar */}
          {headerAction && (
            <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
              {headerAction}
            </div>
          )}

          {/* Tab View Component */}
          <div className="flex-1 flex flex-col w-full">{children}</div>
        </main>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10 overflow-hidden flex-shrink-0">
             <div className="p-5 border-b border-slate-100 bg-white shrink-0">
               <div className="flex items-center justify-between mb-6">
                 <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-extrabold tracking-tight text-slate-900">
                    Niramay<span className="text-teal-600">Net</span>
                  </span>
                 </Link>
                 <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                   <X className="w-5 h-5" />
                 </button>
               </div>
               
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-0.5">
                  {roleTitle}
                </span>
                <h2 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2" title={facilityName}>
                  {facilityName}
                </h2>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all text-left w-full ${
                      isActive
                        ? "bg-teal-700 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-teal-200" : "text-slate-400"}`} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                    {tab.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isActive
                            ? "bg-teal-900/60 text-white"
                            : tab.badgeColor || "bg-slate-100 text-slate-700"
                        } ${tab.urgent ? "animate-pulse ring-2 ring-red-400" : ""}`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
