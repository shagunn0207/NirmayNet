import { alerts } from "@/lib/mockData";
import { useState } from "react";

export function useAlerts() {
  const [items, setItems] = useState(alerts);

  const dismissAlert = (id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
  };

  return { alerts: items, dismissAlert };
}
