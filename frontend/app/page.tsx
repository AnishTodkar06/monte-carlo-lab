"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Play, RotateCcw, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

interface SimRow {
  sample_size: number;
  heads: number;
  tails: number;
  empirical: number;
  abs_error: number;
  pct_error: number;
}

interface SimResponse {
  experiment: string;
  theoretical: number;
  results: SimRow[];
}

export default function Home() {
  const [bias, setBias] = useState<number>(0.5);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<SimResponse | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/simulate/coin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bias: bias,
          sample_sizes: [10, 100, 1000, 10000, 100000],
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const result: SimResponse = await res.json();
      setData(result);
    } catch (err) {
      console.error("Simulation failed:", err);
      alert("Failed to connect to Python backend! Check if Uvicorn is active at http://localhost:8000.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = data?.results.map((r) => ({
    simulations: r.sample_size.toLocaleString(),
    empirical: +(r.empirical * 100).toFixed(3),
    theory: +(data.theoretical * 100).toFixed(3),
  }));

  const lastResult = data?.results[data.results.length - 1];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
              PROJECT 1: PROBABILITY LAB
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-2">
            Coin Toss & The Law of Large Numbers
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Observe how empirical frequencies converge to analytical expectation as sample size grows from $10$ to $100,000$.
          </p>
        </header>

        {/* Controls Card */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-2/3 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-300">
                Theoretical Coin Bias: P(Heads)
              </label>
              <span className="text-lg font-mono font-bold text-blue-400">
                {(bias * 100).toFixed(0)}%
              </span>
            </div>
            
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={bias}
              onChange={(e) => setBias(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>10% (Heavy Tails)</span>
              <span>50% (Fair Coin)</span>
              <span>90% (Heavy Heads)</span>
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={loading}
            className="w-full md:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <RotateCcw className="w-5 h-5 animate-spin" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
            {loading ? "Simulating in Python..." : "Run Simulation"}
          </button>
        </section>

        {/* Results Area */}
        {data && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Theoretical Truth
                </span>
                <p className="text-3xl font-mono font-bold text-blue-400 mt-2">
                  {(data.theoretical * 100).toFixed(2)}%
                </p>
                <span className="text-xs text-slate-500 mt-1 block">Exact target probability</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Empirical Result (N = 100,000)
                </span>
                <p className="text-3xl font-mono font-bold text-emerald-400 mt-2">
                  {lastResult ? (lastResult.empirical * 100).toFixed(2) : "--"}%
                </p>
                <span className="text-xs text-slate-500 mt-1 block">Final sampled frequency</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400" /> Final Absolute Error
                </span>
                <p className="text-3xl font-mono font-bold text-rose-400 mt-2">
                  {lastResult ? (lastResult.abs_error * 100).toFixed(4) : "--"}%
                </p>
                  <span className="text-xs text-slate-500 mt-1 block">Difference |P_sim - P_theory|</span>
              </div>
            </div>

            {/* Convergence Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Convergence to Theoretical Limit
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Notice how the blue curve flattens onto the dashed red line as trials multiply.
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="simulations" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis domain={["auto", "auto"]} unit="%" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f8fafc" }}
                    />
                    <ReferenceLine
                      y={+(data.theoretical * 100).toFixed(2)}
                      stroke="#f43f5e"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      label={{ value: "Theoretical", fill: "#f43f5e", fontSize: 12, position: "top" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="empirical"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#3b82f6" }}
                      name="Empirical %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Comparison Data Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <h3 className="font-bold text-sm text-slate-300">Detailed Trials & Error Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">Simulations (N)</th>
                      <th className="p-4">Heads / Tails</th>
                      <th className="p-4">Empirical Prob</th>
                      <th className="p-4">Absolute Error</th>
                      <th className="p-4">% Error</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data.results.map((row) => (
                      <tr key={row.sample_size} className="hover:bg-slate-800/30 transition">
                        <td className="p-4 text-white font-medium">{row.sample_size.toLocaleString()}</td>
                        <td className="p-4 text-slate-400">
                          {row.heads.toLocaleString()} / {row.tails.toLocaleString()}
                        </td>
                        <td className="p-4 text-blue-400 font-bold">{(row.empirical * 100).toFixed(3)}%</td>
                        <td className="p-4 text-rose-400">{(row.abs_error * 100).toFixed(4)}%</td>
                        <td className="p-4 text-slate-400">{row.pct_error.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}