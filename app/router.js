import { Router } from 'express';
import * as User from './controllers/user_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to the webadventure api!' });
});

// Sign in & sign up
// router.post('/signin', requireSignin, UserController.signin);
router.get('/users', User.getUsers);
router.post('/signup', User.signup);

// Return a user's information
// router.route('/users/:userId')
//   .get(requireAuth, UserController.fetchUser)
//   .put(requireAuth, UserController.updateUser);

export default router;
