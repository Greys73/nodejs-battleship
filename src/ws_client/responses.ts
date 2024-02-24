import generateCustomId from '../utils/generateId';
import { respToString } from '../utils/utils';
import { getShips } from './data/ships';

export const newBot = () => {
  return respToString({
    type: 'reg',
    data: {
      name: `bot_${generateCustomId()}`,
      password: generateCustomId().toString(),
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
