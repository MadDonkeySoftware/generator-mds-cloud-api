const bodyParser = require('body-parser');
const express = require('express');

const { logger } = require('./globals');
const handlers = require('./handlers');
const appShutdown = require('./handlers/app_shutdown');

const app = express();
const port = 8888;

const requestLogger = (req, res, next) => {
  logger.trace(`Handling ${req.path} - ${req.method}`);
  next();
};

const commonResponseSetup = (req, res, next) => {
  res.setHeader('content-type', 'application/json');
  next();
};

const configureRoutes = (expressApp) => {
  expressApp.get('/', (req, res) => {
    // TODO: Need to create help documentation and publish it here.
    res.send('Hello World!');
  });

  expressApp.use('/', handlers);
};

app.use(requestLogger);
app.use(commonResponseSetup);
app.use(bodyParser.json());
app.use(bodyParser.text());
configureRoutes(app);
appShutdown.wire();

app.listen(port, () => logger.info(`Example app listening on port ${port}!`));
