"use client";

import React from "react";
import { HealthcareProvider } from "@/context/HealthcareContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <HealthcareProvider>{children}</HealthcareProvider>;
}
