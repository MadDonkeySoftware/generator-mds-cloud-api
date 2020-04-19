const _ = require('lodash');
const snakeCase = require('snake-case');

const Generator = require('../BaseGenerator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async prompting() {
    let answers;
    let firstAnswers;
    let secondAnswers;
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

    answers = _.merge({}, firstAnswers, this.options);
    if (answers.writeDocker) {
      const prompts = []
      this.conditionalPrompt(prompts, {
          type: 'input',
          name: 'dockerRegistryPrefix',
          message: 'Docker registry prefix (Ex: 192.168.1.100:5000/user/)',
        });
      this.conditionalPrompt(prompts, {
          type: 'input',
          name: 'dockerContainerName',
          message: 'Docker container name',
          default: snakeCase.snakeCase(this.appname, { delimiter: '-' })
        });
      secondAnswers = await this.prompt(prompts);
    }

    this.answers = _.merge({}, answers, secondAnswers);
  }

  async writing() {
    const templateArgs = _.merge({}, this.options, this.answers);

    // Standardize
    if (templateArgs.dockerRegistryPrefix && !templateArgs.dockerRegistryPrefix.endsWith('/')) {
      templateArgs.dockerRegistryPrefix = templateArgs.dockerRegistryPrefix + '/';
    }

    if (this.options.writeDocker || this.answers.writeDocker) {
      this.copyFile('.dockerignore');
      this.copyFile('Dockerfile', templateArgs);
      this.copyFile('docker-build.sh', templateArgs);
    }
  }
}