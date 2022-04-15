const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
// const { route } = require('./users');
const { signUpValidation } = require('../middlewares/validation');
const { createUser } = require('../controllers/users');

const NotFoundError = require('../errors/notFoundError');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.post('/signup', express.json(), signUpValidation, createUser);

router.use((req, res) => next(new NotFoundError('Что-то пошло не так')));

module.exports = router;
