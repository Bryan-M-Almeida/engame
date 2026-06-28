import { useState, useEffect } from "react";
import Header from "./Components/header";
import Footer from "./Components/footer";
import Lobby from "./Components/lobby";
import QuestionCard from "./Components/questionCard";
import StatsSummary from "./Components/statsSummary";
import { questions } from "./Data/questions";
import { getMuted, setMuted, playSound } from "./Utils/audio";
import Hero from "./Components/hero";

export default function App() {
  const [gameStage, setGameStage] = useState("lobby"); // 'lobby' | 'playing' | 'summary'
  const [playerName, setPlayerName] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Medio");

  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  // Scoring states
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [speedPoints, setSpeedPoints] = useState(0);
  const [totalStreakBonus, setTotalStreakBonus] = useState(0);

  // High scores tracking
  const [bestScores, setBestScores] = useState(() => {
    const saved = localStorage.getItem("engame_best_scores");
    return saved ? JSON.parse(saved) : {};
  });

  const [muted, setMutedState] = useState(() => getMuted());

  // Set initial mute setting
  useEffect(() => {
    setMuted(muted);
  }, [muted]);

  const handleToggleMute = () => {
    const nextMute = !muted;
    setMutedState(nextMute);
    setMuted(nextMute);
  };

  const handleStartGame = ({ playerName, difficulty }) => {
    setPlayerName(playerName);
    setSelectedDifficulty(difficulty);

    const questionsQuantity = {
      Facil: 8,
      Medio: 12,
      Difícil: 16,
    };

    const totalQuestions = questionsQuantity[difficulty] ?? 5;

    const shuffled = [...questions].sort(() => Math.random() - 0.5);

    const selectedQuestions = shuffled.slice(0, totalQuestions);

    setCurrentQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setAnswers([]);

    // Reset points
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setSpeedPoints(0);
    setTotalStreakBonus(0);

    setGameStage("playing");
  };

  const handleAnswerSelected = (selectedOptionIndex, timeLeft) => {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isCorrect =
      selectedOptionIndex === currentQuestion.correctAnswerIndex;

    // Calculate score
    let ptsEarned = 0;
    let newStreak = streak;
    let streakBonus = 0;

    if (isCorrect) {
      // Base points based on remaining time (up to 1000)
      // <= 2 seconds -> 1000
      // 5 seconds -> 800
      // 10 seconds -> 500
      const timeTaken = 15 - timeLeft;
      if (timeTaken <= 2) {
        ptsEarned = 1000;
      } else if (timeTaken <= 5) {
        ptsEarned = 800;
      } else if (timeTaken <= 10) {
        ptsEarned = 500;
      } else {
        ptsEarned = 300; // minimum for correct
      }

      setSpeedPoints((prev) => prev + ptsEarned);

      // Streak tracking & bonus points
      newStreak += 1;
      if (newStreak >= 5) {
        streakBonus = 500;
      } else if (newStreak >= 3) {
        streakBonus = 250;
      } else if (newStreak >= 2) {
        streakBonus = 100;
      }

      if (streakBonus > 0) {
        setTotalStreakBonus((prev) => prev + streakBonus);
        setTimeout(() => {
          playSound("streak");
        }, 120);
      }
    } else {
      newStreak = 0;
    }

    setStreak(newStreak);
    if (newStreak > maxStreak) {
      setMaxStreak(newStreak);
    }

    const totalQuestionScore = ptsEarned + streakBonus;
    setScore((prev) => prev + totalQuestionScore);

    // Save answer log
    const newAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex,
      isCorrect,
      timeTaken: 15 - timeLeft,
      scoreEarned: ptsEarned,
      streakBonusEarned: streakBonus,
    };

    setAnswers((prev) => [...prev, newAnswer]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Game Over / Summary Stage
      setGameStage("summary");
      playSound("victory");
    }
  };

  const handleRestart = () => {
    setGameStage("lobby");
  };

  return (
    <div className="">
      <Header
        onRestart={handleRestart}
        muted={muted}
        onToggleMute={handleToggleMute}
      />
      <div
        className="min-h-screen bg-indigo-950 text-white flex flex-col items-center justify-between selection:bg-yellow-300 selection:text-indigo-950 pb-6"
        id="app-root"
      >
        <Hero />
        <main className="flex-grow flex items-center justify-center py-6 md:py-10 px-4">
          {gameStage === "lobby" && (
            <Lobby
              onStartGame={handleStartGame}
              bestScores={bestScores}
              muted={muted}
              onToggleMute={handleToggleMute}
            />
          )}
          {gameStage === "playing" && currentQuestions.length > 0 && (
            <QuestionCard
              question={currentQuestions[currentQuestionIndex]}
              totalQuestions={currentQuestions.length}
              questionNumber={currentQuestionIndex + 1}
              onAnswerSelected={handleAnswerSelected}
              onNextQuestion={handleNextQuestion}
              score={score}
              streak={streak}
            />
          )}
          {gameStage === "summary" && (
            <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
              <StatsSummary
                answers={answers}
                score={score}
                maxStreak={maxStreak}
                speedPoints={speedPoints}
                totalStreakBonus={totalStreakBonus}
                onRestart={handleRestart}
              />
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
