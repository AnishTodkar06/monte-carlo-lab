"use client";

import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { BaseSimResponse } from "@/types/simulation";
import MetricCards from "@/components/common/MetricCards";
import ConvergenceChart from "@/components/common/ConvergenceChart";

export default function CoinExperiment() {
  const [bias, setBias] = useState<number>(0.5);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<BaseSimResponse | null>(null);

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

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const result: BaseSimResponse = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const lastResult = data?.results[data.results.length - 1];

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <h2 className="text-2xl font-bold text-white">Coin Toss & Law of Large Numbers</h2>
        <p className="text-slate-400 text-sm mt-1">
          Simulate Bernoulli trials to see how relative error decays at rate 1/√N.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
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
          {loading ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
          {loading ? "Simulating..." : "Run Simulation"}
        </button>
      </div>

      {/* Output */}
      {data && (
        <div className="space-y-6">
          <MetricCards
            theoretical={data.theoretical}
            empirical={lastResult?.empirical}
            absError={lastResult?.abs_error}
          />
          <ConvergenceChart theoretical={data.theoretical} results={data.results} />
          
          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
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
                    <td className="p-4 text-slate-400">{row.heads?.toLocaleString()} / {row.tails?.toLocaleString()}</td>
                    <td className="p-4 text-blue-400 font-bold">{(row.empirical * 100).toFixed(3)}%</td>
                    <td className="p-4 text-rose-400">{(row.abs_error * 100).toFixed(4)}%</td>
                    <td className="p-4 text-slate-400">{row.pct_error?.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}