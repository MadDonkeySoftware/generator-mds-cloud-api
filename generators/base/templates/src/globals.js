const _ = require('lodash');
const bunyan = require('bunyan');
const bunyanLogstashHttp = require('./bunyan-logstash-http');

const self = {
  LOGGER: undefined,

  buildLogStreams: () => {
    const loggerMetadata = { fromLocal: self.getEnvVar('DEBUG') };
    const logStreams = [];

    if (!/test/.test(self.getEnvVar('NODE_ENV'))) {
      logStreams.push({
        stream: process.stdout,
      });
    }

    if (self.getEnvVar('MDS_LOG_URL')) {
      logStreams.push({
        stream: bunyanLogstashHttp.createLoggerStream({
          loggingEndpoint: self.getEnvVar('MDS_LOG_URL'),
          level: 'debug',
          metadata: loggerMetadata,
        }),
      });
    }

    return logStreams;
  },

  /**
   * @returns the current logger for the application
   */
  getLogger: () => {
    if (!self.LOGGER) {
      self.LOGGER = bunyan.createLogger({
        name: '<%= githubName %>',
        level: bunyan.TRACE,
        serializers: bunyan.stdSerializers,
        streams: self.buildLogStreams(),
      });
    }
    return self.LOGGER;
  },

  delay: (timeout) => new Promise((resolve) => setTimeout(resolve, timeout)),

  /**
   * Provides a wrapper around process.env for testing
   * @param {string} key the environment variable key
   * @param {string} defaultValue the value to return when the key does not contain a value
   * @return {string} the environment variable value
   */
  getEnvVar: (key, defaultValue) => _.get(process.env, [key], defaultValue),
};

module.exports = self;
