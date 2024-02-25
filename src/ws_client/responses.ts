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
  return respToString({
    type: 'attack',
    data: {
      gameId,
      indexPlayer,
      x: randomNumber(0, FIELD_SIZE),
      y: randomNumber(0, FIELD_SIZE),
    },
    id: 0,
  });
};
