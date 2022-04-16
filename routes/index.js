const express = require('express');
const userRouter = require('./users');
const cardRouter = require('./cards');
// const { route } = require('./users');

const NotFoundError = require('../errors/notFoundError');

const router = express.Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

// router.use((req, res) => next(new NotFoundError('Что-то пошло не так')));

module.exports = router;
