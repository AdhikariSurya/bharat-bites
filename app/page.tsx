"use client";

import { useGame } from "@/context/GameContext";
import { GameMap } from "@/components/GameMap";
import { GuessInput } from "@/components/GuessInput";
import Image from "next/image";
import { AlertCircle, CheckCircle2, MapPin } from "lucide-react";
import clsx from "clsx";

export default function Home() {
  const { 
    currentDish, 
    guesses, 
    maxGuesses, 
    gameStatus, 
    makeGuess, 
    currentRound, 
    maxRounds,
    nextRound,
    restartGame,
    score,
    history
  } = useGame();

  if (!currentDish && gameStatus !== 'game_over') return <div className="p-10 text-center">Loading game...</div>;

  // Render Game Over Screen
  if (gameStatus === 'game_over') {
    return (
      <div className="max-w-2xl mx-auto p-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Game Over!</h1>
        <p className="text-xl text-stone-600 mb-8">Final Score: <span className="font-bold text-stone-900">{score}</span> / 25,000</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {history.map((dish, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-stone-200">
              <div className="relative h-32 w-full mb-2">
                <Image 
                  src={dish.image} 
                  alt={dish.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <p className="font-medium text-sm">{dish.name}</p>
              <p className="text-xs text-stone-500">{dish.origins.join(", ")}</p>
            </div>
          ))}
        </div>

        <button 
          onClick={restartGame}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
        >
          Play Again
        </button>
      </div>
    );
  }

  // Render Round Result (Win/Loss)
  if (gameStatus === 'round_won' || gameStatus === 'round_lost') {
    return (
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-stone-200">
          <div className={clsx("p-6 text-center text-white", gameStatus === 'round_won' ? "bg-green-600" : "bg-red-600")}>
            <h2 className="text-3xl font-bold mb-1">
              {gameStatus === 'round_won' ? "Correct!" : "Round Over"}
            </h2>
            <p className="opacity-90">
              The answer was <span className="font-bold">{currentDish?.origins.join(" or ")}</span>
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="relative h-48 w-full md:w-1/2 rounded-lg overflow-hidden shadow-md">
                 <Image 
                  src={currentDish!.image} 
                  alt={currentDish!.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:w-1/2 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-stone-900">{currentDish!.name}</h3>
                  <p className="text-stone-600 text-sm mt-1">{currentDish!.description}</p>
                </div>
                
                <div className="bg-stone-50 p-3 rounded-md border border-stone-100">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Ingredients</p>
                  <p className="text-sm">{currentDish!.ingredients.join(", ")}</p>
                </div>
              </div>
            </div>

            {/* Map Visualization */}
            <div className="w-full h-64 md:h-80 bg-stone-100 rounded-lg overflow-hidden mb-6 border border-stone-200">
               <GameMap 
                  correctStates={currentDish!.origins} 
                  incorrectStates={guesses.map(g => g.state)} 
               />
            </div>

            <button 
              onClick={nextRound}
              className="w-full bg-stone-900 hover:bg-black text-white font-bold py-3 rounded-lg transition-colors"
            >
              {currentRound < maxRounds ? "Next Round" : "See Final Score"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Active Game
  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center py-4 mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">BharatBites</h1>
          <p className="text-xs text-stone-500">Round {currentRound} of {maxRounds}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-mono font-bold text-orange-600">{score}</p>
          <p className="text-xs text-stone-500">Score</p>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-grow flex flex-col gap-6">
        {/* Hero Image */}
        <div className="relative w-full aspect-[4/3] bg-stone-200 rounded-xl overflow-hidden shadow-md">
          {currentDish && (
            <Image 
              src={currentDish.image} 
              alt="Guess the dish"
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Guess Tracker */}
        <div className="flex gap-1 justify-center">
          {[...Array(maxGuesses)].map((_, i) => (
            <div 
              key={i} 
              className={clsx(
                "h-2 w-8 rounded-full transition-all",
                i < guesses.length 
                  ? "bg-red-500" 
                  : "bg-stone-200"
              )}
            />
          ))}
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <GuessInput onGuess={makeGuess} disabled={guesses.length >= maxGuesses} />
          
          {/* Hints Area */}
          <div className="min-h-[60px] text-center">
            {guesses.length >= 2 && (
              <div className="animate-fade-in text-sm text-stone-600 bg-stone-100 py-2 px-3 rounded-lg inline-block">
                <span className="font-bold">Dish Name:</span> {currentDish?.name}
              </div>
            )}
            {guesses.length >= 3 && (
              <div className="mt-2 animate-fade-in text-sm text-stone-600 bg-stone-100 py-2 px-3 rounded-lg inline-block max-w-[90%]">
                <span className="font-bold">Hint:</span> {currentDish?.ingredients.join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* Guesses List */}
        <div className="space-y-2 mt-auto pb-6">
          {guesses.map((guess, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white border border-stone-200 p-3 rounded-lg shadow-sm animate-slide-up">
              <div className="flex items-center gap-3">
                <span className="text-stone-400 font-mono text-sm">0{idx + 1}</span>
                <span className="font-medium">{guess.state}</span>
              </div>
              <div className={clsx("flex items-center gap-2 text-sm font-bold", guess.temperature.color)}>
                {guess.distance} km — {guess.temperature.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
