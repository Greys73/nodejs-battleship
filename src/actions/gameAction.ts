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
import rooms from '../database/rooms';
import { checkFinish } from './finishAction';

const FIELD_SIZE = 10;

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

  rooms.getRooms().forEach((croom) => {
    if (croom.id !== room.id) {
      if (croom.users.find((usr) => usr === user)) {
        rooms.remUserFromRoom(croom.id, user);
      }
    }
  });
};

export const addShips = (data: {
  gameId: number;
  ships: TShips;
  indexPlayer: number;
}) => {
  const { gameId, ships, indexPlayer } = data;
  const game = games.addPlayerShips(gameId, indexPlayer, ships);
  if (game && game.players.length > 1) startGame(game, indexPlayer);
};

export const startGame = (game: TGame, startPlayerId: number) => {
  game.room.users.forEach((user) => {
    const player = game.players.find((plr) => plr.playerId === user.id);
    if (player) {
      const response = {
        id: 0,
        type: 'start_game',
        data: {
          ships: player.ships,
          currentPlayerIndex: player.playerId,
        },
      };
      user.socket?.send(respToString(response));
    }
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

export const getAttack = (data: TAttack) => {
  const {
    gameId,
    x = randomNumber(0, FIELD_SIZE),
    y = randomNumber(0, FIELD_SIZE),
    indexPlayer,
  } = data;
  const game = games.getGame(gameId);
  if (!game) return false;
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
    if (hittedShip.damage === hittedShip.length) {
      missAroundShip(hittedShip).forEach(c => {
        responseData.position.x = c.x;
        responseData.position.y = c.y;
        sendAttack(game, responseData);
      });
      responseData.status = 'killed';
      fullDestroyShip(hittedShip).forEach(c => {
        responseData.position.x = c.x;
        responseData.position.y = c.y;
        sendAttack(game, responseData);
      });
      checkFinish();
    } else {
      responseData.status = 'shot';
      sendAttack(game, responseData);
    }
  } else {
    sendAttack(game, responseData);
  }
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

const missAroundShip = (ship: TShip) => {
  const { x, y } = ship.position;
  const len = ship.length;
  const vertical = ship.direction;
  const startEnd = vertical
    ? [
        { x, y },
        { x, y: y + len - 1 },
      ]
    : [
        { x, y },
        { x: x + len - 1, y },
      ];
  const cells: { x: number; y: number }[] = [];
  startEnd.forEach((dot) => {
    for (let i = dot.x - 1; i <= dot.x + 1; i++) {
      for (let j = dot.y - 1; j <= dot.y + 1; j++) {
        if (
          i >= 0 &&
          j >= 0 &&
          i <= FIELD_SIZE &&
          j <= FIELD_SIZE &&
          !cells.find((c) => c.x === i && c.y === j)
        ) {
          cells.push({ x: i, y: j });
        }
      }
    }
  });

  return cells;
};

const fullDestroyShip = (ship: TShip) => {
  const { x, y } = ship.position;
  const len = ship.length;
  const vertical = ship.direction;
  const cells: { x: number; y: number }[] = [];
  if (vertical) {
    for (let i = y; i < y + len; i++) {
      cells.push({x, y: i});
    }
  } else {
    for (let i = x; i < x + len; i++) {
      cells.push({x: i, y});
    }
  }
  return cells;
}

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
