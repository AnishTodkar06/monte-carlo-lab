import { CheckCircle2, AlertCircle } from "lucide-react";

interface MetricCardsProps {
  theoretical: number;
  empirical?: number;
  absError?: number;
  unit?: string;
}

export default function MetricCards({ theoretical, empirical, absError, unit = "%" }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
          Theoretical Truth
        </span>
        <p className="text-3xl font-mono font-bold text-blue-400 mt-2">
          {(theoretical * 100).toFixed(2)}{unit}
        </p>
        <span className="text-xs text-slate-500 mt-1 block">Exact mathematical expectation</span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Empirical (Highest N)
        </span>
        <p className="text-3xl font-mono font-bold text-emerald-400 mt-2">
          {empirical !== undefined ? (empirical * 100).toFixed(2) : "--"}{unit}
        </p>
        <span className="text-xs text-slate-500 mt-1 block">Simulated frequency</span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-rose-400" /> Final Absolute Error
        </span>
        <p className="text-3xl font-mono font-bold text-rose-400 mt-2">
          {absError !== undefined ? (absError * 100).toFixed(4) : "--"}{unit}
        </p>
        <span className="text-xs text-slate-500 mt-1 block">Difference |P_sim - P_theory|</span>
      </div>
    </div>
  );
}