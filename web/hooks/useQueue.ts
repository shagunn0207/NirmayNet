import { queuePatients, QueuePatient } from "@/lib/mockData";
import { useState } from "react";

export function useQueue() {
  const [queue, setQueue] = useState<QueuePatient[]>(queuePatients);

  const updatePatientStatus = (id: string, status: QueuePatient["status"]) => {
    setQueue((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  return { queue, updatePatientStatus };
}
