import { WebSocket } from 'ws';
import users from '../database/users';
import { TUser } from '../types/types';
import { respToString } from '../utils/convert';

const ERR_EXIST = (name: string) =>
  `User ${name} already exists in database. Password incorrect.`;
const ERR_CONNECT = (name: string) =>
  `User ${name} already have another open session.`;

export const regUser = (socket: WebSocket, data: TUser) => {
  const response = {
    id: 0,
    type: 'reg',
    data: {
      name: '',
      index: 0,
      error: true,
      errorText: '',
    },
  };
  const existUser = users.getUser(data.name);
  if (existUser) {
    if (existUser.password === data.password) {
      if (existUser.socket!.readyState === 1) {
        response.data.error = true;
        response.data.errorText = ERR_CONNECT(data.name);
      } else {
        response.data.error = false;
        response.data.name = existUser.name;
        response.data.index = existUser.id!;
      }
    } else {
      response.data.error = true;
      response.data.errorText = ERR_EXIST(data.name);
    }
  } else {
    const user = users.addUser(data, socket);
    response.data.error = false;
    response.data.name = user.name;
    response.data.index = user.id!;
  }
  socket.send(respToString(response));
};
