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
    if (this.options.writeJenkins === undefined) {
      firstAnswers = await this.prompt([
        {
          type: 'confirm',
          name: 'writeJenkins',
          message: 'Write Jenkinsfile stub?',
          default: false,
        }
      ]);
    }

    answers = _.merge({}, firstAnswers, this.options);
    if (answers.writeJenkins) {
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

    if (this.stringIsTruthy(this.options.writeJenkins) || this.answers.writeJenkins) {
      // Standardize
      if (templateArgs.dockerRegistryPrefix && !templateArgs.dockerRegistryPrefix.endsWith('/')) {
        templateArgs.dockerRegistryPrefix = templateArgs.dockerRegistryPrefix + '/';
      }

      this.copyFile('Jenkinsfile', templateArgs);
    }
  }
}