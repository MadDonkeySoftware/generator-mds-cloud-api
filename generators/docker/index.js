const _ = require('lodash');
const snakeCase = require('snake-case');

const Generator = require('../BaseGenerator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async prompting() {
    let firstAnswers;
    if (this.options.writeDocker === undefined) {
      firstAnswers = await this.prompt([
        {
          type: 'confirm',
          name: 'writeDocker',
          message: 'Write Docker stubs?',
          default: false,
        }
      ]);
    }

    this.answers = _.merge({}, firstAnswers, this.options);
  }

  async writing() {
    const templateArgs = _.merge({}, this.options, this.answers);

    // Standardize
    if (templateArgs.dockerRegistryPrefix && !templateArgs.dockerRegistryPrefix.endsWith('/')) {
      templateArgs.dockerRegistryPrefix = templateArgs.dockerRegistryPrefix + '/';
    }

    if (this.stringIsTruthy(this.options.writeDocker) || this.answers.writeDocker) {
      this.copyFile('.dockerignore');
      this.copyFile('Dockerfile');
    }
  }
}