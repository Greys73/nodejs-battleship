import { TUser } from './../types/types';
import { respToString } from '../utils/convert';
import { TRoom } from '../types/types';
import games from '../database/games';

export const createGame = (user: TUser, room: TRoom) => {
  const response = {
    id: 0,
    type: 'create_game',
    data: {
      idGame: games.addGame(user),
      idPlayer: user.id,
    },
  };
  room.users.forEach((usr) => {
    usr.socket?.send(respToString(response));
  });
};
