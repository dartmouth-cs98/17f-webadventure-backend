# WebAdventure Backend

This is the repository for the backend of the WebAdventure Project. For more information see the repo: https://github.com/dartmouth-cs98/17f-webadventure

## Setup
To run the backend first make sure you have MongoDB installed and start a local MongoDB server:
```
mongod
```
Then `npm install` and `npm start` the repo.
The backend server should now be running on localhost:9090

Testing remote url

## REST Routes
Currently the server supports the follows:


```
socket.on('getPlayer', (username, callback)
```
**Parameters**: username, callback function
- Finds the player with the associated username and passes the information into the callback function.

```
socket.on('signup', (username, callback)
```
**Parameters**: username, callback function
- Creates a player with a relevant username. The default color of the player is red and the current score is set to 0. The created player information is passed into the callback function.

```
socket.on('updatePlayer', (username, fields, callback)
```
**Parameters**: username, fields, callback function
- Updates a player identified by its username with the relevant fields. `fields` is a JSON object that may contain curScore, playerColor, and location (though not all those fields need to be included)
- Example fields object:

```const fields = {
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
