import { WebSocket } from 'ws';

export type TCommand = {
  type: string;
  data: object;
  id: number;
};
export type TUser = {
  id?: number;
  name: string;
  password: string;
  wins: number;
  socket?: WebSocket;
  error?: boolean;
  errorText?: string;
};
export type TUsers = TUser[];

export type TRoom = {
  id: number;
  users: TUsers;
};
export type TRooms = TRoom[];

export type TPlayer = {
  playerId: number;
  ships: TShips;
  shoots: { x: number; y: number }[];
};
export type TPlayers = TPlayer[];

export type TGame = {
  id: number;
  maker: TUser;
  players: TPlayers;
  room: TRoom;
  curPlayer: number;
};
export type TGames = TGame[];

export type TShip = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
  damage?: number;
};
export type TShips = TShip[];

export type TAttack = {
  gameId: number;
  x?: number;
  y?: number;
  indexPlayer: number;
};

export type TAttackResponse = {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: number;
  status: 'miss' | 'killed' | 'shot';
};
