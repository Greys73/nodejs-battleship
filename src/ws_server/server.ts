import { WebSocketServer, WebSocket } from 'ws';
import { regUser } from '../actions/regAction';
import {
  addUserToRoom,
  createRoom,
  getReadyRooms,
  removeUser,
} from '../actions/roomAction';
import { addShips, getAttack } from '../actions/gameAction';

const PORT = 3000;

const wss = new WebSocketServer({ port: PORT });

console.log(`Start WebSocketServer on the ${PORT} port!`);
wss.on('connection', (ws) => {
  ws.on('error', console.error);
  ws.on('message', input.bind(ws));
  ws.on('close', () => {
    removeUser(ws);
    // TODO finish_game
    sendForAll(getReadyRooms());
  });
});

function sendForAll(responseData: string) {
  wss.clients.forEach((client) => client.send(responseData));
}

function input(this: WebSocket, _data: string) {
  const { type, data } = JSON.parse(_data);

  switch (type) {
    case 'reg':
      regUser(this, JSON.parse(data));
      sendForAll(getReadyRooms());
      break;
    case 'create_room':
      createRoom(this);
      sendForAll(getReadyRooms());
      break;
    case 'add_user_to_room':
      addUserToRoom(this, JSON.parse(data));
      sendForAll(getReadyRooms());
      break;
    case 'add_ships':
      addShips(JSON.parse(data));
      break;
    case 'attack':
      getAttack(this, JSON.parse(data));
      break;
    case 'randomAttack':
      getAttack(this, JSON.parse(data));
      break;
    default:
      break;
  }

  console.log(`'${type}' : ${data}`);
}

export default wss;
