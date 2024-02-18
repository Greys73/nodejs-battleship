import { WebSocketServer, WebSocket } from 'ws';
import { regUser } from '../actions/regAction';
import {
  addUserToRoom,
  createRoom,
  getReadyRooms,
} from '../actions/roomAction';

const PORT = 3000;

const wss = new WebSocketServer({ port: PORT });

console.log(`Start WebSocketServer on the ${PORT} port!`);
wss.on('connection', (ws) => {
  ws.on('error', console.error);
  ws.on('close', (socket: WebSocket) => socket.CLOSED);
  ws.on('message', input.bind(ws));
});

function sendForAll(responseData: string) {
  wss.clients.forEach((client) => client.send(responseData));
}

function input(this: WebSocket, _data: string) {
  const { type, data } = JSON.parse(_data);
  // const sendForThis = (data: TCommand) => this.send(respToString(data));

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
      // Add ships to the game board
      break;
    case 'attack':
      // Attack
      break;
    case 'randomAttack':
      // Random attack
      break;
    default:
      break;
  }

  console.log(`'${type}' : ${data}`);

  // const someData = {
  //   type:"reg",
  //   data: {
  //     name: 'Vova',
  //     index: 55236,
  //     error: true,
  //     errorText: "User Exist!"
  //   },
  //   id:0
  // }

  // sendForThis(someData);
  // sendForAll(someData);
}

export default wss;
