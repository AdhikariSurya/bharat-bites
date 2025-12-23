"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import dishesData from '@/data/dishes.json';
import { STATE_CENTROIDS, ALL_STATES } from '@/data/state-centroids';
import { calculateDistance, getTemperature } from '@/utils/haversine';
import { fetchWikiImage } from '@/utils/wiki-api';

// Types
export type Dish = {
  id: string;
  name: string;
  image: string; // Initially from JSON, then updated via API
  origins: string[];
  ingredients: string[];
  description: string;
  wikiLink: string;
};

export type Guess = {
  state: string;
  distance: number;
  temperature: { label: string; color: string };
};

type GameStatus = 'playing' | 'round_won' | 'round_lost' | 'game_over';

interface GameContextType {
  // State
  currentDish: Dish | null;
  currentRound: number;
  maxRounds: number;
  guesses: Guess[];
  maxGuesses: number;
  score: number;
  gameStatus: GameStatus;
  history: Dish[]; // Dishes played so far
  
  // Actions
  makeGuess: (stateName: string) => void;
  nextRound: () => void;
  restartGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const MAX_ROUNDS = 5;
  const MAX_GUESSES = 5;
  
  // Game State
  const [shuffledDishes, setShuffledDishes] = useState<Dish[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [history, setHistory] = useState<Dish[]>([]);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    // Shuffle dishes and pick first 5
    const shuffled = [...dishesData].sort(() => 0.5 - Math.random());
    const selectedDishes = shuffled.slice(0, MAX_ROUNDS);
    
    // Optimistically set dishes with fallback images
    setShuffledDishes(selectedDishes);
    setCurrentRound(1);
    setGuesses([]);
    setScore(0);
    setGameStatus('playing');
    setHistory([]);

    // Fetch live images from Wiki API for the selected dishes
    const dishesWithLiveImages = await Promise.all(
      selectedDishes.map(async (dish) => {
        const liveImage = await fetchWikiImage(dish.wikiLink);
        return liveImage ? { ...dish, image: liveImage } : dish;
      })
    );
    
    setShuffledDishes(dishesWithLiveImages);
  };

  const currentDish = shuffledDishes[currentRound - 1] || null;

  const makeGuess = (stateName: string) => {
    if (gameStatus !== 'playing' || !currentDish) return;
    if (guesses.some(g => g.state === stateName)) return; // Prevent duplicate guesses

    const isCorrect = currentDish.origins.includes(stateName);
    
    // Calculate distance (0 if correct)
    let distance = 0;
    if (!isCorrect) {
      // Logic: Find distance to the CLOSEST valid origin state
      const originCoords = currentDish.origins.map(origin => STATE_CENTROIDS[origin]);
      const guessCoords = STATE_CENTROIDS[stateName];
      
      if (guessCoords) {
        const distances = originCoords.map(origin => 
          calculateDistance(guessCoords.lat, guessCoords.lng, origin.lat, origin.lng)
        );
        distance = Math.min(...distances);
      }
    }

    const newGuess: Guess = {
      state: stateName,
      distance,
      temperature: getTemperature(distance)
    };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);

    // Check Win/Loss
    if (isCorrect) {
      // Calculate Score: 5000 base, minus 1000 per wrong guess
      const roundScore = 5000 - (guesses.length * 1000);
      setScore(prev => prev + roundScore);
      setGameStatus('round_won');
      setHistory(prev => [...prev, currentDish]);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameStatus('round_lost');
      setHistory(prev => [...prev, currentDish]);
    }
  };

  const nextRound = () => {
    if (currentRound >= MAX_ROUNDS) {
      setGameStatus('game_over');
    } else {
      setCurrentRound(prev => prev + 1);
      setGuesses([]);
      setGameStatus('playing');
    }
  };

  const restartGame = () => {
    startNewGame();
  };

  return (
    <GameContext.Provider value={{
      currentDish,
      currentRound,
      maxRounds: MAX_ROUNDS,
      guesses,
      maxGuesses: MAX_GUESSES,
      score,
      gameStatus,
      history,
      makeGuess,
      nextRound,
      restartGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

