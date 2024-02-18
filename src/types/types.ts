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

export type TGame = {
  id: number;
  maker: TUser;
  players?: TUsers;
  room?: TRoom;
};
export type TGames = TGame[];
