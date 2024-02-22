import { TRoom, TRooms, TUser } from '../types/types';
import generateCustomId from '../utils/generateId';

class RoomsDB {
  rooms: TRooms;

  constructor() {
    this.rooms = [];
  }

  getRooms = () => this.rooms;

  getRoomById = (id: number) => this.rooms.find((room) => room.id === id);

  addRoom = (_user: TUser) => {
    const id = generateCustomId();
    const room: TRoom = { id, users: [_user] };
    this.rooms.push(room);
    return room;
  };

  addUser = (roomId: number, user: TUser) => {
    const room = this.getRoomById(roomId);
    if (room) {
      if (this.findUserInRoom(user) !== room) {
        room.users.push(user);
      }
    }
    return room;
  };

  findUserInRoom = (_user: TUser) => {
    return this.rooms.find((room) => room.users.find((user) => user === _user));
  };

  remUserFromRoom = (roomId: number, user: TUser) => {
    const room = this.getRoomById(roomId);
    if (room) {
      const index = room.users.findIndex((usr) => usr.id === user.id);
      room.users.splice(index, 1);
    }
  };

  deleteRoom = (id: number) => {
    const index = this.rooms.findIndex((room) => room.id === id);
    this.rooms.splice(index, 1);
  };
}

const rooms = new RoomsDB();

export default rooms;
