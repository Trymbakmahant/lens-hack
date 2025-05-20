import { create } from "zustand";

interface Player {
  groveId: string;
  uuid: string;
  committed: boolean;
}

interface GameState {
  gameId: string | null;
  phase: "JOINING" | "NIGHT" | "DAY" | "ENDED";
  players: Player[];
  roles: string[];
  yourRole: string | null;
  isReady: boolean;
  setGameId: (id: string) => void;
  setPhase: (phase: "JOINING" | "NIGHT" | "DAY" | "ENDED") => void;
  setPlayers: (players: Player[]) => void;
  setRoles: (roles: string[]) => void;
  setYourRole: (role: string) => void;
  setReady: (ready: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameId: null,
  phase: "JOINING",
  players: [],
  roles: [],
  yourRole: null,
  isReady: false,
  setGameId: (id) => set({ gameId: id }),
  setPhase: (phase) => set({ phase }),
  setPlayers: (players) => set({ players }),
  setRoles: (roles) => set({ roles }),
  setYourRole: (role) => set({ yourRole: role }),
  setReady: (ready) => set({ isReady: ready }),
  resetGame: () =>
    set({
      gameId: null,
      phase: "JOINING",
      players: [],
      roles: [],
      yourRole: null,
      isReady: false,
    }),
}));
