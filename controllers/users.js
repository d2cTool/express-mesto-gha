const InvalidArgumentsError = require('../errors/invalidArgumentsError');
const NotFoundError = require('../errors/notFoundError');
const User = require('../models/user');

const getUsers = (req, res, next) => User
  .find()
  .then((users) => res.send(users))
  .catch((err) => next(err));

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User
    .create({
      name, about, avatar, email, password,
    })
    .then((user) => res.status(200).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidArgumentsError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

const getUserById = (req, res, next) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
      next(new NotFoundError('Пользователь по указанному _id не найден'));
    })
    .catch((err) => next(err));
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User
    .findById(req.params.userId)
    .then((user) => {
      if (user) {
        User
          .findByIdAndUpdate(
            req.user._id,
            { name, about },
            {
              new: true,
            },
          )
          .then(() => res.send({ data: user }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new InvalidArgumentsError('Переданы некорректные данные при обновлении профиля'));
            }
            next(err);
          });
      }
      next(new NotFoundError('Пользователь с указанным _id не найден'));
    })
    .catch((err) => next(err));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User
    .findById(req.params.userId)
    .then((user) => {
      if (user) {
        User
          .findByIdAndUpdate(
            req.user._id,
            { avatar },
            {
              new: true, runValidators: true,
            },
          )
          .then(() => res.send({ data: user }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new InvalidArgumentsError('Переданы некорректные данные при обновлении профиля'));
            }
            next(err);
          });
      }
      next(new NotFoundError('Пользователь с указанным _id не найден'));
    })
    .catch((err) => next(err));
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  updateAvatar,
  getUserById,
};
