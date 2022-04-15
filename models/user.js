const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const salt = 10;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: (u) => validator.isURL(u),
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (e) => validator.isEmail(e),
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.pre('save', (next) => {
  bcrypt.hash(password, salt)
    .then((hash) => {
      this.password = hash;
      next();
    })
    .catch((err) => next(err));
});

userSchema.statics.findUser = (email, password) => {
  this.findOne({ email })
    .select('+password')
    .then(async (user) => {
      if (!user) {
        return Promise.reject(new Error('Некорректная почта или пароль'));
      }
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        return Promise.reject(new Error('Некорректная почта или пароль'));
      }
      return user;
    });
};

module.exports = mongoose.model('user', userSchema);
