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
import users from '../database/users';

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

export const getAttack = (data: TAttack) => {
  const {
    gameId,
    x = randomNumber(0, 10),
    y = randomNumber(0, 10),
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
    responseData.status =
      hittedShip.damage === hittedShip.length ? 'killed' : 'shot';
  }
  checkFinish();
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

export const checkFinish = () => {
  const response = {
    type: 'finish',
    data: { winPlayer: 0 },
    id: 0,
  };

  games.getGames().forEach((game) => {
    const roomUsers = game.room.users;
    if (game && roomUsers.length === 1) {
      const userId = roomUsers[0].id;
      if (userId) response.data.winPlayer = userId;
    }

    game.players.forEach((player) => {
      if (player.ships.every((ship) => ship.damage === ship.length)) {
        const enemy = game.players.find(
          (plr) => plr.playerId !== player.playerId,
        );
        if (enemy) {
          response.data.winPlayer = enemy?.playerId;
        }
      }
    });

    if (response.data.winPlayer) {
      game.room.users.forEach((usr) =>
        usr.socket?.send(respToString(response)),
      );
      const user = users.getUserById(response.data.winPlayer);
      if (user) user.wins += 1;
      users.getUsers().forEach(usr => usr.socket?.send(getResponseWinners()));
      rooms.deleteRoom(game.room.id);
      games.deleteGame(game.id);
    }

  });
};

export const getResponseWinners = () => {
  const data = users.getUsers().sort(user => user.wins).map(user => {
    return {
      name: user.name,
      wins: user.wins,
    }
  });
  return respToString({ type: 'update_winners', data, id: 0 });
}