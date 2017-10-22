import { Router } from 'express';
import * as User from './controllers/user_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to the webadventure api!' });
});

// Sign in & sign up
router.post('/signin', User.signin);
// router.get('/users', User.getUsers);
router.post('/signup', User.signup);

router.get('/user/:username', User.getUser);
router.get('/users', User.getUsers);

export default router;
