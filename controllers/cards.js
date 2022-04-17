const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const Card = require('../models/card');

const getCards = (req, res, next) => Card.find()
  .then((cards) => res.send(cards))
  .catch((err) => next(err));

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Card is not found'))
    .then((card) => {
      if (!card.owner.equals(userId)) {
        next(new ForbiddenError("You cannot delete someone else's card"));
      } else {
        card.remove().then(() => res.send({ data: card }));
      }
    })
    .catch((err) => next(err));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Card is not found'))
    .then((likes) => res.send({ data: likes }))
    .catch((err) => next(err));
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Card is not found'))
    .then((likes) => res.send({ data: likes }))
    .catch((err) => next(err));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
