export type ReferralItem = any;
const referralQueue: any[] = [];
import { useState } from "react";

export function useReferrals() {
  const [referrals, setReferrals] = useState<ReferralItem[]>(referralQueue);

  const updateReferralStatus = (id: string, status: ReferralItem["status"]) => {
    setReferrals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return { referrals, updateReferralStatus };
}
