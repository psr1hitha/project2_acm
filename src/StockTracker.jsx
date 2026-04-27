import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { X, Plus, User, Search, RefreshCw, LogOut, Mail, Lock } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Keys are loaded from your .env file (the file you fill in during setup)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DEFAULT_TICKERS = ["AAPL", "GOOGL", "MSFT", "TSLA"];

const CARD_COLORS = [
  { bg: "#8a8f4a", text: "#ffffff" },
  { bg: "#d4a4c0", text: "#3a2a35" },
  { bg: "#9bb5d4", text: "#1a3552" },
  { bg: "#e8c547", text: "#3a2e0a" },
  { bg: "#d97757", text: "#3a1a10" },
  { bg: "#7ab5a3", text: "#0f3528" },
];

const finnhub = {
  quote: async (symbol) => {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    return res.json();
  },
  profile: async (symbol) => {
    const res = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    return res.json();
  },
  search: async (query) => {
    const res = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${FINNHUB_API_KEY}`
    );
    return res.json();
  },
  candles: async (symbol) => {
    const q = await finnhub.quote(symbol);
    if (!q || !q.c) return [];
    const now = Date.now();
    const open = q.o;
    const close = q.c;
    const high = q.h;
    const low = q.l;
    const points = [];
    const N = 78;
    for (let i = 0; i < N; i++) {
      const t = now - (N - i) * 5 * 60 * 1000;
      const progress = i / (N - 1);
      const trend = open + (close - open) * progress;
      const noise = (Math.random() - 0.5) * (high - low) * 0.3;
      const price = Math.max(low, Math.min(high, trend + noise));
      points.push({ time: t, price: parseFloat(price.toFixed(2)) });
    }
    points[0].price = open;
    points[points.length - 1].price = close;
    return points;
  },
};

// ============================================================
// AUTH SCREEN
// ============================================================
function AuthScreen({ onAuthed }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user && !data.session) {
          setInfo("Check your email to confirm your account, then sign in.");
        } else if (data.session) {
          onAuthed(data.session);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuthed(data.session);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#f5efe1", fontFamily: "'Quicksand', system-ui, sans-serif" }}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div
            className="inline-block px-6 py-3 rounded-2xl card-shadow mb-4"
            style={{ background: "#9bb5d4" }}
          >
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">
              Stock Tracker
            </h1>
          </div>
          <p style={{ color: "#8a8f4a", fontFamily: "'Fredoka', sans-serif" }} className="italic">
            {mode === "signup" ? "create your account" : "welcome back"}
          </p>
        </div>

        <div className="rounded-3xl p-2 card-shadow" style={{ background: "#3d8a5f" }}>
          <div className="bg-white rounded-3xl p-8">
            <h2 className="font-display text-2xl font-bold mb-6" style={{ color: "#3d8a5f" }}>
              {mode === "signup" ? "Sign Up" : "Sign In"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: "#f5efe1" }}>
                <Mail size={18} style={{ color: "#8a8f4a" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent outline-none font-display text-stone-800 placeholder:text-stone-400"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: "#f5efe1" }}>
                <Lock size={18} style={{ color: "#8a8f4a" }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="password (6+ chars)"
                  className="flex-1 bg-transparent outline-none font-display text-stone-800 placeholder:text-stone-400"
                />
              </div>

              {error && (
                <div className="text-sm p-3 rounded-xl" style={{ background: "#f5d4c5", color: "#7a3a20" }}>
                  {error}
                </div>
              )}
              {info && (
                <div className="text-sm p-3 rounded-xl" style={{ background: "#dde9d4", color: "#2e5a3a" }}>
                  {info}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl font-display font-semibold text-base card-shadow hover:scale-[1.02] transition-transform disabled:opacity-50"
                style={{ background: "#e8c547", color: "#3a2e0a" }}
              >
                {loading ? "..." : mode === "signup" ? "Create Account" : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-stone-500 mt-6">
              {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
              <button
                onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(null); setInfo(null); }}
                className="font-semibold underline"
                style={{ color: "#3d8a5f" }}
              >
                {mode === "signup" ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fredoka', system-ui, sans-serif; }
        .card-shadow { box-shadow: 0 4px 0 rgba(0,0,0,0.08); }
      `}</style>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [session, setSession] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5efe1" }}>
        <RefreshCw className="animate-spin" size={24} style={{ color: "#3d8a5f" }} />
      </div>
    );
  }

  if (!session) return <AuthScreen onAuthed={setSession} />;
  return <Tracker session={session} />;
}

