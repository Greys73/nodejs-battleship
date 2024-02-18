import { TGame, TGames, TPlayers, TRoom, TShips, TUser } from '../types/types';

class GamesDB {
  games: TGames;

  constructor() {
    this.games = [];
  }

  getGames = () => this.games;

  getGameById = (id: number) => this.games[id];

  addGame = (maker: TUser, room: TRoom) => {
    const id = this.games.length;
    const players: TPlayers = [];
    const game: TGame = { id, maker, players, room, curPlayer: 0 };
    this.games.push(game);
    return game;
  };

  addPlayerShips = (gameId: number, playerId: number, ships: TShips) => {
    const game = this.games[gameId];
    game.players.push({
      playerId,
      ships,
    });
    return game;
  };
}

const games = new GamesDB();

export default games;
