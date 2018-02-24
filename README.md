# WebAdventure Backend

This is the repository for the backend of the WebAdventure Project. For more information see the repo: https://github.com/dartmouth-cs98/17f-webadventure

## Setup
The backend is automatically build via heroku and uses socket.io to deploy websockets.

The server points to https://webadventure-api.herokuapp.com/.
There are two servers types of connections to the backend server: Lobby Server and Game Server.

To run the backend **locally** first make sure you have MongoDB installed and start a local MongoDB server:
```
mongod
```
Then `npm install` and `npm start` the repo.
The backend server should now be running on localhost:9090

Testing remote url

## Models:
The backend stores 3 models using Mongoose with MongoDB:
* Game : represents a game
```
{
  startPage(String): the starting URL in the game,
  goalPage(String): the goal/ending URL in the game,
  host(String): username of the user hosting the game. If the game is public game, "public" is the host,
  isPrivate(Boolean): boolean that indicates whether or not the game is private,
  players: array of players in the game. Max of 5 players.
  [{
    finishTime(Number): the number of seconds it takes for the user to reach the goalPage. If the user has not reached the goalPage, default value is -1,
    numClicks(Number): the number of clicks (links the user goes through) in the game,
    username(String): username of the player,
    curUrl(String): current URL the player is on,
  }],
  active(Boolean): boolean that indicates if the game has been started; default value is false,
}
```
* User: represents a user
```
{
  username(String): unique string that identifies a user,
  active(Boolean): boolean that identifies whether the player is currently playing a game,
  avatar([String]): an array/pair of urls to the avatar gifs of the player. The element avatar[0] = left-facing and avatar[1] = right-facing,
}
```
* GamePath: represents the path a user takes in a particular game
```
{
  game (Game): stores the ObjectId of the Game object connected to this game path,
  player (User): stores the ObjectId of the User object connected to this game path,
  path([String]): an array of urls as strings in the order the user takes to get to the goalPage,
}
```


## Lobby Server
The player connects to the lobby server before playing the game. The lobby contains information about what public games are available and handles players joining or creating games.

The events the server emits are:
* 'games', (games) => {}: pushes the public games available for the user to join
* 'users', (users) => {}: pushes the players currently live, but not playing a games

The events the server responds to are:
* 'getOrCreateUser', (username), (user) => {}: gets or creates a user with the given username
* 'updateUser', (username, fields), (user) => {}: update the username
* 'createGame', (username, endpoints, isPrivate), (game) => {}: creates a new game
* 'joinNewGame', (gameId, username), (game) => {}: user with the provided username is added to the list of players in the games
* 'leaveNewGame', (gameId, username), (game) => {}: user with provided username removed from the list of players in the games
* 'startGame', (gameId), (game) => {}: starts a game by setting the game to active, logging out all the players in the game and emitting a start game event

## Game Server
When the game begins the player connects to the game server.

The events the server emits are:
* 'game', (game) => {}: pushes the current games

The events the server responds to are:
* 'updatePlayer', (gameId, username, playerInfo): updates the player's numClicks, curUrl and finishTime
