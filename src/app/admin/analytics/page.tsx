"use client";

import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ── Analytics static data ─────────────────────────────────────────────────────
const monthlySignups = [
  { month: "Oct", value: 68 }, { month: "Nov", value: 95 },
  { month: "Dec", value: 72 }, { month: "Jan", value: 110 },
  { month: "Feb", value: 143 }, { month: "Mar", value: 189 },
];
const sectionCompletion = [
  { section: "Reading", pct: 78 }, { section: "Listening", pct: 71 },
  { section: "Writing", pct: 63 }, { section: "Speaking", pct: 55 },
];
const planDist = [
  { plan: "Basic", count: 437, color: "bg-slate-500" },
  { plan: "Professional", count: 298, color: "bg-[#1D63D1]" },
  { plan: "Elite", count: 112, color: "bg-purple-500" },
];
const maxSignup = Math.max(...monthlySignups.map((m) => m.value));

type Tab = "financials" | "analytics";

interface ReferralCode {
  id: string; code: string; discountType: "fixed" | "percent";
  discountAmount: number; discountPercent: number | null;
  expiresAt: string | null; maxUsage: number | null;
  usageCount: number; isActive: boolean; createdAt: string;
}

type GatewayKey = "upi" | "card" | "netbanking";

interface GatewayDetails {
  upi: { upiId: string; displayName: string; qrPreview: string | null };
  card: { supportedNetworks: string; processingFee: string; descriptor: string };
  netbanking: { bankList: string; redirectUrl: string; merchantId: string };
}

