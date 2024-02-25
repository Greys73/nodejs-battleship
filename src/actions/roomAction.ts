import { WebSocket } from 'ws';
import rooms from '../database/rooms';
import { respToString } from '../utils/utils';
import users from '../database/users';
import { createGame } from './gameAction';

export const createRoom = (socket: WebSocket) => {
  const user = users.getUserBySocket(socket);
  if (user) {
    const room = rooms.findUserInRoom(user);
    return room || rooms.addRoom(user);
  }
};

export const addUserToRoom = (
  socket: WebSocket,
  data: { indexRoom: number },
) => {
  const { indexRoom: id } = data;
  const user = users.getUserBySocket(socket);
  if (user) {
    const room = rooms.addUser(id, user);
    if (room && room.users.length > 1) createGame(user, room);
  }
};

export const removeUserFromRoom = (socket: WebSocket) => {
  const user = users.getUserBySocket(socket);
  if (user) {
    const room = rooms.findUserInRoom(user);
    if (room) rooms.remUserFromRoom(room.id, user);
  }
};

export const getResponseReadyRooms = () => {
  const allRooms = rooms.getRooms();
  const readyRooms = allRooms.filter((room) => room.users.length === 1);
  const data = readyRooms.map((room) => ({
    roomId: room.id,
    roomUsers: [
      {
        name: room.users[0].name,
        index: room.users[0].id,
      },
    ],
  }));
  return respToString({ type: 'update_room', data, id: 0 });
};
