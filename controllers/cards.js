const mongoose = require('mongoose');
const InvalidArgumentsError = require('../errors/invalidArgumentsError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const Card = require('../models/card');

const getCards = (req, res, next) => Card
  .find()
  .then((cards) => res.send(cards))
  .catch((err) => next(err));

const createCard = (req, res, next) => {
  const { name, link, likes } = req.body;

  Card
    .create({
      name, link, owner: req.user._id, likes,
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;

  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (card) {
        if (!card.owner.equals(userId)) {
          next(new ForbiddenError("You cannot delete someone else's card"));
        }

        Card
          .findByIdAndRemove(req.params.cardId)
          .then(() => res.send({ data: card }))
          .catch((err) => next(err));
      } else {
        next(new NotFoundError('Card is not found'));
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
          .catch((err) => next(err));
      } else {
        next(new NotFoundError('Card is not found'));
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
          .catch((err) => next(err));
      } else {
        next(new NotFoundError('Card is not found'));
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
