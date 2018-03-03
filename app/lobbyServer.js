import * as GameController from './controllers/gameController';
import * as UserController from './controllers/userController';

const setupLobby = (io) => {
  const lobby = io.of('/lobby');

  lobby.on('connection', (socket) => {
    console.log('connected');
    let username = socket.handshake.query.username;
    if (username && username !== null) {
      UserController.getOrCreateUser(username, (user) => {
        if (!user) {
          socket.close();
          return;
        }
        socket.emit('curUser', user);
      });
    }

    const pushGames = () => {
      GameController.getNewGames();
      GameController.getGames({ active: false }, (games) => {
        lobby.emit('games', games);
      });
    };

    const pushUsers = () => {
      UserController.getActiveUsers((users) => {
        lobby.emit('users', users);
      });
    };

    pushGames();
    pushUsers();

    socket.on('getOrCreateUser', (req, callback) => {
      username = req.username;
      UserController.getOrCreateUser(req.username, (user) => {
        pushUsers();
        callback(user);
      });
    });

    socket.on('updateUser', (req, callback) => {
      UserController.updateUser(req.username, req.fields, (user) => {
        callback(user);
      });
    });

    socket.on('createGame', (req, callback) => {
      GameController.createGame(req.username, req.isPrivate, (results) => {
        if (req.isPrivate) {
          socket.join(results.id);
        }
        pushGames();
        callback(results);
      });
    });

    socket.on('joinNewGame', (req, callback) => {
      GameController.joinNewGame(req.gameId, req.username, (results) => {
        callback(results);
        socket.join(req.gameId, () => {
          pushGames();
        });
      });
    });

    socket.on('leaveNewGame', (req, callback) => {
      GameController.leaveNewGame(req.gameId, req.username, (results) => {
        callback(results);
        socket.leave(req.gameId, () => {
          pushGames();
        });
      });
    });

// Should only startGame if not started
    socket.on('startGame', (gameId, callback) => {
      GameController.startGame(gameId, (game) => {
        const logoutPlayers = game.players.map((player) => {
          return UserController.logoutUser(player.username);
        });
        Promise.all(logoutPlayers).then((values) => {
          io.of('/lobby').in(gameId).emit('game started', game);
          pushGames();
          pushUsers();
        });
      });
    });

    socket.on('disconnect', () => {
      UserController.deleteUser(username).then(() => {
        pushUsers();
      }).catch((err) => { console.log(err); });
    });
  });
};

export { setupLobby as default };