// ── Gateway Detail / Edit Modal ───────────────────────────────────────────────
function GatewayModal({
  open, onClose, gatewayKey, details, active,
  onSave,
}: {
  open: boolean; onClose: () => void;
  gatewayKey: GatewayKey; details: GatewayDetails; active: boolean;
  onSave: (key: GatewayKey, data: GatewayDetails) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState<GatewayDetails>(details);
  const [qrFile, setQrFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) { setEditing(false); setLocal(details); setQrFile(null); }
  }, [open, details]);

  if (!open) return null;

  const inp = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#1D63D1] focus:ring-2 focus:ring-[#1D63D1]/20 bg-white";
  const readVal = "text-sm font-semibold text-slate-800";
  const readLabel = "text-xs text-slate-400 mb-0.5";

  const meta: Record<GatewayKey, { label: string; iconBg: string; icon: React.ReactNode }> = {
    upi: {
      label: "UPI Payments",
      iconBg: "bg-emerald-50",
      icon: (
        <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
          <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
          <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 14h2m0 0h5m-5 0v5m0-5v-2" />
        </svg>
      ),
    },
    card: {
      label: "Credit / Debit Cards",
      iconBg: "bg-purple-50",
      icon: (
        <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
    },
    netbanking: {
      label: "Net Banking",
      iconBg: "bg-amber-50",
      icon: (
        <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      ),
    },
  };

  const { label, iconBg, icon } = meta[gatewayKey];

  function handleQr(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setQrFile(f);
    setLocal((p) => ({ ...p, upi: { ...p.upi, qrPreview: URL.createObjectURL(f) } }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>{icon}</div>
            <div>
              <p className="text-sm font-bold text-slate-800">{label}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
                <span className={`text-[11px] font-semibold ${active ? "text-emerald-600" : "text-slate-400"}`}>
                  {active ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
                Edit
              </button>
            )}
            <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {gatewayKey === "upi" && (
            <>
              <div>
                <p className={readLabel}>UPI ID</p>
                {editing ? (
                  <input type="text" value={local.upi.upiId} onChange={(e) => setLocal((p) => ({ ...p, upi: { ...p.upi, upiId: e.target.value } }))} placeholder="yourname@upi" className={inp} />
                ) : (
                  <p className={readVal}>{local.upi.upiId || <span className="text-slate-400 font-normal">Not configured</span>}</p>
                )}
              </div>
              <div>
                <p className={readLabel}>Display Name</p>
                {editing ? (
                  <input type="text" value={local.upi.displayName} onChange={(e) => setLocal((p) => ({ ...p, upi: { ...p.upi, displayName: e.target.value } }))} placeholder="Cognitive Sanctuary" className={inp} />
                ) : (
                  <p className={readVal}>{local.upi.displayName || <span className="text-slate-400 font-normal">Not configured</span>}</p>
                )}
              </div>
              <div>
                <p className={readLabel}>UPI QR Code</p>
                {editing ? (
                  <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-[#1D63D1] transition">
                    {local.upi.qrPreview ? (
                      <img src={local.upi.qrPreview} alt="QR" className="h-full w-full rounded-xl object-contain p-2" />
                    ) : (
                      <>
                        <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <span className="mt-1 text-xs text-slate-400">Click to upload QR image</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleQr} />
                  </label>
                ) : local.upi.qrPreview ? (
                  <img src={local.upi.qrPreview} alt="QR" className="h-24 w-24 rounded-xl border border-slate-200 object-contain p-1" />
                ) : (
                  <p className="text-sm text-slate-400">No QR uploaded</p>
                )}
                {editing && qrFile && <p className="mt-1 text-xs text-green-600">✓ {qrFile.name}</p>}
              </div>
            </>
          )}

          {gatewayKey === "card" && (
            <>
              <div>
                <p className={readLabel}>Supported Networks</p>
                {editing ? (
                  <input type="text" value={local.card.supportedNetworks} onChange={(e) => setLocal((p) => ({ ...p, card: { ...p.card, supportedNetworks: e.target.value } }))} placeholder="Visa, Mastercard, RuPay" className={inp} />
                ) : (
                  <p className={readVal}>{local.card.supportedNetworks || <span className="text-slate-400 font-normal">Not configured</span>}</p>
                )}
              </div>
              <div>
                <p className={readLabel}>Processing Fee (%)</p>
                {editing ? (
                  <input type="text" value={local.card.processingFee} onChange={(e) => setLocal((p) => ({ ...p, card: { ...p.card, processingFee: e.target.value } }))} placeholder="1.5" className={inp} />
                ) : (
                  <p className={readVal}>{local.card.processingFee ? `${local.card.processingFee}%` : <span className="text-slate-400 font-normal">Not configured</span>}</p>
                )}
              </div>
              <div>
                <p className={readLabel}>Merchant Descriptor</p>
                {editing ? (
                  <input type="text" value={local.card.descriptor} onChange={(e) => setLocal((p) => ({ ...p, card: { ...p.card, descriptor: e.target.value } }))} placeholder="COGNITIVE SANCTUARY" className={inp} />
                ) : (
                  <p className={readVal}>{local.card.descriptor || <span className="text-slate-400 font-normal">Not configured</span>}</p>
                )}
              </div>
            </>
          )}

          {gatewayKey === "netbanking" && (
            <>
              <div>
                <p className={readLabel}>Supported Banks</p>
                {editing ? (
                  <input type="text" value={local.netbanking.bankList} onChange={(e) => setLocal((p) => ({ ...p, netbanking: { ...p.netbanking, bankList: e.target.value } }))} placeholder="HDFC, SBI, ICICI, Axis" className={inp} />
                ) : (
                  <p className={readVal}>{local.netbanking.bankList || <span className="text-slate-400 font-normal">Not configured</span>}</p>
                )}
              </div>
              <div>
                <p className={readLabel}>Redirect URL</p>
                {editing ? (
                  <input type="text" value={local.netbanking.redirectUrl} onChange={(e) => setLocal((p) => ({ ...p, netbanking: { ...p.netbanking, redirectUrl: e.target.value } }))} placeholder="https://yourdomain.com/payment/callback" className={inp} />
                ) : (
                  <p className={readVal}>{local.netbanking.redirectUrl || <span className="text-slate-400 font-normal">Not configured</span>}</p>
                )}
              </div>
              <div>
                <p className={readLabel}>Merchant ID</p>
                {editing ? (
                  <input type="text" value={local.netbanking.merchantId} onChange={(e) => setLocal((p) => ({ ...p, netbanking: { ...p.netbanking, merchantId: e.target.value } }))} placeholder="MID_XXXXXXXX" className={inp} />
                ) : (
                  <p className={readVal}>{local.netbanking.merchantId || <span className="text-slate-400 font-normal">Not configured</span>}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          {editing ? (
            <>
              <button type="button" onClick={() => { setEditing(false); setLocal(details); }} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { onSave(gatewayKey, local); setEditing(false); }}
                className="rounded-lg bg-[#1D3557] px-5 py-2 text-sm font-semibold text-white hover:bg-[#162840] transition"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Referral Create Modal ──────────────────────────────────────────────────────
function ReferralModal({ open, onClose, onAdd }: {
  open: boolean; onClose: () => void;
  onAdd: (code: string, type: "fixed" | "percent", amount: string, expires: string, max: string) => Promise<void>;
}) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<"fixed" | "percent">("fixed");
  const [amount, setAmount] = useState("");
  const [expires, setExpires] = useState("");
  const [max, setMax] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (open) { setCode(""); setType("fixed"); setAmount(""); setExpires(""); setMax(""); setErr(""); } }, [open]);
  if (!open) return null;

  const inp = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#1D63D1] focus:ring-2 focus:ring-[#1D63D1]/20";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!code || !amount) { setErr("Code and discount are required"); return; }
    setErr(""); setLoading(true);
    await onAdd(code, type, amount, expires, max);
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <p className="text-sm font-bold text-slate-800">Create Referral Code</p>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4 px-6 py-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Campaign Code</label>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SUMMER24" className={inp} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Discount Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as "fixed" | "percent")} className={inp}>
                <option value="fixed">Fixed ($)</option>
                <option value="percent">Percent (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{type === "fixed" ? "Amount ($)" : "Percent (%)"}</label>
              <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={type === "fixed" ? "20" : "15"} className={inp} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Uses</label>
              <input type="number" min="1" value={max} onChange={(e) => setMax(e.target.value)} placeholder="500" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiry Date</label>
              <input type="date" value={expires} onChange={(e) => setExpires(e.target.value)} className={inp} />
            </div>
          </div>
          {err && <p className="text-xs text-red-500">{err}</p>}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" disabled={loading} className="rounded-lg bg-[#1D3557] px-5 py-2 text-sm font-semibold text-white hover:bg-[#162840] transition disabled:opacity-50">
              {loading ? "Creating…" : "Create Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminAnalyticsPage() {
  const [tab, setTab] = useState<Tab>("financials");

  // Payment gateway toggles — loaded from backend
  const [methods, setMethods] = useState({ upi: true, card: true, netbanking: false });

  async function loadGatewaySettings() {
    try {
      const res = await fetch(`${API}/api/admin/payment-settings`);
      if (res.ok) {
        const d = await res.json();
        setMethods({ upi: d.upi ?? true, card: d.card ?? true, netbanking: d.netbanking ?? false });
      }
    } catch {}
  }

  async function toggleGateway(key: GatewayKey, value: boolean) {
    setMethods((p) => ({ ...p, [key]: value }));
    try {
      await fetch(`${API}/api/admin/payment-settings/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: value }),
      });
    } catch {}
  }

  // Gateway modal
  const [activeGateway, setActiveGateway] = useState<GatewayKey | null>(null);
  const [gatewayDetails, setGatewayDetails] = useState<GatewayDetails>({
    upi: { upiId: "", displayName: "", qrPreview: null },
    card: { supportedNetworks: "Visa, Mastercard, RuPay", processingFee: "1.5", descriptor: "" },
    netbanking: { bankList: "HDFC, SBI, ICICI, Axis", redirectUrl: "", merchantId: "" },
  });

  // Platform economics
  const [platformFee, setPlatformFee] = useState("2.5");
  const [globalDiscount, setGlobalDiscount] = useState("10");
  const [savedEcon, setSavedEcon] = useState(false);

  // Referral codes
  const [referrals, setReferrals] = useState<ReferralCode[]>([]);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!openMenuId) return;
    function handleClick() { setOpenMenuId(null); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenuId]);
  const [referralFetchError, setReferralFetchError] = useState(false);
  const [referralLoading, setReferralLoading] = useState(true);

  async function loadReferrals() {
    setReferralLoading(true);
    setReferralFetchError(false);
    try {
      const res = await fetch(`${API}/api/admin/referrals`);
      if (!res.ok) throw new Error("bad response");
      const d = await res.json();
      if (Array.isArray(d)) setReferrals(d);
    } catch {
      setReferralFetchError(true);
    } finally {
      setReferralLoading(false);
    }
  }

  useEffect(() => {
    loadGatewaySettings();
    loadReferrals();
  }, []);

  async function handleAddReferral(code: string, type: "fixed" | "percent", amount: string, expires: string, max: string) {
    try {
      const res = await fetch(`${API}/api/admin/referrals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, discountType: type, discountAmount: Number(amount), expiresAt: expires || null, maxUsage: max ? Number(max) : null }),
      });
      const data = await res.json();
      if (res.ok) setReferrals((p) => [data, ...p]);
    } catch {}
  }

  async function toggleReferral(id: string, isActive: boolean) {
    const res = await fetch(`${API}/api/admin/referrals/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    if (res.ok) setReferrals((p) => p.map((r) => r.id === id ? { ...r, isActive } : r));
  }

  async function deleteReferral(id: string) {
    await fetch(`${API}/api/admin/referrals/${id}`, { method: "DELETE" });
    setReferrals((p) => p.filter((r) => r.id !== id));
    setOpenMenuId(null);
  }

  const gatewayCards: { key: GatewayKey; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: "upi",
      label: "UPI Payments",
      desc: "Direct bank-to-bank transfers via UPI ID or QR codes.",
      icon: (
        <svg className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
          <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
          <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 14h2m0 0h5m-5 0v5m0-5v-2" />
        </svg>
      ),
    },
    {
      key: "card",
      label: "Credit/Debit Cards",
      desc: "Visa, Mastercard, and RuPay card processing.",
      icon: (
        <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
    },
    {
      key: "netbanking",
      label: "Net Banking",
      desc: "Traditional bank login based transaction systems.",
      icon: (
        <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Modals */}
      <GatewayModal
        open={activeGateway !== null}
        onClose={() => setActiveGateway(null)}
        gatewayKey={activeGateway ?? "upi"}
        details={gatewayDetails}
        active={activeGateway ? methods[activeGateway] : false}
        onSave={(key, data) => setGatewayDetails(data)}
      />
      <ReferralModal
        open={referralModalOpen}
        onClose={() => setReferralModalOpen(false)}
        onAdd={handleAddReferral}
      />

      <div className="max-w-5xl space-y-5">
        {/* Tab bar */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 w-fit">
          {(["financials", "analytics"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition ${
                tab === t ? "bg-white text-[#1D3557] shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t === "financials" ? "💳 Financials" : "📊 Analytics"}
            </button>
          ))}
        </div>

        {tab === "financials" ? (
          <div className="space-y-8">
            {/* ── Payment Gateways ── */}
            <section>
              <h1 className="text-2xl font-bold text-[#1D3557]">Payment Gateways</h1>
              <p className="mt-1 text-sm text-slate-500">Enable and configure transaction methods for your platform.</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {gatewayCards.map((g) => {
                  const active = methods[g.key];
                  return (
                    <div
                      key={g.key}
                      onClick={() => setActiveGateway(g.key)}
                      className="relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1D63D1] hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                          {g.icon}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleGateway(g.key, !active); }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${active ? "bg-[#1D63D1]" : "bg-slate-300"}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${active ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                      </div>

                      <p className="text-sm font-bold text-slate-800">{g.label}</p>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">{g.desc}</p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
                          <span className={`text-xs font-semibold ${active ? "text-emerald-600" : "text-slate-400"}`}>
                            {active ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setActiveGateway(g.key); }}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── Referral Codes ── */}
            <section>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="text-xl font-bold text-[#1D3557]">Referral Codes</h2>
                  <p className="mt-0.5 text-sm text-slate-500">Manage promotional campaigns and user referral benefits.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReferralModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#1D63D1] hover:bg-slate-50 transition shadow-sm"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Create New Code
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-visible">
                {referralLoading ? (
                  <div className="py-12 text-center text-sm text-slate-400">Loading referral codes…</div>
                ) : referralFetchError ? (
                  <div className="py-12 text-center space-y-2">
                    <p className="text-sm text-red-500">Could not connect to the backend. Make sure the server is running on port 4000.</p>
                    <button type="button" onClick={loadReferrals} className="text-xs text-[#1D63D1] underline">Retry</button>
                  </div>
                ) : referrals.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-400">No referral codes yet. Create one above.</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60">
                        <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Campaign Code</th>
                        <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Benefit</th>
                        <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Usage Status</th>
                        <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">Expiry</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {referrals.map((r) => {
                        const usedPct = r.maxUsage ? Math.min((r.usageCount / r.maxUsage) * 100, 100) : 80;
                        return (
                          <tr key={r.id} className="hover:bg-slate-50/60">
                            <td className="px-5 py-4">
                              <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-700">{r.code}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                {r.discountType === "fixed" ? `$${r.discountAmount} FLAT` : `${r.discountAmount}% DISCOUNT`}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-200">
                                  <div className="h-full rounded-full bg-[#1D63D1]" style={{ width: `${usedPct}%` }} />
                                </div>
                                <span className="text-xs text-slate-500">
                                  {r.usageCount} used{r.maxUsage ? ` · ${r.maxUsage} cap` : ""}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-600">
                              {r.expiresAt ? new Date(r.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Unlimited"}
                            </td>
                            <td className="px-5 py-4">
                              <div className="relative flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => setOpenMenuId(openMenuId === r.id ? null : r.id)}
                                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
                                >
                                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
                                  </svg>
                                </button>
                                {openMenuId === r.id && (
                                  <div className="absolute right-0 top-8 z-50 w-36 rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                                    <button
                                      type="button"
                                      onClick={() => { toggleReferral(r.id, !r.isActive); setOpenMenuId(null); }}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                      {r.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteReferral(r.id)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {/* ── Platform Economics ── */}
            <section>
              <h2 className="text-xl font-bold text-[#1D3557]">Platform Economics</h2>
              <p className="mt-0.5 text-sm text-slate-500">Key metrics governing the commercial structure of the platform.</p>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-6 sm:grid-cols-3 items-end">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Platform Fee</p>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="number" min="0" step="0.1"
                        value={platformFee}
                        onChange={(e) => { setPlatformFee(e.target.value); setSavedEcon(false); }}
                        className="w-20 rounded-lg border border-slate-200 bg-transparent px-2 py-1 text-3xl font-bold text-[#1D3557] outline-none focus:border-[#1D63D1]"
                      />
                      <span className="text-sm text-slate-500">% per transaction</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Global Discount</p>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="number" min="0" max="100"
                        value={globalDiscount}
                        onChange={(e) => { setGlobalDiscount(e.target.value); setSavedEcon(false); }}
                        className="w-20 rounded-lg border border-slate-200 bg-transparent px-2 py-1 text-3xl font-bold text-[#1D3557] outline-none focus:border-[#1D63D1]"
                      />
                      <span className="text-sm text-slate-500">% active across store</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">System Status</p>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span className="text-sm font-bold text-emerald-600">OPTIMIZED</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  {savedEcon && <p className="text-sm text-green-600">✓ Economics saved</p>}
                  <button
                    type="button"
                    onClick={() => setSavedEcon(true)}
                    className="ml-auto rounded-lg bg-[#1D3557] px-5 py-2 text-sm font-semibold text-white hover:bg-[#162840] transition"
                  >
                    Save All Changes
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* ── Analytics tab ── */
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-700/60 bg-slate-800 p-5">
                <h2 className="mb-4 text-sm font-semibold text-white">Monthly Sign-ups</h2>
                <div className="flex items-end gap-3 h-36">
                  {monthlySignups.map((m) => (
                    <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                      <span className="text-xs text-slate-400">{m.value}</span>
                      <div className="w-full rounded-t-md bg-[#1D63D1]" style={{ height: `${(m.value / maxSignup) * 100}%` }} />
                      <span className="text-xs text-slate-400">{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700/60 bg-slate-800 p-5">
                <h2 className="mb-4 text-sm font-semibold text-white">Plan Distribution</h2>
                <div className="space-y-4">
                  {planDist.map((p) => {
                    const total = planDist.reduce((a, b) => a + b.count, 0);
                    const pct = Math.round((p.count / total) * 100);
                    return (
                      <div key={p.plan}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="font-semibold text-slate-300">{p.plan}</span>
                          <span className="text-slate-400">{p.count} ({pct}%)</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                          <div className={`h-full rounded-full ${p.color}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-800 p-5">
              <h2 className="mb-4 text-sm font-semibold text-white">Practice Section Completion Rate</h2>
              <div className="grid gap-4 sm:grid-cols-4">
                {sectionCompletion.map((s) => (
                  <div key={s.section} className="rounded-xl bg-slate-700/40 p-4 text-center">
                    <p className="text-2xl font-bold text-white">{s.pct}%</p>
                    <p className="mt-1 text-xs text-slate-400">{s.section}</p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-600">
                      <div className="h-full rounded-full bg-[#1D63D1]" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
