const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();