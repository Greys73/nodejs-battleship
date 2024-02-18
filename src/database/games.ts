import { TGame, TGames, TUser } from '../types/types';

class GamesDB {
  games: TGames;

  constructor() {
    this.games = [];
  }

  getGames = () => this.games;

  getGameById = (id: number) => this.games[id];

  addGame = (maker: TUser) => {
    const id = this.games.length;
    const game: TGame = { id, maker };
    this.games.push(game);
    return game;
  };
}

const games = new GamesDB();

export default games;
