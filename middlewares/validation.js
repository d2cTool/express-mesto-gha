const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { ObjectId } = require('mongoose').Types;

exports.signUpValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((e) => validator.isEmail(e)),
    password: Joi.string().required(),
    // name: Joi.string().min(2).max(30),
    // about: Joi.string().min(2).max(30),
    // avatar: Joi.string().custom((u) => validator.isURL(u)),
  }),
});

exports.signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

exports.patchUserMeValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

exports.patchUserAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value) => validator.isURL(value)),
  }),
});

exports.validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
});

exports.createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'any.required': 'Поле "password" должно быть заполнено',
      }),
    link: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
  }),
});

exports.userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required()
      .messages({
        'any.required': 'Поле "id" должно быть заполнено',
      }),
  }),
});
