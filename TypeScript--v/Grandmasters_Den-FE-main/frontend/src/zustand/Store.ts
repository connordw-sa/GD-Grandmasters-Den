import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface loginRegisterData {
  email?: string;
  password: string;
  username?: string;
}

export interface UserData {
  _id: string;
  email?: string;
  username?: string;
}

export interface PieceState {
  color: "black" | "white";
  type: "king" | "queen" | "bishop" | "knight" | "rook" | "pawn";
  position: string;
  hasMoved: boolean;
}

export interface Move {
  color: "white" | "black";
  piece: string;
  from: string;
  to: string;
  promotion?: string;
}

export interface GameData {
  _id: string;
  player1: UserData;
  player2: UserData;
  boardState: PieceState[];
  currentPlayer: string;
  moveHistory: Move[];
}

export enum ErrorMessages {
  ServerError = "Server error",
  InvalidCredentials = "Invalid email or password",
  UnknownError = "Unknown error"
}

interface StoreState {
  isLoading: boolean;
  error: string | null;
  user: UserData | null;
  loginRegister: (data: loginRegisterData) => Promise<void>;
  isLoggedIn: boolean;
  logout: () => void;
  setLoginState: (isLoggedIn: boolean) => void;
  setUser: (user: UserData | null) => void;
  users: UserData[] | null;
  fetchUsers: () => Promise<void>;
  userGames: GameData[] | null;
  fetchGames: () => Promise<void>;
  logState: () => void;
  currentGame: GameData | null;
  fetchCurrentGame: (gameId: string) => Promise<void>;
  updateCurrentGame: (game: GameData) => Promise<void>;
  currentPlayerId: string | null;
  setCurrentPlayerId: (id: string | null) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      userGames: [],
      currentGame: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
      currentPlayerId: null,

      loginRegister: async (data: loginRegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `http://localhost:3001/users/${
              data.username ? "register" : "login"
            }`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
            }
          );
          if (response.ok) {
            const { user, accessToken } = await response.json();
            localStorage.setItem("accessToken", accessToken);
            set({ user, isLoggedIn: true, isLoading: false });
          } else {
            set({ error: ErrorMessages.InvalidCredentials, isLoading: false });
          }
        } catch (error) {
          set({ error: ErrorMessages.ServerError, isLoading: false });
        }
      },
      logout: () => {
        localStorage.removeItem("accessToken");
        set({
          user: null,
          users: null,
          userGames: null,
          currentGame: null,
          isLoggedIn: false
        });
      },

      setUser: (user: UserData | null) => set({ user }),
      setLoginState: (isLoggedIn: boolean) => set({ isLoggedIn }),
      fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("http://localhost:3001/users/allUsers", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
          });
          if (response.ok) {
            const users: UserData[] = await response.json();
            set({ users, isLoading: false });
          } else {
            set({ error: ErrorMessages.ServerError, isLoading: false });
          }
        } catch (error) {
          set({ error: ErrorMessages.ServerError, isLoading: false });
        }
      },
      fetchGames: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            "http://localhost:3001/games/userGames",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              }
            }
          );
          if (response.ok) {
            const userGames: GameData[] = await response.json();
            set({ userGames, isLoading: false });
          } else {
            set({ error: ErrorMessages.ServerError, isLoading: false });
          }
        } catch (error) {
          set({ error: ErrorMessages.ServerError, isLoading: false });
        }
      },
      fetchCurrentGame: async (gameId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `http://localhost:3001/games/${gameId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              }
            }
          );
          if (response.ok) {
            const gameData: GameData = await response.json();
            set({ currentGame: gameData, isLoading: false });
          } else {
            set({ error: ErrorMessages.ServerError, isLoading: false });
          }
        } catch (error) {
          set({ error: ErrorMessages.ServerError, isLoading: false });
        }
      },
      updateCurrentGame: async (game: GameData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `http://localhost:3001/games/${game._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
              },
              body: JSON.stringify(game)
            }
          );

          if (response.ok) {
            const updatedGameData: GameData = await response.json();
            set({ currentGame: { ...updatedGameData }, isLoading: false });
          } else {
            set({ error: ErrorMessages.ServerError, isLoading: false });
          }
        } catch (error) {
          set({ error: ErrorMessages.ServerError, isLoading: false });
        }
      },
      setCurrentPlayerId: (id: string | null) => set({ currentPlayerId: id }),
      logState: () => {
        console.log(
          "Current user:",
          get().user,
          "logged in:",
          get().isLoggedIn,
          "Users:",
          get().users,
          "Games:",
          get().userGames
        );
      }
    }),
    {
      partialize(state) {
        return Object.fromEntries(
          Object.entries(state).filter(([key]) => !["error"].includes(key))
        );
      },
      name: "user",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
