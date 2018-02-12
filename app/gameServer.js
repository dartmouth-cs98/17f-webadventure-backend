import * as GameController from './controllers/gameController';

const setupGameServer = (io) => {
  io.on('connection', (socket) => {
    // check if it has a query and if it has a host
    const roomhost = socket.handshake.query.host;
    const gameId = socket.handshake.query.gameId;

    const pushGame = () => {
      GameController.getGame(gameId, (game) => {
        io.to(roomhost).emit('game', game);
      });
    };
    socket.join(roomhost, () => {
      pushGame();
    });

    socket.on('updatePlayer', (req) => {
      GameController.updatePlayer(req.gameId, req.username, req.playerInfo).then(pushGame);
    });
  });
};

export { setupGameServer as default };
