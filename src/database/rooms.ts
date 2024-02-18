import { TRoom, TRooms, TUser } from '../types/types';

class RoomsDB {
  rooms: TRooms;

  constructor() {
    this.rooms = [];
  }

  getRooms = () => this.rooms;

  getRoomById = (id: number) => this.rooms[id];

  addRoom = (_user: TUser) => {
    const id = this.rooms.length;
    const room: TRoom = { id, users: [_user] };
    this.rooms.push(room);
    return room;
  };

  addUser = (roomId: number, user: TUser) => {
    const room = this.rooms[roomId];
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
}

const rooms = new RoomsDB();

export default rooms;
