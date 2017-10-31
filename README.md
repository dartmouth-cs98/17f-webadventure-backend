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
- **Parameters**: username, callback function
- Finds the player with the associated username and passes the information into the callback function.

```
socket.on('signup', (username, callback)
```
- **Parameters**: username, callback function
- Creates a player with a relevant username. The default color of the player is red and the current score is set to 0. The created player information is passed into the callback function.
