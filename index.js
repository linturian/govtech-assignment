const { handleError } = require('./helper/error-handler');
require('express-async-errors');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

var routes = require('./routes/index');
app.use('/api', routes);

app.use((err, req, res, next) => {
  handleError(err, res);
});

app.listen(port)



module.exports = app;
