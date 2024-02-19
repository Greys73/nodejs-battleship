import { WebSocket } from 'ws';
import {
  TRoom,
  TAttack,
  TGame,
  TShips,
  TUser,
  TShip,
  TAttackResponse,
} from './../types/types';
import { randomNumber, respToString } from '../utils/utils';
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
  });
  game.curPlayer = startPlayerId;
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

export const getAttack = (socket: WebSocket, data: TAttack) => {
  const {
    gameId,
    x = randomNumber(0, 10),
    y = randomNumber(0, 10),
    indexPlayer,
  } = data;
  const game = games.getGameById(gameId);
  const enemy = game.players.find((plr) => plr.playerId !== indexPlayer);
  if (indexPlayer !== game.curPlayer || !enemy) return false;

  const responseData: TAttackResponse = {
    position: { x, y },
    currentPlayer: indexPlayer,
    status: 'miss',
  };

  const hittedShip = enemy.ships.find((ship) => checkHit(ship, x, y));
  if (hittedShip) {
    const repeat = enemy.shoots.find((s) => s.x === x && s.y === y);
    if (!repeat) {
      enemy.shoots.push({ x, y });
      hittedShip.damage = hittedShip.damage ? hittedShip.damage + 1 : 1;
    }
    responseData.status =
      hittedShip.damage === hittedShip.length ? 'killed' : 'shot';
  }
  //checkFinish();
  sendAttack(game, responseData);
};

const checkHit = (ship: TShip, _x: number, _y: number) => {
  const { x, y } = ship.position;
  const len = ship.length;
  const vertical = ship.direction;
  if (vertical) {
    for (let i = y; i < y + len; i++) {
      if (_x === x && _y === i) return true;
    }
  } else {
    for (let i = x; i < x + len; i++) {
      if (_x === i && _y === y) return true;
    }
  }
  return false;
};

const sendAttack = (game: TGame, data: TAttackResponse) => {
  const response = {
    type: 'attack',
    data,
    id: 0,
  };
  game.room.users.forEach((usr) => {
    usr.socket?.send(respToString(response));
  });
};
