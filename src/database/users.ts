import { WebSocket } from 'ws';
import { TUser, TUsers } from '../types/types';

class UsersDB {
  users: TUsers;

  constructor() {
    this.users = [];
  }

  getUsers = () => this.users;

  getUser = (name: string) => this.users.find((user) => user.name === name);

  addUser = (_user: TUser, socket: WebSocket) => {
    const { name, password } = _user;
    const id = this.users.length;
    const user: TUser = { id, name, password, socket };
    this.users.push(user);
    return user;
  };
}

const users = new UsersDB();

export default users;
