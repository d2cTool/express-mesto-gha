const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const {
  signUpValidation,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/:userId', getUserById);
// router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

router.post('/signup', express.json(), signUpValidation, createUser);
// router.post('/signin', express.json(), signInValidation, login);

module.exports = router;
