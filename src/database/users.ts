import { WebSocket } from 'ws';
import { TUser, TUsers } from '../types/types';
import generateCustomId from '../utils/generateId';

class UsersDB {
  users: TUsers;

  constructor() {
    this.users = [];
  }

  getUsers = () => this.users;

  getUserBySocket = (socket: WebSocket) =>
    this.users.find((user) => user.socket === socket);

  getUserByName = (name: string) =>
    this.users.find((user) => user.name === name);

  getUserById = (id: number) => this.users.find((user) => user.id === id);

  addUser = (_user: TUser, socket: WebSocket) => {
    const { name, password, botSocket } = _user;
    const id = generateCustomId();
    const wins = 0;
    const user: TUser = { id, name, password, socket, wins, botSocket };
    this.users.push(user);
    return user;
  };

  deleteUser = (id: number) => {
    const index = this.users.findIndex((user) => user.id === id);
    this.users.splice(index, 1);
  };
}

const users = new UsersDB();

export default users;
