/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const chai = require('chai');

const globals = require('./globals');

describe(__filename, () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('getLogger', () => {
    it('Returns a logger', () => {
      // Act
      const logger = globals.getLogger();

      // Assert
      chai.expect(logger.debug).to.not.be.undefined;
      chai.expect(logger.error).to.not.be.undefined;
      chai.expect(logger.info).to.not.be.undefined;
      chai.expect(logger.trace).to.not.be.undefined;
      chai.expect(logger.warn).to.not.be.undefined;
    });
  });

  describe('buildLogStreams', () => {
    it('Includes bunyan logstash http stream when MDS_LOG_URL present', () => {
      // Arrange
      sinon
        .stub(globals, 'getEnvVar')
        .withArgs('MDS_LOG_URL')
        .returns('http://127.0.0.1:8080')
        .withArgs('NODE_ENV')
        .returns(undefined);

      // Act
      const streams = globals.buildLogStreams();

      // Assert
      chai.expect(streams.length).to.be.eql(2);
      chai.expect(streams[0].stream).to.eql(process.stdout);
      chai.expect(streams[1].stream).to.not.eql(process.stdout);
    });
  });

  describe('delay', () => {
    it('Delays for the provided duration', () => {
      // Arrange
      const start = new Date().getTime();
      const delay = 10;

      // Act
      return globals.delay(delay).then(() => {
        // Assert
        const done = new Date().getTime();
        const drift = done - start - delay;

        chai.expect(drift).to.be.lessThan(2);
      });
    });
  });

  describe('getEnvVar', () => {
    it('returns whatever value the environment variable has', () => {
      // Arrange
      const expected = new Date().toISOString();
      process.env.TEST_ENVIRONMENT_VARIABLE = expected;

      // Act
      const value = globals.getEnvVar('TEST_ENVIRONMENT_VARIABLE');

      // Assert
      chai.expect(value).to.equal(expected);
    });

    it('returns default value when the environment variable is empty', () => {
      // Act
      const value = globals.getEnvVar('TEST_ENVIRONMENT_VARIABLE_2');

      // Assert
      chai.expect(value).to.equal(undefined);
    });
  });
});
