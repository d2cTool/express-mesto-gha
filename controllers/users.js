const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const UnauthorizedError = require('../errors/unauthorizedError');
const User = require('../models/user');

const getUsers = (req, res, next) => User
  .find({})
  .then((users) => res.send(users))
  .catch((err) => next(err));

const getUser = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const usr = await User.findById(userId);
    if (usr) {
      res.send(usr);
    } else {
      throw new NotFoundError('User is not found');
    }
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    next(new ConflictError('User already exist'));
  }

  try {
    const newUser = new User({
      name, about, avatar, email, password,
    });

    await User.create(newUser);
    await res.send({
      user: {
        id: newUser._id,
        name,
        about,
        avatar,
        email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getUserById = (req, res, next) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('User is not found'));
      }
    })
    .catch((err) => next(err));
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
          .catch((err) => next(err));
      } else {
        next(new NotFoundError('User is not found'));
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
          .catch((err) => next(err));
      } else {
        next(new NotFoundError('User is not found'));
      }
    })
    .catch((err) => next(err));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User
    .findUser(email, password)
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
  getUser,
};
