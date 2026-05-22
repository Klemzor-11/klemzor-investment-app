import { useState, useCallback } from "react";

export interface ReferralRecord {
  code: string;           // the code the new user used
  name: string;           // referred user's name (or "Anonymous")
  email: string;          // referred user's email (masked)
  joinedAt: string;       // ISO date
  bonusUSD: number;       // bonus credited to referrer
  status: "active" | "pending";
}

// Global registry: referral code → referrer email
// Stored in localStorage so codes persist across sessions on same device
const REGISTRY_KEY = "trustchain_ref_registry";
const REFERRALS_PREFIX = "trustchain_referrals_";
const PENDING_REF_KEY = "trustchain_pending_ref";

function getRegistry(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(REGISTRY_KEY) || "{}"); }
  catch { return {}; }
}
function setRegistry(reg: Record<string, string>) {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(reg));
}

export function generateReferralCode(email: string): string {
  let h = 5381;
  for (let i = 0; i < email.length; i++) h = Math.imul(h, 33) ^ email.charCodeAt(i);
  const base = Math.abs(h).toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
  return "TFX" + base;
}

export function registerUserCode(email: string) {
  const code = generateReferralCode(email);
  const reg = getRegistry();
  if (!reg[code]) { reg[code] = email; setRegistry(reg); }
  return code;
}

export function storePendingRef(code: string) {
  localStorage.setItem(PENDING_REF_KEY, code);
}

export function consumePendingRef(): string | null {
  const code = localStorage.getItem(PENDING_REF_KEY);
  localStorage.removeItem(PENDING_REF_KEY);
  return code;
}

function referralKey(email: string) { return REFERRALS_PREFIX + email; }

function loadReferrals(email: string): ReferralRecord[] {
  try { return JSON.parse(localStorage.getItem(referralKey(email)) || "[]"); }
  catch { return []; }
}
function saveReferrals(email: string, list: ReferralRecord[]) {
  localStorage.setItem(referralKey(email), JSON.stringify(list));
}

/** Called during signup when a pending ref code exists */
export function processReferral(newUserEmail: string, newUserName: string, refCode: string) {
  const reg = getRegistry();
  const referrerEmail = reg[refCode];
  if (!referrerEmail || referrerEmail === newUserEmail) return;

  const list = loadReferrals(referrerEmail);
  // Avoid duplicate entries
  if (list.some((r) => r.email === newUserEmail)) return;

  const bonus = 25; // $25 flat bonus per referral
  const record: ReferralRecord = {
    code: refCode,
    name: newUserName || "Anonymous",
    email: newUserEmail.replace(/(.{2}).+(@.+)/, "$1***$2"), // mask
    joinedAt: new Date().toISOString(),
    bonusUSD: bonus,
    status: "pending",
  };
  saveReferrals(referrerEmail, [record, ...list]);
}

const BONUS_PER_REFERRAL = 25;

export function useReferral(email: string | undefined) {
  const [referrals, setReferrals] = useState<ReferralRecord[]>(() =>
    email ? loadReferrals(email) : []
  );

  const code = email ? registerUserCode(email) : "";

  const referralLink = code
    ? `${window.location.origin}${import.meta.env.BASE_URL}signup?ref=${code}`
    : "";

  const totalBonus = referrals.reduce((s, r) => s + r.bonusUSD, 0);
  const activeCount = referrals.filter((r) => r.status === "active").length;
  const pendingCount = referrals.filter((r) => r.status === "pending").length;

  /** Simulate accepting a referral (demo mode — promotes pending → active) */
  const simulateReferral = useCallback(() => {
    if (!email) return;
    const names = ["Alex M.", "Jordan K.", "Riley S.", "Casey B.", "Morgan T.", "Dana P."];
    const used = new Set(referrals.map((r) => r.name));
    const name = names.find((n) => !used.has(n)) ?? `Investor #${referrals.length + 1}`;
    const fakeEmail = name.replace(/\s+/g, "").toLowerCase() + "@example.com";
    const record: ReferralRecord = {
      code,
      name,
      email: fakeEmail.replace(/(.{2}).+(@.+)/, "$1***$2"),
      joinedAt: new Date().toISOString(),
      bonusUSD: BONUS_PER_REFERRAL,
      status: "pending",
    };
    const updated = [record, ...referrals];
    saveReferrals(email, updated);
    setReferrals(updated);
  }, [email, code, referrals]);

  /** Promote all pending referrals to active (demo) */
  const activateReferrals = useCallback(() => {
    if (!email) return;
    const updated = referrals.map((r) => ({ ...r, status: "active" as const }));
    saveReferrals(email, updated);
    setReferrals(updated);
  }, [email, referrals]);

  return {
    code,
    referralLink,
    referrals,
    totalBonus,
    activeCount,
    pendingCount,
    simulateReferral,
    activateReferrals,
    BONUS_PER_REFERRAL,
  };
}
