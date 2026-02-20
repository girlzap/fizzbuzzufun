import { Link } from "wouter";
import { ComicButton } from "@/components/ComicButton";
import { Leaderboard } from "@/components/Leaderboard";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";

export default function Home() {
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
        <p className="text-xl text-slate-500 font-medium max-w-md mx-auto">
          Test your math reflexes! Divisible by 3? <strong>Fizz!</strong> By 5? <strong>Buzz!</strong> By both? <strong>FizzBuzz!</strong>
        </p>
      </motion.div>

      <div className="w-full max-w-md space-y-8">
        <Link href="/game">
          <ComicButton 
            size="xl" 
            block 
            className="group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Play className="w-8 h-8 fill-current" />
              Start Playing
            </span>
            <motion.div 
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </ComicButton>
        </Link>

        <div className="relative">
          <div className="absolute -top-6 -left-6 text-yellow-400 animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>
          <Leaderboard />
          <div className="absolute -bottom-4 -right-4 text-primary animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
