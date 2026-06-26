import { useState, useEffect } from "react";
import Header from "./Components/header";
import Footer from "./Components/footer";
import Lobby from "./Components/lobby";
import QuestionCard from "./Components/questionCard";
import StatsSummary from "./Components/statsSummary";
import { questions } from "./data/questions";
import { getMuted, setMuted, playSound } from "../public/Utils/audio";

export default function App() {
  const [gameStage, setGameStage] = useState("lobby"); // 'lobby' | 'playing' | 'summary'
  const [playerName, setPlayerName] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Medio");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

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

  const handleStartGame = ({ playerName, difficulty, category }) => {
    setPlayerName(playerName);
    setSelectedDifficulty(difficulty);
    setSelectedCategory(category);

    // Filter questions based on category and difficulty
    let filtered = questions.filter((q) => {
      const matchCat = category === "Todos" || q.category === category;
      const matchDiff = q.difficulty === difficulty;
      return matchCat && matchDiff;
    });

    // Fallback: if not enough questions on selected difficulty + category, take all of that category
    if (filtered.length < 5) {
      filtered = questions.filter(
        (q) => category === "Todos" || q.category === category,
      );
    }

    // Shuffle and pick 5 questions (or up to 5)
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 5);

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

      // Update personal best scores in LocalStorage
      const currentCategoryBest = bestScores[selectedCategory] || 0;
      if (score > currentCategoryBest) {
        const updatedBests = {
          ...bestScores,
          [selectedCategory]: score,
        };
        setBestScores(updatedBests);
        localStorage.setItem(
          "engame_best_scores",
          JSON.stringify(updatedBests),
        );
      }
    }
  };

  const handleRestart = () => {
    setGameStage("lobby");
  };

  return (
    <div
      className="min-h-screen bg-indigo-950 text-white flex flex-col justify-between selection:bg-yellow-300 selection:text-indigo-950 pb-6"
      id="app-root"
    >
      <Header
        onRestart={handleRestart}
        muted={muted}
        onToggleMute={handleToggleMute}
      />
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
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={currentQuestions.length}
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
      <Footer />
    </div>
  );
}
