/*
NOTE: We use the exported version of many methods in this module to allow
the unit tests to easily stub.
*/
const _ = require('lodash');
const axios = require('axios');
const orid = require('@maddonkeysoftware/orid-node');
const jwt = require('jsonwebtoken');
const urlJoin = require('url-join');

const globals = require('../globals');

const self = {
  SIGNATURE: undefined,

  getIssuer: () => globals.getEnvVar('ORID_PROVIDER_KEY'),

  getAppPublicSignature: async () => {
    if (!self.SIGNATURE) {
      const url = urlJoin(
        globals.getEnvVar('MDS_IDENTITY_URL', 'http://localhost'),
        'v1',
        'publicSignature',
      );
      const resp = await axios.get(url);
      self.SIGNATURE = _.get(resp, ['data', 'signature']);
    }
    return self.SIGNATURE;
  },

  sendResponse: (response, status, body) => {
    response.status(status || 200);
    response.send(body);
    return Promise.resolve();
  },

  recombineUrlParts: (params, key) => {
    let value = params[key];
    let i = 0;

    while (params[i] && i <= Number.MAX_SAFE_INTEGER) {
      value += params[i];
      i += 1;
    }

    return value;
  },

  getOridFromRequest: (request, key) => {
    const { params } = request;
    const input = self.recombineUrlParts(params, key);
    const reqOrid = orid.v1.isValid(input) ? orid.v1.parse(input) : undefined;

    return reqOrid;
  },

  validateToken: (logger) => async (request, response, next) => {
    const { headers } = request;
    const { token } = headers;
    if (!token) {
      response.setHeader('content-type', 'text/plain');
      return self.sendResponse(
        response,
        403,
        'Please include authentication token in header "token"',
      );
    }

    try {
      const publicSignature = await self.getAppPublicSignature();
      const parsedToken = jwt.verify(token, publicSignature, {
        complete: true,
      });
      if (parsedToken && parsedToken.payload.iss === self.getIssuer()) {
        request.parsedToken = parsedToken;
      } else {
        /* istanbul ignore else */
        if (logger)
          logger.debug({ token: parsedToken }, 'Invalid token detected.');
        return self.sendResponse(response, 403);
      }
    } catch (err) {
      /* istanbul ignore else */
      if (logger) logger.debug({ err }, 'Error detected while parsing token.');
      return self.sendResponse(response, 403);
    }
    return next();
  },

  ensureRequestOrid: (withRider, key) => (request, response, next) => {
    const reqOrid = self.getOridFromRequest(request, key);

    if (!reqOrid || (withRider && !reqOrid.resourceRider)) {
      response.setHeader('content-type', 'text/plain');
      return self.sendResponse(response, 400, 'resource not understood');
    }

    return next();
  },

  canAccessResource:
    ({ oridKey, logger }) =>
    (request, response, next) => {
      const reqOrid = self.getOridFromRequest(request, oridKey);

      const tokenAccountId = _.get(request, [
        'parsedToken',
        'payload',
        'accountId',
      ]);

      if (tokenAccountId !== reqOrid.custom3 && tokenAccountId !== '1') {
        /* istanbul ignore else */
        if (logger) {
          logger.debug(
            { tokenAccountId, requestAccount: reqOrid.custom3 },
            'Insufficient privilege for request',
          );
        }
        return self.sendResponse(response, 403);
      }

      return next();
    },
};

module.exports = self;
