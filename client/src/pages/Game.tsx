import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ComicButton } from "@/components/ComicButton";
import { GameCard } from "@/components/GameCard";
import { ArrowLeft, RefreshCw, Trophy } from "lucide-react";

type GameState = "playing" | "game_over";
type Feedback = "none" | "correct" | "wrong";

export default function Game() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const mode = (searchParams.get("mode") as "hard" | "easy" | "learn") || "hard";
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(mode === "learn" ? 1 : 3);
  const [timeLeft, setTimeLeft] = useState(5);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [nextLearnNumber, setNextLearnNumber] = useState(1);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [feedback, setFeedback] = useState<Feedback>("none");
  // Initialize game
  useEffect(() => {
    generateNumber();
  }, []);

  // Timer for Hard Mode
  useEffect(() => {
    if (gameState !== "playing" || mode !== "hard" || feedback !== "none") return;

    if (timeLeft <= 0) {
      handleWrong(true); // true means it was a timeout
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameState, mode, feedback]);

  const generateNumber = () => {
    setTimeLeft(5);
    let num: number;
    
    if (mode === "easy") {
      // Easy mode weighting: 53% None, ~15.67% each for Fizz, Buzz, FizzBuzz
      const rand = Math.random();
      if (rand < 0.53) {
        // None: numbers not divisible by 3 or 5
        const nonMatches = [];
        for (let i = 1; i <= 100; i++) {
          if (i % 3 !== 0 && i % 5 !== 0) nonMatches.push(i);
        }
        num = nonMatches[Math.floor(Math.random() * nonMatches.length)];
      } else {
        const remainingProb = (1 - 0.53) / 3;
        const subRand = Math.random();
        
        if (subRand < 1/3) {
          // Fizz: divisible by 3 but not 15
          const fizzes = [];
          for (let i = 1; i <= 100; i++) {
            if (i % 3 === 0 && i % 15 !== 0) fizzes.push(i);
          }
          num = fizzes[Math.floor(Math.random() * fizzes.length)];
        } else if (subRand < 2/3) {
          // Buzz: divisible by 5 but not 15
          const buzzes = [];
          for (let i = 1; i <= 100; i++) {
            if (i % 5 === 0 && i % 15 !== 0) buzzes.push(i);
          }
          num = buzzes[Math.floor(Math.random() * buzzes.length)];
        } else {
          // FizzBuzz: divisible by 15
          const fizzbuzzes = [];
          for (let i = 1; i <= 100; i++) {
            if (i % 15 === 0) fizzbuzzes.push(i);
          }
          num = fizzbuzzes[Math.floor(Math.random() * fizzbuzzes.length)];
        }
      }
    } else if (mode === "learn") {
      // Learn mode: Sequential order
      num = nextLearnNumber;
      setNextLearnNumber(prev => prev + 1);
    } else {
      // Hard mode: Standard 1-100 random
      num = Math.floor(Math.random() * 100) + 1;
    }
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

  const handleWrong = (isTimeout = false) => {
    setFeedback("wrong");
    
    if (mode !== "learn") {
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives <= 0) {
        setGameState("game_over");
      } else {
        setTimeout(() => {
          setFeedback("none");
          generateNumber();
        }, 1000);
      }
    } else {
      setTimeout(() => setFeedback("none"), 1000);
    }
  };

  const handlePlayAgain = () => {
    setScore(0);
    setLives(mode === "learn" ? 1 : 3);
    setNextLearnNumber(1);
    setGameState("playing");
    setFeedback("none");
    generateNumber();
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
          exit={{ scale: 0, opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-8xl font-black text-red-500 drop-shadow-lg">
              {timeLeft <= 0 && mode === "hard" ? "Time's Up!" : "Oops!"}
            </span>
            {mode === "learn" ? (
              <span className="text-2xl font-bold text-slate-600 bg-white/80 px-6 py-2 rounded-full border-2 border-slate-200 shadow-sm">
                Try again! You can do it!
              </span>
            ) : lives > 0 ? (
              <span className="text-2xl font-bold text-red-500 bg-white/80 px-6 py-2 rounded-full border-2 border-red-200 shadow-sm">
                {lives} {lives === 1 ? "life" : "lives"} left!
              </span>
            ) : null}
          </div>
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

          <div className="grid grid-cols-2 gap-4">
            <ComicButton onClick={handlePlayAgain} variant="neutral" block>
              <RefreshCw className="w-5 h-5 mr-2" />
              Play Again
            </ComicButton>
            <ComicButton onClick={() => setLocation("/")} block>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Home
            </ComicButton>
          </div>
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
        <div className="flex items-center gap-4">
          {mode !== "learn" && (
            <div className="bg-white px-4 py-2 rounded-2xl border-b-4 border-slate-200 font-black text-xl flex gap-1 shadow-sm">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={i < lives ? "text-red-500" : "text-slate-200"}>
                  ❤️
                </span>
              ))}
            </div>
          )}
          {mode === "hard" && gameState === "playing" && (
            <div className={`bg-white px-6 py-2 rounded-2xl border-b-4 ${timeLeft <= 2 ? "border-red-500 text-red-500" : "border-slate-200 text-slate-700"} font-black text-2xl shadow-sm transition-colors`}>
              ⏱️ {timeLeft}s
            </div>
          )}
          <div className="bg-white px-6 py-2 rounded-2xl border-b-4 border-slate-200 font-black text-2xl text-slate-700 shadow-sm">
            Score: <span className="text-primary">{score}</span>
          </div>
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
