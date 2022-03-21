const User = require('../models/user');

const getUsers = (req, res, next) => User
  .find()
  .then((users) => res.send(users))
  .catch((err) => res.status(500).send(err));

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User
    .create({
      name, about, avatar, email, password,
    })
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => res.status(400).send('Переданы некорректные данные при создании пользователя'));
};

const getUserById = (req, res, next) => {
  User
    .findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(404).send('Пользователь по указанному _id не найден'));
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
      },
    )
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send('Переданы некорректные данные при обновлении профиля'));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true, runValidators: true,
      },
    )
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send('Переданы некорректные данные при обновлении аватара'));
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  updateAvatar,
  getUserById,
};
