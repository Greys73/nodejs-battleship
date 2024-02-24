import { WebSocket } from 'ws';
import { TRoom } from '../types/types';
import { newBot, addBotToRoom, addBotShips, randomAttack } from './responses';
// import { log } from '../utils/utils';
import users from '../database/users';
import games from '../database/games';

const createClient = (room: TRoom | undefined) => {
  const client = new WebSocket('ws://localhost:3000');
  client.on('open', () => {
    if (room) {
      client.send(newBot());
      client.send(addBotToRoom(room.id));
    }
  });
  client.on('message', input.bind(client));
  return client;
};

function input(this: WebSocket, _data: string) {
  const { type, data } = JSON.parse(_data);
  const bot = users.getUsers().find((user) => user.botSocket === this);

  switch (type) {
    case 'reg':
      setBotSocket(this, JSON.parse(data));
      break;
    case 'create_game':
      this.send(addBotShips(JSON.parse(data)));
      break;
    case 'turn':
      setTimeout(() => {
        if (bot && bot.id === JSON.parse(data).currentPlayer) {
          const gameId =
            games
              .getGames()
              .find((g) => g.room.users.find((u) => u.id === bot.id))?.id || 0;
          this.send(randomAttack(gameId, JSON.parse(data)));
        }
      }, 1000);
      break;
    default:
      break;
  }
}

const setBotSocket = (socket: WebSocket, { index }: { index: number }) => {
  const user = users.getUserById(index);
  if (user) user.botSocket = socket;
};
export default createClient;
