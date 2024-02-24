import { WebSocket } from 'ws';
import { TRoom } from '../types/types';
import { newBot, addBotToRoom, addBotShips } from './responses';
import { log } from '../utils/utils';

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

  log.warn(`'${type}' : ${data}`);

  switch (type) {
    case 'create_game':
      this.send(addBotShips(JSON.parse(data)));
      break;
    default:
      break;
  }
}

export default createClient;
