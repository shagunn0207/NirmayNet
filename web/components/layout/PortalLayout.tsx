"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { LucideIcon } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main App Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            {/* Facility Header */}
            <div className="mb-4 pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
                {roleTitle}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-0.5 leading-snug">
                {facilityName}
              </h2>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      onTabChange(tab.id);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full ${
                      isActive
                        ? "bg-teal-700 text-white shadow-xs"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
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
          </div>
        </aside>

        {/* Mobile Slide-Over Drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Drawer Panel */}
            <div className="relative flex flex-col w-72 max-w-[80vw] bg-white h-full shadow-2xl p-5 z-10 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                    {roleTitle}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900">{facilityName}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <nav className="flex flex-col gap-1">
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
                      className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-left w-full ${
                        isActive
                          ? "bg-teal-700 text-white shadow-xs"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-teal-200" : "text-slate-400"}`} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            isActive
                              ? "bg-teal-900 text-white"
                              : tab.badgeColor || "bg-slate-100 text-slate-700"
                          }`}
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

        {/* Content Area */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Header Action Bar */}
          {headerAction && (
            <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
              {headerAction}
            </div>
          )}

          {/* Tab View Component */}
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
};
