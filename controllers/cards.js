const Card = require('../models/card');

const getCards = (req, res, next) => Card
  .find()
  .then((cards) => res.status(200).send(cards))
  .catch((err) => res.status(500).send(err));

const createCard = (req, res, next) => {
  const { name, link, likes } = req.body;

  Card
    .create({
      name, link, owner: req.user._id, likes,
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(400).send('Переданы некорректные данные при создании карточки'));
};

const deleteCard = (req, res, next) => {
  Card
    .findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(404).send('Карточка с указанным _id не найдена'));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(400).send('Переданы некорректные данные для постановки лайка'));
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => res.send({ data: likes }))
    .catch((err) => res.status(400).send('Переданы некорректные данные для снятии лайка'));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
