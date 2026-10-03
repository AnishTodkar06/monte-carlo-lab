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
import { TrendingUp } from "lucide-react";
import { SimRow } from "@/types/simulation";

interface ConvergenceChartProps {
  theoretical: number;
  results: SimRow[];
  unit?: string;
}

export default function ConvergenceChart({ theoretical, results, unit = "%" }: ConvergenceChartProps) {
  const chartData = results.map((r) => ({
    simulations: r.sample_size.toLocaleString(),
    empirical: +(r.empirical * 100).toFixed(3),
    theory: +(theoretical * 100).toFixed(3),
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="mb-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Convergence to Theoretical Limit
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Dashed red line = Mathematical target. Blue line = Monte Carlo estimation.
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="simulations" stroke="#64748b" tick={{ fontSize: 12 }} />
            <YAxis domain={["auto", "auto"]} unit={unit} stroke="#64748b" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f8fafc" }}
            />
            <ReferenceLine
              y={+(theoretical * 100).toFixed(2)}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              strokeWidth={2}
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
  );
}