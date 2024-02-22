import games from '../database/games';
import rooms from '../database/rooms';
import users from '../database/users';
import { respToString } from '../utils/utils';

export const checkFinish = () => {
  const response = {
    type: 'finish',
    data: { winPlayer: 0 },
    id: 0,
  };

  games.getGames().forEach((game) => {
    const roomUsers = game.room.users;
    if (game && roomUsers.length === 1) {
      const userId = roomUsers[0].id;
      if (userId) response.data.winPlayer = userId;
    }

    game.players.forEach((player) => {
      if (player.ships.every((ship) => ship.damage === ship.length)) {
        const enemy = game.players.find(
          (plr) => plr.playerId !== player.playerId,
        );
        if (enemy) {
          response.data.winPlayer = enemy?.playerId;
        }
      }
    });

    if (response.data.winPlayer) {
      game.room.users.forEach((usr) =>
        usr.socket?.send(respToString(response)),
      );
      const user = users.getUserById(response.data.winPlayer);
      if (user) user.wins += 1;
      users.getUsers().forEach((usr) => usr.socket?.send(getResponseWinners()));
      rooms.deleteRoom(game.room.id);
      games.deleteGame(game.id);
    }
  });
};

export const getResponseWinners = () => {
  const data = users
    .getUsers()
    .sort((user) => user.wins)
    .map((user) => {
      return {
        name: user.name,
        wins: user.wins,
      };
    });
  return respToString({ type: 'update_winners', data, id: 0 });
};
