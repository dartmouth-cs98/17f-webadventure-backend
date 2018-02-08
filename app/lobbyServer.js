import * as GameController from './controllers/gameController';
import * as UserController from './controllers/userController';

const setupLobby = (io) => {
  const lobby = io.of('/lobby');

  lobby.on('connection', (socket) => {
    const username = socket.handshake.query.username;
    UserController.getOrCreateUser(username, (user) => {
      if (!user) {
        socket.close();
        return;
      }
      socket.emit('curUser', user);
    });

    const pushGames = () => {
      GameController.getNewGames((games) => {
        lobby.emit('games', games);
      });
    };

    const pushUsers = () => {
      UserController.getActiveUsers((users) => {
        lobby.emit('users', users);
      });
    };

    socket.on('updateUsername', (req, callback) => {
      UserController.getOrCreateUser(req.username, (user) => {
        socket.emit('curUser', user);
      });
    });

    pushGames();
    pushUsers();

    socket.on('createGame', (req, callback) => {
      GameController.createGame(req.username, req.endpoints, (results) => {
        pushGames();
        console.log('game created');
        callback(results);
      });
    });

    socket.on('joinNewGame', (req, callback) => {
      GameController.joinNewGame(req.gameId, req.username, (results) => {
        pushGames();
        callback(results);
      });
    });

    socket.on('leaveNewGame', (req, callback) => {
      GameController.leaveNewGame(req.gameId, req.username, (results) => {
        pushGames();
        callback(results);
      });
    });

// Should only startGame if not started
    socket.on('startGame', (gameId, callback) => {
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

    socket.on('disconnect', () => {
      UserController.logoutUser(username).then(() => {
        pushUsers();
      }).catch((err) => { console.log(err); });
    });
  });
};

export { setupLobby as default };