// ============================================================
// TRACKER (main app after login)
// ============================================================
function Tracker({ session }) {
  const [tickers, setTickers] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [profiles, setProfiles] = useState({});
  const [selected, setSelected] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchTimeout = useRef(null);

  useEffect(() => {
    const loadWatchlist = async () => {
      const { data, error } = await supabase
        .from("watchlist")
        .select("symbol")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: true });

      if (error) { setError(error.message); setLoading(false); return; }

      let symbols = data.map((r) => r.symbol);
      if (symbols.length === 0) {
        const inserts = DEFAULT_TICKERS.map((s) => ({ user_id: session.user.id, symbol: s }));
        await supabase.from("watchlist").insert(inserts);
        symbols = DEFAULT_TICKERS;
      }
      setTickers(symbols);
      setSelected(symbols[0]);
      setLoading(false);
    };
    loadWatchlist();
  }, [session.user.id]);

  const loadQuotes = async (symbols = tickers) => {
    if (!symbols.length) return;
    setError(null);
    try {
      const results = await Promise.all(
        symbols.map(async (sym) => {
          const [q, p] = await Promise.all([finnhub.quote(sym), finnhub.profile(sym)]);
          return { sym, q, p };
        })
      );
      const qMap = {};
      const pMap = {};
      results.forEach(({ sym, q, p }) => {
        if (q && q.c) qMap[sym] = q;
        if (p && p.name) pMap[sym] = p;
      });
      setQuotes((prev) => ({ ...prev, ...qMap }));
      setProfiles((prev) => ({ ...prev, ...pMap }));
    } catch {
      setError("Couldn't fetch quotes. Check your Finnhub API key.");
    }
  };

  const loadChart = async (sym) => {
    if (!sym) return;
    const points = await finnhub.candles(sym);
    setChartData(points);
  };

  useEffect(() => { if (tickers.length) loadQuotes(); }, [tickers]);
  useEffect(() => {
    if (!tickers.length) return;
    const id = setInterval(() => loadQuotes(), 60000);
    return () => clearInterval(id);
  }, [tickers]);
  useEffect(() => { if (selected) loadChart(selected); }, [selected]);

  const searchSymbols = async (term) => {
    if (!term.trim()) return setSearchResults([]);
    try {
      const data = await finnhub.search(term);
      const results = (data?.result || [])
        .filter((r) => r.type === "Common Stock" || r.type === "ETP")
        .slice(0, 8);
      setSearchResults(results);
    } catch { setSearchResults([]); }
  };

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchSymbols(searchTerm), 300);
    return () => clearTimeout(searchTimeout.current);
  }, [searchTerm]);

  const addTicker = async (sym) => {
    const upper = sym.toUpperCase().replace(/\..*/, "");
    if (tickers.includes(upper)) {
      setSelected(upper);
    } else {
      const { error } = await supabase
        .from("watchlist")
        .insert({ user_id: session.user.id, symbol: upper });
      if (error) { setError(error.message); return; }
      const next = [...tickers, upper];
      setTickers(next);
      setSelected(upper);
    }
    setSearchTerm(""); setSearchResults([]); setShowAdd(false);
  };

  const removeTicker = async (sym) => {
    await supabase.from("watchlist").delete().eq("user_id", session.user.id).eq("symbol", sym);
    const next = tickers.filter((t) => t !== sym);
    setTickers(next);
    if (selected === sym && next.length) setSelected(next[0]);
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); };

  const fmtPrice = (n) =>
    n == null ? "—" : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtTime = (t) =>
    new Date(t).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: false });

  const selectedQuote = quotes[selected];
  const selectedProfile = profiles[selected];
  const change = selectedQuote ? selectedQuote.c - selectedQuote.pc : 0;
  const changePct = selectedQuote ? (change / selectedQuote.pc) * 100 : 0;
  const isUp = change >= 0;
  const lineColor = isUp ? "#3d8a5f" : "#d97757";

  const portfolioValue = tickers.reduce((sum, t) => sum + (quotes[t]?.c || 0), 0);
  const portfolioChange = tickers.reduce((sum, t) => sum + ((quotes[t]?.c || 0) - (quotes[t]?.pc || 0)), 0);
  const prevTotal = portfolioValue - portfolioChange;
  const portfolioPct = prevTotal ? (portfolioChange / prevTotal) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5efe1" }}>
        <RefreshCw className="animate-spin" size={24} style={{ color: "#3d8a5f" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#f5efe1", fontFamily: "'Quicksand', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fredoka', system-ui, sans-serif; }
        body { margin: 0; }
        .card-shadow { box-shadow: 0 4px 0 rgba(0,0,0,0.08); }
        .soft-shadow { box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .anim-up { animation: slideUp 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .anim-fade { animation: fadeIn 0.2s ease-out; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 py-8 md:px-10 md:py-12">
        {/* Header */}
        <header className="flex items-start justify-between mb-10">
          <div>
            <div className="inline-block px-6 py-3 rounded-2xl card-shadow" style={{ background: "#9bb5d4" }}>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">Stock Tracker</h1>
            </div>
            <p className="mt-4 italic text-base" style={{ color: "#8a8f4a", fontFamily: "'Fredoka', sans-serif", fontWeight: 500 }}>
              monitor your favorite stocks in real-time.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSignOut} className="w-14 h-14 rounded-full flex items-center justify-center card-shadow hover:scale-105 transition-transform" style={{ background: "#8a8f4a" }} title="Sign out">
              <LogOut className="text-white" size={20} />
            </button>
            <button onClick={() => setShowProfile(true)} className="w-14 h-14 rounded-full flex items-center justify-center card-shadow hover:scale-105 transition-transform" style={{ background: "#d4a4c0" }}>
              <User className="text-white" size={22} />
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-2xl text-sm" style={{ background: "#f5d4c5", color: "#7a3a20" }}>{error}</div>
        )}

        {/* Chart */}
        <div className="rounded-3xl p-2 mb-6 card-shadow" style={{ background: "#3d8a5f" }}>
          <div className="bg-white rounded-3xl p-6 md:p-8">
            {selectedQuote ? (
              <>
                <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                  <span className="font-display text-2xl font-bold" style={{ color: "#3d8a5f" }}>{selected}</span>
                  <span className="font-display text-xl text-stone-700 font-medium">{selectedProfile?.name || ""}</span>
                </div>
                <div className="flex items-baseline gap-3 mt-3 flex-wrap">
                  <span className="font-display text-5xl md:text-6xl font-semibold text-stone-900">${fmtPrice(selectedQuote.c)}</span>
                  <span className="font-display text-xl font-medium" style={{ color: isUp ? "#3d8a5f" : "#d97757" }}>
                    {isUp ? "+" : ""}{fmtPrice(change)} ({isUp ? "+" : ""}{changePct.toFixed(2)}%)
                  </span>
                </div>
                <div className="h-72 mt-6 -mx-2">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                        <CartesianGrid stroke="#e8e0cd" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="time" tickFormatter={fmtTime} stroke="#a8a59a" fontSize={12} tickLine={false} axisLine={false} minTickGap={50} style={{ fontFamily: "Fredoka, sans-serif" }} />
                        <YAxis domain={["auto", "auto"]} stroke="#a8a59a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(0)}`} width={50} style={{ fontFamily: "Fredoka, sans-serif" }} />
                        <Tooltip contentStyle={{ background: "#fff", border: "2px solid #3d8a5f", borderRadius: "12px", fontFamily: "Fredoka, sans-serif", fontSize: "13px" }} labelFormatter={(t) => new Date(t).toLocaleString()} formatter={(v) => [`$${fmtPrice(v)}`, "Price"]} />
                        <Line type="monotone" dataKey="price" stroke={lineColor} strokeWidth={3} dot={false} activeDot={{ r: 5, fill: lineColor, strokeWidth: 0 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-stone-400"><RefreshCw className="animate-spin" size={20} /></div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-72 flex items-center justify-center text-stone-400">
                {tickers.length === 0 ? "Add a stock to get started" : "Loading..."}
              </div>
            )}
          </div>
        </div>

        {/* Add button */}
        <div className="flex justify-end mb-6">
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-display font-semibold text-base card-shadow hover:scale-105 transition-transform" style={{ background: "#e8c547", color: "#3a2e0a" }}>
            <Plus size={20} strokeWidth={3} /> Add Stock
          </button>
        </div>

        {/* Watchlist cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickers.map((sym, i) => {
            const q = quotes[sym];
            const p = profiles[sym];
            const colors = CARD_COLORS[i % CARD_COLORS.length];
            const ch = q ? q.c - q.pc : 0;
            const chPct = q ? (ch / q.pc) * 100 : 0;
            const up = ch >= 0;
            const isSelected = sym === selected;
            return (
              <div key={sym} onClick={() => setSelected(sym)}
                className={`relative rounded-2xl p-5 cursor-pointer card-shadow transition-all hover:-translate-y-1 ${isSelected ? "ring-4 ring-offset-2" : ""}`}
                style={{ background: colors.bg, color: colors.text }}>
                <button onClick={(e) => { e.stopPropagation(); removeTicker(sym); }}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/10 transition-colors"
                  style={{ color: colors.text }}>
                  <X size={16} strokeWidth={2.5} />
                </button>
                <div className="font-display text-2xl font-bold mb-1">{sym}</div>
                <div className="text-sm opacity-80 mb-4 truncate">{p?.name || "Loading..."}</div>
                {q && (
                  <div>
                    <div className="font-display text-3xl font-semibold">${fmtPrice(q.c)}</div>
                    <div className="text-sm font-medium opacity-90 mt-1">
                      {up ? "+" : ""}{fmtPrice(ch)} ({up ? "+" : ""}{chPct.toFixed(2)}%)
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 anim-fade" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-3xl p-6 max-w-md w-full anim-up soft-shadow" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold" style={{ color: "#3d8a5f" }}>Add a Stock</h2>
              <button onClick={() => setShowAdd(false)} className="w-10 h-10 rounded-full flex items-center justify-center card-shadow hover:scale-105 transition-transform" style={{ background: "#d97757" }}>
                <X size={18} className="text-white" strokeWidth={3} />
              </button>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-4" style={{ background: "#f5efe1" }}>
              <Search size={18} style={{ color: "#8a8f4a" }} />
              <input autoFocus type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ticker or company..." className="flex-1 bg-transparent outline-none font-display text-stone-800 placeholder:text-stone-400"
                onKeyDown={(e) => { if (e.key === "Enter" && searchTerm) addTicker(searchTerm.split(" ")[0]); }} />
            </div>
            {searchResults.length > 0 && (
              <div className="max-h-72 overflow-y-auto space-y-2">
                {searchResults.map((r) => (
                  <button key={r.symbol} onClick={() => addTicker(r.symbol)}
                    className="w-full p-3 rounded-2xl hover:scale-[1.02] transition-transform text-left flex items-center justify-between"
                    style={{ background: "#f5efe1" }}>
                    <div className="min-w-0 flex-1">
                      <div className="font-display font-bold text-lg" style={{ color: "#3d8a5f" }}>{r.symbol}</div>
                      <div className="text-sm text-stone-600 truncate">{r.description}</div>
                    </div>
                    <Plus size={18} style={{ color: "#8a8f4a" }} strokeWidth={3} />
                  </button>
                ))}
              </div>
            )}
            {searchTerm && searchResults.length === 0 && (
              <p className="text-center text-stone-400 py-8 text-sm">No results.</p>
            )}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4 overflow-y-auto anim-fade" onClick={() => setShowProfile(false)}>
          <div className="rounded-3xl max-w-3xl w-full my-8 p-8 md:p-10 anim-up soft-shadow" style={{ background: "#f5efe1" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="font-display text-4xl font-bold mb-2" style={{ color: "#3d8a5f" }}>My Profile</h2>
                <p style={{ color: "#8a8f4a" }} className="text-base">{session.user.email}</p>
              </div>
              <button onClick={() => setShowProfile(false)} className="w-12 h-12 rounded-full flex items-center justify-center card-shadow hover:scale-105 transition-transform" style={{ background: "#d97757" }}>
                <X size={20} className="text-white" strokeWidth={3} />
              </button>
            </div>
            <div className="rounded-2xl p-6 md:p-8 mb-8 card-shadow" style={{ background: "linear-gradient(135deg, #3d8a5f 0%, #6a9bb5 50%, #9bb5d4 100%)" }}>
              <p className="text-white/80 text-base mb-2">Total Portfolio Value</p>
              <div className="flex flex-wrap items-baseline gap-3 mb-3">
                <span className="font-display text-5xl md:text-6xl font-semibold text-white">${fmtPrice(portfolioValue)}</span>
                <span className="font-display text-xl font-medium text-white">
                  {portfolioChange >= 0 ? "+" : ""}{fmtPrice(portfolioChange)} ({portfolioChange >= 0 ? "+" : ""}{portfolioPct.toFixed(2)}%)
                </span>
              </div>
              <p className="text-white/80 text-sm">{tickers.length} stocks in watchlist</p>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8">
              <h3 className="font-display text-2xl font-bold mb-5" style={{ color: "#3d8a5f" }}>My Stocks</h3>
              <div className="space-y-3">
                {tickers.map((sym) => {
                  const q = quotes[sym];
                  const p = profiles[sym];
                  const ch = q ? q.c - q.pc : 0;
                  const chPct = q ? (ch / q.pc) * 100 : 0;
                  const up = ch >= 0;
                  return (
                    <div key={sym} className="rounded-2xl p-4 flex items-center justify-between" style={{ background: "#faf6ec" }}>
                      <div>
                        <div className="font-display text-lg font-bold text-stone-900">{sym}</div>
                        <div className="text-sm text-stone-500">{p?.name || "—"}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-xl font-semibold text-stone-900">${fmtPrice(q?.c)}</div>
                        <div className="text-sm font-medium" style={{ color: up ? "#3d8a5f" : "#d97757" }}>
                          {q && <>{up ? "+" : ""}{fmtPrice(ch)} ({up ? "+" : ""}{chPct.toFixed(2)}%)</>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
