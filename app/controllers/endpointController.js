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
          'wikipedia.org/wiki/Knife',
        ],
      });
    } else {
      // endpoint.remove();
      // callback(cleanEndpoint(endpoint));
      callback({
        id: 'end',
        startPage: 'wikipedia.org/wiki/Mezzaluna',
        goalPage: 'wikipedia.org/wiki/Pizza',
        path: [
          'wikipedia.org/wiki/Mezzaluna',
          'wikipedia.org/wiki/Knife',
        ],
      });
    }
  }).catch((err) => {
    console.log(err);
  });
};

export const insertEndpoint = (startPage, goalPage, path = [], callback) => {
  const newEndpoint = new Endpoint();
  newEndpoint.startPage = startPage;
  newEndpoint.goalPage = goalPage;
  newEndpoint.path = path;
  newEndpoint.save();
  callback(cleanEndpoint(newEndpoint));
};
