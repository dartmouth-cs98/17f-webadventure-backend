import * as GameController from './controllers/gameController';

const setupGameServer = (io) => {
  io.on('connection', (socket) => {
    // check if it has a query and if it has a host
    console.log('game server connected');
    const gameId = socket.handshake.query.gameId;

    const pushGame = () => {
      GameController.getGame(gameId, (game) => {
        // console.log('pushGame');
        // console.log(game);
        io.to(gameId).emit('game', game);
        console.log('pushedGame');
        console.log(game);
      });
    };

    socket.join(gameId, () => {
      pushGame();
    });

    socket.on('updatePlayer', (req, callback) => {
      GameController.updatePlayer(req.gameId, req.username, req.playerInfo, (game) => {
        if (callback) {
          callback(game);
        }
        pushGame();
      });
    });
  });
};

export { setupGameServer as default };
