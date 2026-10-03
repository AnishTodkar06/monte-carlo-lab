"use client";

import { useState } from "react";
import { Coins, Dice5, Users, DoorOpen, Layers, DollarSign, Footprints } from "lucide-react";
import CoinExperiment from "@/components/experiments/CoinExperiment";
import ClientOnly from "@/components/common/ClientOnly";

const EXPERIMENTS = [
  { id: "coin", name: "Coin Toss", icon: Coins, active: true },
  { id: "dice", name: "Dice Rolls", icon: Dice5, active: false },
  { id: "birthday", name: "Birthday Paradox", icon: Users, active: false },
  { id: "monty_hall", name: "Monty Hall", icon: DoorOpen, active: false },
  { id: "cards", name: "Card Flush", icon: Layers, active: false },
  { id: "gamblers_ruin", name: "Gambler's Ruin", icon: DollarSign, active: false },
  { id: "random_walk", name: "Random Walk", icon: Footprints, active: false },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("coin");

  return (
    <ClientOnly>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950 p-4 md:p-6 shrink-0">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
            <h1 className="font-bold text-lg text-white tracking-tight">Monte Carlo Lab</h1>
          </div>

          <nav className="space-y-1">
            <p className="text-xs font-mono uppercase text-slate-500 px-3 mb-2">Experiments</p>
            {EXPERIMENTS.map((exp) => {
              const Icon = exp.icon;
              const isSelected = activeTab === exp.id;
              return (
                <button
                  key={exp.id}
                  onClick={() => exp.active && setActiveTab(exp.id)}
                  disabled={!exp.active}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : exp.active
                      ? "text-slate-300 hover:bg-slate-900 hover:text-white"
                      : "text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{exp.name}</span>
                  </div>
                  {!exp.active && (
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-500">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 p-6 md:p-10 max-w-5xl overflow-y-auto">
          {activeTab === "coin" && <CoinExperiment />}
        </main>

      </div>
    </ClientOnly>
  );
}