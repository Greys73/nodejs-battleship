import games from '../database/games';
import users from '../database/users';
import generateCustomId from '../utils/generateId';
import { randomNumber, respToString } from '../utils/utils';
import { getShips } from './data/ships';

const FIELD_SIZE = 10;

export const newBot = () => {
  return respToString({
    type: 'reg',
    data: {
      name: `bot_${generateCustomId()}`,
      password: generateCustomId().toString(),
      botSocket: true,
    },
    id: 0,
  });
};

export const addBotToRoom = (indexRoom: number) => {
  return respToString({
    type: 'add_user_to_room',
    data: { indexRoom },
    id: 0,
  });
};

type TaddBotShips = {
  idGame: number;
  idPlayer: number;
};
export const addBotShips = ({ idGame, idPlayer }: TaddBotShips) => {
  const user = users.getUserById(idPlayer);
  if (user) user.wins = idGame;
  return respToString({
    type: 'add_ships',
    data: {
      gameId: idGame,
      ships: getShips(),
      indexPlayer: idPlayer,
    },
    id: 0,
  });
};

export const randomAttack = (gameId: number, indexPlayer: number) => {
  const map = createMap();
  const game = games.getGameByUserId(indexPlayer);
  const enemy = game?.players.find((plr) => plr.playerId !== indexPlayer);
  if (enemy) {
    enemy.shoots.forEach((s) => {
      const index = map.findIndex((m) => s.x === m.x && s.y === m.y);
      if (index >= 0) map.splice(index, 1);
    });
  }
  const hit = randomNumber(0, map.length);

  return respToString({
    type: 'attack',
    data: {
      gameId,
      indexPlayer,
      x: map[hit].x,
      y: map[hit].y,
    },
    id: 0,
  });
};

const createMap = () => {
  const result = [];
  for (let x = 0; x < FIELD_SIZE; x++) {
    for (let y = 0; y < FIELD_SIZE; y++) {
      result.push({ x, y });
    }
  }
  return result;
};
