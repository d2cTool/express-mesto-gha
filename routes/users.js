const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const {
  userAvatarValidation,
  userInfoValidation,
  userIdValidation,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', userIdValidation, getUserById);
router.patch('/me', userInfoValidation, updateUser);
router.patch('/me/avatar', userAvatarValidation, updateAvatar);

module.exports = router;
