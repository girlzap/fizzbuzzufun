import { useScores } from "@/hooks/use-scores";
import { Trophy, Medal } from "lucide-react";
import { motion } from "framer-motion";
import { GameCard } from "./GameCard";

export function Leaderboard({ mode }: { mode?: string }) {
  const { data: scores, isLoading } = useScores(mode);

  if (isLoading) {
    return (
      <GameCard className="w-full max-w-md mx-auto">
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
        </div>
      </GameCard>
    );
  }

  // API already filters if mode is provided, but we ensure sorting
  const topScores = scores?.sort((a, b) => b.score - a.score).slice(0, 5) || [];

  return (
    <GameCard className="w-full max-w-md mx-auto bg-gradient-to-b from-white to-slate-50">
      <div className="flex flex-col items-center justify-center gap-1 mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-accent animate-bounce" />
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Top Players</h2>
        </div>
        {mode && (
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {mode} Mode
          </span>
        )}
      </div>

      <div className="space-y-3">
        {topScores.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-medium">
            No scores yet! Be the first!
          </div>
        ) : (
          topScores.map((score, index) => (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-slate-100 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2
                  ${index === 0 ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 
                    index === 1 ? 'bg-slate-100 text-slate-700 border-slate-300' :
                    index === 2 ? 'bg-orange-100 text-orange-700 border-orange-300' :
                    'bg-white text-slate-500 border-slate-100'}
                `}>
                  {index + 1}
                </div>
                <span className="font-bold text-lg text-slate-700">{score.playerName}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg font-black font-mono">
                {score.score}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </GameCard>
  );
}
