const express = require('express');
const handlerHelpers = require('./handler-helpers');

const router = express.Router();

const sampleHandler = (request, response) => {
  const { params, body } = request;
  const { param1 } = params;

  const msg = {
    ts: new Date().toISOString(),
    topic: param1,
    message: body,
  };

  handlerHelpers.sendResponse(response, 200, JSON.stringify(msg));
};

router.get('/sample/:param1', sampleHandler);

module.exports = router;
