import Endpoint from '../models/endpointModel';

const cleanEndpoint = (endpoint) => {
  if (endpoint) {
    return {
      id: endpoint._id,
      startPage: endpoint.startPage,
      goalPage: endpoint.goalPage,
      path: endpoint.path,
    };
  }
  return new Error('No endpoint given');
};

export const getRandomEndpoint = (callback) => {
  Endpoint.findOne().then((endpoint) => {
    if (!endpoint) {
      callback({
        id: 'end',
        startPage: 'wikipedia.org/wiki/Mezzaluna',
        goalPage: 'wikipedia.org/wiki/Pizza',
        path: [
          'wikipedia.org/wiki/Mezzaluna',
          'wikipedia.org/wiki/Pizza',
        ],
      });
    } else {
      endpoint.remove();
      let pathGood = true;
      endpoint.path.forEach((url) => {
        if (url.charAt(0) === '_') {
          pathGood = false;
        }
      });
      if (pathGood) {
        callback(cleanEndpoint(endpoint));
      } else {
        getRandomEndpoint(callback);
      }
    }
  }).catch((err) => {
    console.log(err);
  });
};

export const insertEndpoint = (startPage, goalPage, path = [], callback) => {
  const newEndpoint = new Endpoint();
  newEndpoint.startPage = startPage;
  newEndpoint.goalPage = goalPage;
  const newPath = [];
  let url = path[0];
  let i;
  for (i = 1; i < path.length; i += 1) {
    if (path[i].charAt(0) === '_') {
      url += path[i];
    } else {
      newPath.push(url);
      url = path[i];
    }
    if (i === path.length - 1) {
      newPath.push(url);
    }
  }
  newEndpoint.path = newPath;
  newEndpoint.save();
  callback(cleanEndpoint(newEndpoint));
};
