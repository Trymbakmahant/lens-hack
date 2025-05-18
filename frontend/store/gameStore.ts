import { create } from "zustand";

interface Player {
  id: string;
  name: string;
  role: string;
  isAlive: boolean;
}

interface GameState {
  gameId: string | null;
  players: Player[];
  currentPhase: "day" | "night";
  currentRound: number;
  timeLeft: number;
  messages: string[];
  setGameId: (id: string) => void;
  setPlayers: (players: Player[]) => void;
  setPhase: (phase: "day" | "night") => void;
  setRound: (round: number) => void;
  setTimeLeft: (time: number) => void;
  addMessage: (message: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameId: null,
  players: [],
  currentPhase: "day",
  currentRound: 1,
  timeLeft: 0,
  messages: [],

  setGameId: (id) => set({ gameId: id }),

  setPlayers: (players) => set({ players }),

  setPhase: (phase) => set({ currentPhase: phase }),

  setRound: (round) => set({ currentRound: round }),

  setTimeLeft: (time) => set({ timeLeft: time }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  resetGame: () =>
    set({
      gameId: null,
      players: [],
      currentPhase: "day",
      currentRound: 1,
      timeLeft: 0,
      messages: [],
    }),
}));
