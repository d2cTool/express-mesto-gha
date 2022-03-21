const InvalidArgumentsError = require('../errors/invalidArgumentsError');
const NotFoundError = require('../errors/notFoundError');
const Card = require('../models/card');

const getCards = (req, res, next) => Card
  .find()
  .then((cards) => res.status(200).send(cards))
  .catch((err) => next(err));

const createCard = (req, res, next) => {
  const { name, link, likes } = req.body;

  Card
    .create({
      name, link, owner: req.user._id, likes,
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidArgumentsError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (card) {
        Card
          .findByIdAndRemove(req.params.cardId)
          .then(() => res.send({ data: card }))
          .catch((err) => next(err));
      } else {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
    })
    .catch((err) => next(err));
};

const likeCard = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (card) {
        Card
          .findByIdAndUpdate(
            req.params.cardId,
            { $addToSet: { likes: req.user._id } },
            { new: true },
          )
          .then((likes) => res.send({ data: likes }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new InvalidArgumentsError('Переданы некорректные данные для постановки лайка'));
            } else {
              next(err);
            }
          });
      } else {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (card) {
        Card.findByIdAndUpdate(
          req.params.cardId,
          { $pull: { likes: req.user._id } },
          { new: true },
        )
          .then((likes) => res.send({ data: likes }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new InvalidArgumentsError('Переданы некорректные данные для снятии лайка'));
            } else {
              next(err);
            }
          });
      } else {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
