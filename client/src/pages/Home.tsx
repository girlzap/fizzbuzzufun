import { Link } from "wouter";
import { ComicButton } from "@/components/ComicButton";
import { motion } from "framer-motion";
import { Play, Zap, GraduationCap, Trophy } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [selectedMode, setSelectedMode] = useState<"hard" | "easy" | "learn">(
    "hard",
  );

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center max-w-7xl mx-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="text-center mb-12 space-y-4"
      >
        <span className="inline-block px-4 py-1 bg-accent/20 text-accent-foreground rounded-full text-sm font-bold uppercase tracking-wider mb-2 border border-accent/30">
          Math has never been this fun!
        </span>
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary drop-shadow-sm tracking-tight leading-tight">
          FizzBuzz
          <br />
          <span className="text-slate-800">Master</span>
        </h1>
      </motion.div>

      <div className="w-full max-w-md space-y-6">
        <div className="bg-white p-6 rounded-3xl border-4 border-slate-100 shadow-sm space-y-4">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Play className="w-6 h-6 text-primary" />
            Pick a Mode
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => setSelectedMode("hard")}
              className={`w-full p-4 rounded-2xl border-4 transition-all text-left flex items-center gap-4 ${
                selectedMode === "hard"
                  ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                  : "border-slate-100 hover:border-slate-200 bg-white"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="font-black text-lg text-slate-800">
                  Hard Mode
                </div>
                <div className="text-sm text-slate-500">Fast and tricky!</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedMode("easy")}
              className={`w-full p-4 rounded-2xl border-4 transition-all text-left flex items-center gap-4 ${
                selectedMode === "easy"
                  ? "border-secondary bg-secondary/5 ring-4 ring-secondary/10"
                  : "border-slate-100 hover:border-slate-200 bg-white"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="font-black text-lg text-slate-800">
                  Easy Mode
                </div>
                <div className="text-sm text-slate-500">For beginners.</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedMode("learn")}
              className={`w-full p-4 rounded-2xl border-4 transition-all text-left flex items-center gap-4 ${
                selectedMode === "learn"
                  ? "border-accent bg-accent/5 ring-4 ring-accent/10"
                  : "border-slate-100 hover:border-slate-200 bg-white"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="font-black text-lg text-slate-800">
                  Learn Mode
                </div>
                <div className="text-sm text-slate-500">
                  No timers, just practice.
                </div>
              </div>
            </button>
          </div>
        </div>

        <Link href={`/game?mode=${selectedMode}`}>
          <ComicButton
            size="xl"
            block
            variant={
              selectedMode === "hard"
                ? "primary"
                : selectedMode === "easy"
                  ? "secondary"
                  : "accent"
            }
            className="group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Play className="w-8 h-8 fill-current" />
              Start{" "}
              {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}
            </span>
          </ComicButton>
        </Link>
      </div>
    </div>
  );
}
