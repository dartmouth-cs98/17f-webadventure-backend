# WebAdventure Backend

This is the repository for the backend of the WebAdventure Project. For more information see the repo: https://github.com/dartmouth-cs98/17f-webadventure

## Setup
To run the backend first make sure you have MongoDB installed and start a local MongoDB server:
```
mongod
```
The `npm install` and `npm start` the repo.
The backend server should now be running on localhost:9090

## REST Routes
Currently the server supports the follows:

* {URL}/api - GET: returns a fun message
* {URL}/api/user - GET: gets or creates user with a given username
  req: {
    username,
    playerColor (optional): {
      r, g, b
      }
    }
