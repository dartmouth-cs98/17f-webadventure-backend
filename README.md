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
The backend stores 3 models in MongoDB:
* Game :
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
  active(Boolean): boolean that indicates if the player is currently playing a game; default value is false,
}
```


## Lobby Server
Currently the server supports the following:

### getPlayer
```
socket.on('getPlayer', (username, callback)
```
*Parameters*: username, callback function
- Finds the player with the associated username and passes the information into the callback function.


### signup
```
socket.on('signup', (username, callback)
```
*Parameters*: username, callback function
- Creates a player with a relevant username. The default color of the player is red and the current score is set to 0. The created player information is passed into the callback function.
- If a player is already created, then the user is simply returned into the callback function.
- Pushes all player information to other sockets.

### updatePlayer
```
socket.on('updatePlayer', (username, fields, callback)
```
*Parameters*: username, fields, callback function
- Updates a player identified by its username with the relevant fields. `fields` is a JSON object that may contain curScore, playerColor, and location (though not all those fields need to be included)
- Example fields object:

```
const fields = {
 curScore: 50,
 playerColor: {
   r: 0,
   g: 0,
   b: 1,
 },
 // location needs at least these 4 fields
 location: {
   url: 'en.wikipedia.org/wiki/Dartmouth',
   sectionID: 10,
   sentenceID: 2,
   character: 1,
 },
};
```
- Location object need not be created. updatePlayer checks if location exists before updating location; if it does not a new location object is created.
- Push the current locations of all the players to other sockets.

### Game Over
```
socket.on('gameOver', (username)
```
*Parameters*: username
- Removes the user from the game (purging all locations held by that user)
- Pushes updated player information to all other sockets.

## Helper Server Functions

```
pushPlayers
```
- Emits all player information to the frontend

```
pushLocationsByURL
```
- Emits all location information (given a URL) to the frontend
- Done so that people on a page can see others
