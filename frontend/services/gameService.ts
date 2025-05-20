const API_BASE_URL = "http://localhost:3000/api";

export interface GameState {
  phase: "JOINING" | "NIGHT" | "DAY" | "ENDED";
  currentPhase: number;
  players: number;
  timeLeft: number | null;
}

export interface Player {
  id: string;
  name: string;
  role: string;
  isAlive: boolean;
  votes?: number;
}

class GameService {
  private gameId: string | null = null;
  private playerUuid: string | null = null;

  async createGame(groveId: string): Promise<{ gameId: string; uuid: string }> {
    const gameId = `game_${Date.now()}`; // Generate a unique game ID
    const response = await fetch(`${API_BASE_URL}/game/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, groveId }),
    });

    if (!response.ok) {
      throw new Error("Failed to create game");
    }

    const data = await response.json();
    this.gameId = gameId;
    this.playerUuid = data.newUuid;
    return { gameId, uuid: data.newUuid };
  }

  async joinGame(groveId: string): Promise<{ uuid: string }> {
    if (!this.gameId) {
      throw new Error("No game ID available");
    }

    const response = await fetch(`${API_BASE_URL}/game/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId: this.gameId, groveId }),
    });

    if (!response.ok) {
      throw new Error("Failed to join game");
    }

    const data = await response.json();
    this.playerUuid = data.newUuid;
    return { uuid: data.newUuid };
  }

  async performAction(
    action: "KILL" | "HEAL" | "INVESTIGATE" | "VOTE",
    targetGroveId: string
  ): Promise<void> {
    if (!this.gameId || !this.playerUuid) {
      throw new Error("Game not initialized");
    }

    const response = await fetch(`${API_BASE_URL}/game/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: this.gameId,
        groveId: this.playerUuid, // Using UUID as groveId for now
        uuid: this.playerUuid,
        action,
        targetGroveId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to perform action");
    }
  }

  async getGameStatus(): Promise<GameState> {
    if (!this.gameId) {
      throw new Error("No game ID available");
    }

    const response = await fetch(`${API_BASE_URL}/game/status/${this.gameId}`);
    if (!response.ok) {
      throw new Error("Failed to get game status");
    }

    return response.json();
  }

  setGameId(gameId: string) {
    this.gameId = gameId;
  }

  setPlayerUuid(uuid: string) {
    this.playerUuid = uuid;
  }

  getGameId(): string | null {
    return this.gameId;
  }

  getPlayerUuid(): string | null {
    return this.playerUuid;
  }
}

export const gameService = new GameService();
