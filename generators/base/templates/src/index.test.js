const supertest = require('supertest');

const src = require('.');

describe(__filename, () => {
  it('provides the root url', () => {
    // Arrange
    const app = src.buildApp();

    // Act / Assert
    return supertest(app)
      .get('/')
      .expect('content-type', /application\/json/)
      .expect(200);
  });
});
