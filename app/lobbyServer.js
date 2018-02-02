import * as GameController from './controllers/gameController';
import * as UserController from './controllers/userController';

const setupLobby = (io) => {
  const lobby = io.of('/lobby');

  lobby.on('connection', (socket) => {
    const pushGames = () => {
      GameController.getNewGames((games) => {
        lobby.sockets.emit('games', games);
      });
    };

    const pushUsers = () => {
      UserController.getActiveUsers((users) => {
        lobby.sockets.emit('users', users);
      });
    };

    pushGames();
    pushUsers();

    lobby.on('createGame', (req, callback) => {
      GameController.createGame(req.username, req.endpoints, (results) => {
        pushGames();
        callback(results);
      });
    });

    lobby.on('joinNewGame', (req, callback) => {
      GameController.joinNewGame(req.gameId, req.username, (results) => {
        pushGames();
        callback(results);
      });
    });

    lobby.on('leaveNewGame', (req, callback) => {
      GameController.leaveNewGame(req.gameId, req.username, (results) => {
        pushGames();
        callback(results);
      });
    });

    lobby.on('startGame', (gameId, callback) => {
      GameController.startGame(gameId).then((game) => {
        const logoutPlayers = game.players.map((player) => {
          return UserController.logoutUser(player.username);
        });
        Promise.all(logoutPlayers).then((values) => {
          pushGames();
          pushUsers();
        });
      });
    });

  // This should be on client disconnecting, but need to get username...
    lobby.on('logout', (username) => {
      UserController.logoutUser(username).then(() => {
        pushUsers();
      }).catch((err) => { console.log(err); });
    });
  });
};

export { setupLobby as default };
