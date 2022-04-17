const mongoose = require('mongoose');
const express = require('express');
const { errors } = require('celebrate');
const indexRouter = require('./routes/index');
const auth = require('./middlewares/auth');

const { signUpValidation, signInValidation } = require('./middlewares/validation');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/signup', signUpValidation, createUser);
app.post('/signin', signInValidation, login);

app.use(auth);

app.use('/', indexRouter);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(400).send({ message: 'Invalid data' });
  } else {
    res.status(statusCode).send({ message });
  }
  next();
});

app.listen(PORT);
