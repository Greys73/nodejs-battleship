import { TGame, TShips, TUser } from './../types/types';
import { respToString } from '../utils/convert';
import { TRoom } from '../types/types';
import games from '../database/games';

export const createGame = (user: TUser, room: TRoom) => {
  const response = {
    id: 0,
    type: 'create_game',
    data: {
      idGame: games.addGame(user, room).id,
      idPlayer: 0,
    },
  };
  room.users.forEach((usr) => {
    response.data.idPlayer = usr.id!;
    usr.socket?.send(respToString(response));
  });
};

export const addShips = (data: {
  gameId: number;
  ships: TShips;
  indexPlayer: number;
}) => {
  const { gameId, ships, indexPlayer } = data;
  const game = games.addPlayerShips(gameId, indexPlayer, ships);
  if (game.players.length > 1) startGame(game, indexPlayer);
};

export const startGame = (game: TGame, startPlayerId: number) => {
  game.room.users.forEach((user, id) => {
    const response = {
      id: 0,
      type: 'start_game',
      data: {
        ships: game.players[id].ships,
        currentPlayerIndex: game.players[id].playerId,
      },
    };
    user.socket?.send(respToString(response));
    console.log(respToString(response));
  });
  sendTurn(game.room, startPlayerId);
};

const sendTurn = (room: TRoom, turn: number) => {
  const response = {
    type: 'turn',
    data: {
      currentPlayer: turn,
    },
    id: 0,
  };
  room.users.forEach((usr) => {
    usr.socket?.send(respToString(response));
  });
};

