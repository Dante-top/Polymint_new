const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const app = express();
const Web3 = require('web3');
const bodyParser = require('body-parser');

const db = require('./models');
db.sequelize.sync();

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(routes);
// Handling Errors
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';
  res.status(err.statusCode).json({
    message: err.message,
  });
});

app.listen(3001, () => console.log('Server is running on port 3001'));
