import * as GameController from './controllers/gameController';
import * as UserController from './controllers/userController';

const setupLobby = (io) => {
  const lobby = io.of('/lobby');

  lobby.on('connection', (socket) => {
    console.log('connected');
    let username = socket.handshake.query.username;
    if (username && username !== null) {
      console.log(`get User ${username}`);
      UserController.getOrCreateUser(username, (user) => {
        if (!user) {
          socket.close();
          return;
        }
        socket.emit('curUser', user);
      });
    }

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

    pushGames();
    pushUsers();

    socket.on('getOrCreateUser', (req, callback) => {
      username = req.username;
      UserController.getOrCreateUser(req.username, (user) => {
        callback(user);
      });
    });

    socket.on('updateUser', (req, callback) => {
      UserController.updateUser(req.username, req.fields, (user) => {
        callback(user);
      });
    });

    socket.on('createGame', (req, callback) => {
      // get endpoints here
      const endpoints = req.endpoints ? req.endpoints : { startPage: 'https://en.wikipedia.org/wiki/Architectural_style',
        goalPage: 'https://en.wikipedia.org/wiki/Ren%C3%A9_Descartes' };
      GameController.createGame(req.username, endpoints, req.isPrivate, (results) => {
        pushGames();
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
