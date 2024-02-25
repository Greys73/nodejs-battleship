import { TGame, TGames, TPlayers, TRoom, TShips, TUser } from '../types/types';
import generateCustomId from '../utils/generateId';

class GamesDB {
  games: TGames;

  constructor() {
    this.games = [];
  }

  getGames = () => this.games;

  getGame = (id: number) => this.games.find((game) => game.id === id);

  getGameByUserId = (id: number) =>
    this.games.find((game) => game.players.find((plr) => plr.playerId === id));

  addGame = (maker: TUser, room: TRoom) => {
    const id = generateCustomId();
    const players: TPlayers = [];
    const game: TGame = { id, maker, players, room, curPlayer: 0 };
    this.games.push(game);
    return game;
  };

  addPlayerShips = (gameId: number, playerId: number, ships: TShips) => {
    const game = this.getGame(gameId);
    if (game) {
      game.players.push({
        playerId,
        ships,
        shoots: [],
      });
    }
    return game;
  };

  deleteGame = (id: number) => {
    const index = this.games.findIndex((game) => game.id === id);
    this.games.splice(index, 1);
  };
}

const games = new GamesDB();

export default games;
