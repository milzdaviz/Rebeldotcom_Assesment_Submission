const express = require('express');
const app = express();
const cors = require('cors');
require('./db/mongoose')

app.use(cors());
app.use(express.json());

app.use("/", require('./routes/controller'));

module.exports = app;