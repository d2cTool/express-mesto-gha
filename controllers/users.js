const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
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

  if (!email || !password) {
    next(new InvalidArgumentsError('Отсутствует email или password пользователя'));
  }

  User
    .findOne({ email })
    .then((user) => {
      if (user) {
        next(new ConflictError('Пользователь с указанным email уже существует'));
      }
    })
    .catch((err) => next(err));

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
      } else {
        next(err);
      }
    });
};

const getUserById = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    next(new InvalidArgumentsError('Передан некорректный _id пользователя'));
  } else {
    User
      .findById(req.params.userId)
      .then((user) => {
        if (user) {
          res.send({ data: user });
        } else {
          next(new NotFoundError('Пользователь по указанному _id не найден'));
        }
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User
    .findById(req.user._id)
    .then((user) => {
      if (user) {
        User
          .findByIdAndUpdate(
            req.user._id,
            { name, about },
            {
              new: true,
              runValidators: true,
              upsert: false,
            },
          )
          .then((usr) => res.send({ data: usr }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new InvalidArgumentsError('Переданы некорректные данные при обновлении профиля'));
            } else {
              next(err);
            }
          });
      } else {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
    })
    .catch((err) => next(err));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User
    .findById(req.user._id)
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
          .then((usr) => res.send({ data: usr }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new InvalidArgumentsError('Переданы некорректные данные при обновлении профиля'));
            } else {
              next(err);
            }
          });
      } else {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
    })
    .catch((err) => next(err));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUser(email, password)
    .then((usr) => {
      const token = jwt.sign({ _id: usr._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => next(new UnauthorizedError(err.message)));
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  updateAvatar,
  getUserById,
  login,
};
