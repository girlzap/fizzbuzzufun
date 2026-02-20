import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ComicButton } from "@/components/ComicButton";
import { GameCard } from "@/components/GameCard";
import { useSubmitScore } from "@/hooks/use-scores";
import { ArrowLeft, RefreshCw, Trophy } from "lucide-react";
import { z } from "zod";

type GameState = "playing" | "game_over";
type Feedback = "none" | "correct" | "wrong";

export default function Game() {
  const [location, setLocation] = useLocation();
  const [score, setScore] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [feedback, setFeedback] = useState<Feedback>("none");
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitScore = useSubmitScore();

  // Initialize game
  useEffect(() => {
    generateNumber();
  }, []);

  const generateNumber = () => {
    // Generate random number 1-100
    // To make it fun, ensure we get a decent distribution of Fizz/Buzz/FizzBuzz
    // Weighted slightly towards having matches so it's not boring
    let num = Math.floor(Math.random() * 100) + 1;
    setCurrentNumber(num);
  };

  const checkAnswer = (type: "fizz" | "buzz" | "fizzbuzz" | "none") => {
    let isCorrect = false;

    if (currentNumber % 15 === 0) {
      isCorrect = type === "fizzbuzz";
    } else if (currentNumber % 5 === 0) {
      isCorrect = type === "buzz";
    } else if (currentNumber % 3 === 0) {
      isCorrect = type === "fizz";
    } else {
      isCorrect = type === "none";
    }

    if (isCorrect) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  const handleCorrect = () => {
    setFeedback("correct");
    setScore(s => s + 1);
    
    // Confetti for milestones
    if ((score + 1) % 5 === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF69B4', '#00BFFF', '#FFD700', '#32CD32']
      });
    }

    setTimeout(() => {
      setFeedback("none");
      generateNumber();
    }, 600); // Wait for animation
  };

  const handleWrong = () => {
    setFeedback("wrong");
    setGameState("game_over");
  };

  const handlePlayAgain = () => {
    setScore(0);
    setGameState("playing");
    setFeedback("none");
    generateNumber();
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSubmitting(true);
    try {
      await submitScore.mutateAsync({
        playerName: playerName,
        score: score
      });
      setLocation("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI Components helpers
  const FeedbackOverlay = () => (
    <AnimatePresence>
      {feedback === "correct" && (
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1.5, rotate: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <span className="text-8xl font-black text-green-500 drop-shadow-lg stroke-white stroke-2">
            Awesome!
          </span>
        </motion.div>
      )}
      {feedback === "wrong" && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1.2 }}
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <span className="text-8xl font-black text-red-500 drop-shadow-lg">
            Oops!
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (gameState === "game_over") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <GameCard className="w-full max-w-md text-center space-y-8">
          <div className="space-y-2">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto drop-shadow-sm mb-4" />
            <h2 className="text-4xl font-black text-slate-800">Game Over!</h2>
            <p className="text-xl text-slate-500">You scored {score} points</p>
          </div>

          <form onSubmit={handleSubmitScore} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold text-slate-400 uppercase tracking-wider block">
                Enter your name
              </label>
              <input
                id="name"
                type="text"
                autoFocus
                maxLength={12}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Super Player"
                className="w-full px-6 py-4 text-center text-2xl font-black rounded-2xl border-4 border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all bg-slate-50 text-slate-800 placeholder:text-slate-300"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <ComicButton 
                type="button" 
                onClick={handlePlayAgain}
                variant="neutral"
                block
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Replay
              </ComicButton>
              <ComicButton 
                type="submit" 
                disabled={!playerName.trim() || isSubmitting}
                block
              >
                {isSubmitting ? "Saving..." : "Save Score"}
              </ComicButton>
            </div>
          </form>
        </GameCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4">
      {/* Header */}
      <header className="flex items-center justify-between max-w-4xl mx-auto w-full mb-8 pt-4">
        <ComicButton 
          variant="neutral" 
          size="sm" 
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Exit
        </ComicButton>
        <div className="bg-white px-6 py-2 rounded-2xl border-b-4 border-slate-200 font-black text-2xl text-slate-700 shadow-sm">
          Score: <span className="text-primary">{score}</span>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full gap-12 pb-12 relative">
        <FeedbackOverlay />

        {/* The Number Display */}
        <motion.div 
          key={currentNumber}
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
          <div className="bg-white w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center border-8 border-slate-100 shadow-xl relative z-10">
            <span className="text-8xl md:text-9xl font-black text-slate-800 font-display">
              {currentNumber}
            </span>
          </div>
        </motion.div>

        {/* Controls Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <ComicButton 
            size="xl" 
            variant="secondary" 
            onClick={() => checkAnswer("fizz")}
            className="h-32 md:h-40"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl mb-1">Fizz</span>
              <span className="text-sm opacity-80 font-normal">Divisible by 3</span>
            </div>
          </ComicButton>

          <ComicButton 
            size="xl" 
            variant="accent" 
            onClick={() => checkAnswer("buzz")}
            className="h-32 md:h-40"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl mb-1">Buzz</span>
              <span className="text-sm opacity-80 font-normal">Divisible by 5</span>
            </div>
          </ComicButton>

          <ComicButton 
            size="xl" 
            variant="primary" 
            onClick={() => checkAnswer("fizzbuzz")}
            className="h-32 md:h-40 col-span-2 md:col-span-1"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl mb-1">FizzBuzz</span>
              <span className="text-sm opacity-80 font-normal">Divisible by 15</span>
            </div>
          </ComicButton>

          <ComicButton 
            size="xl" 
            variant="neutral" 
            onClick={() => checkAnswer("none")}
            className="h-32 md:h-40 col-span-2 md:col-span-1"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl mb-1 text-slate-400">None</span>
              <span className="text-sm opacity-60 font-normal text-slate-400">Not divisible</span>
            </div>
          </ComicButton>
        </div>
      </main>
    </div>
  );
}
