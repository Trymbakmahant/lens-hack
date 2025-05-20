import { create } from "zustand";

interface UserState {
  address: string | null;
  username: string | null;
  groveId: string | null;
  setUserData: (address: string, username: string, groveId: string) => void;
  setUsername: (username: string) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  address: null,
  username: null,
  groveId: null,
  setUserData: (address, username, groveId) =>
    set({ address, username, groveId }),
  setUsername: (username) => set({ username }),
  clearUserData: () => set({ address: null, username: null, groveId: null }),
}));
