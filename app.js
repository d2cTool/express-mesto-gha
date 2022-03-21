const mongoose = require('mongoose');
const express = require('express');
const indexRouter = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '62387570fcf9ffc7d18fa2c4',
  };

  next();
});
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});
app.use('/', indexRouter);
app.use((err, req, res, next) => res.status(err.statusCode).send({ message: err.message }));

app.listen(PORT, () => console.log(`App listening on port: ${PORT}`));
