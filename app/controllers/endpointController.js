import Endpoint from '../models/endpointModel';

const cleanEndpoint = (endpoint) => {
  if (endpoint) {
    const start = `https://en.${endpoint.startPage}`;
    const goal = `https://en.${endpoint.goalPage}`;
    return {
      id: endpoint._id,
      startPage: start,
      goalPage: goal,
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
        startPage: 'https://en.wikipedia.org/wiki/Mezzaluna',
        goalPage: 'https://en.wikipedia.org/wiki/Knife',
        path: [],
      });
    } else {
      endpoint.remove();
      callback(cleanEndpoint(endpoint));
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
