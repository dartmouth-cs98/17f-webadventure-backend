import Snake from '../models/snake_model';

export const getSnake = (req, res, next) => {
  User.findOne({ Snake_ID: req.Snake_ID }, (err, snake) => {
    if (snake == null) {
      snake = new Snake();
      snake.Snake_ID = req.body.Snake_ID;
      snake.NPC_Color = req.body.NPC_Color;
      snake.save()
      .then((result) => { return res(result); });
    }
  });
};

export const getSnakes = (req, res) => {
  Snake.find({}, (err, snakes) => {
    res(snakes);
  });
};

export const createSnake = (res, next) => {
  const Snake_ID = 11; // snake eyes

  // if (!Snake_ID) {
  //   return res.status(422).send('should ALWAYS have Snake_ID = 11 so idk why youre seeing this');
  // }

  const newSnake = new Snake();
  newSnake.Snake_ID = Snake_ID;
  newSnake.NPC_Color = { r: 0, g: 200, b: 100 },
  newSnake.save()
    .then((result) => {
      res.send({ token: result, id: result._id });
    })
    .catch((error) => {
      res.status(422).send('Error creating snake');
    });
};
