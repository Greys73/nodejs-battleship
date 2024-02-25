import { WebSocket } from 'ws';
import { TAttackResponse, TRoom, TUser } from '../types/types';
import { newBot, addBotToRoom, addBotShips, randomAttack } from './responses';
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
          const gameId = games.getGameByUserId(bot.id!)?.id || 0;
          this.send(randomAttack(gameId, bot.id!));
        }
      }, 1000);
      break;
    case 'attack':
      if (bot && bot.id === JSON.parse(data).currentPlayer) {
        getAttack(bot, JSON.parse(data));
      }
      break;
    case 'finish':
      if (bot) users.deleteUser(bot.id!);
      break;
    default:
      break;
  }
}

const setBotSocket = (socket: WebSocket, { index }: { index: number }) => {
  const user = users.getUserById(index);
  if (user) user.botSocket = socket;
};

const getAttack = (bot: TUser, data: TAttackResponse) => {
  const game = games.getGameByUserId(bot.id!);
  const enemy = game?.players.find((plr) => plr.playerId !== bot.id);
  if (enemy) {
    const { x, y } = data.position;
    const repeat = enemy.shoots.find((s) => s.x === x && s.y === y);
    if (!repeat) enemy.shoots.push({ x, y });
  }
};

export default createClient;
