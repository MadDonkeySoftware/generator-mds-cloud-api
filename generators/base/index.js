const _ = require('lodash');
const snakeCase = require('snake-case');

const Generator = require('../BaseGenerator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async prompting() {
    var prompts = [];

    this.conditionalPrompt(prompts, {
      type: 'input',
      name: 'githubName',
      message: 'GitHub Repository Name',
      default: this.options.githubName || this.appname // default to the current folder
    })

    const firstAnswers = await this.prompt(prompts);
    prompts = [];

    this.conditionalPrompt(prompts, {
      type: 'input',
      name: 'nodeName',
      message: 'Node Project Name',
      default: snakeCase.snakeCase(this.options.nodeName || this.appname, { delimiter: '-' })
    });
    this.conditionalPrompt(prompts, {
      type: 'input',
      name: 'description',
      message: 'A short description of the project',
      default: ''
    })
    this.conditionalPrompt(prompts, {
      type: 'input',
      name: 'dockerRegistryPrefix',
      message: 'DockerRegistryPrefix (blank to skip. Ex: 192.168.1.100:5000/user/)',
      default: null
    })

    const secondAnswers = await this.prompt(prompts);
    this.answers = _.merge({}, firstAnswers, secondAnswers, this.options);
  }

  async writing() {
    const templateArgs = {
      ...this.answers,
    };

    // Standardize
    if (templateArgs.dockerRegistryPrefix && !templateArgs.dockerRegistryPrefix.endsWith('/')) {
      templateArgs.dockerRegistryPrefix = templateArgs.dockerRegistryPrefix + '/';
    }

    this.copyFile('README.md', templateArgs);
    this.copyFile('package.json', templateArgs);
    this.copyFile('LICENSE', templateArgs);
    this.copyFile('.eslintignore');
    this.copyFile('.eslintrc.js');
    this.copyFile('.gitignore');
    this.copyFile('.mocharc.json');
    this.copyFile('.nycrc.json');

    this.copyFile('bin/server');

    this.copyFile('src/index.js');
    this.copyFile('src/index.test.js');
    this.copyFile('src/globals.js', templateArgs);
    this.copyFile('src/globals.test.js');
    this.copyFile('src/bunyan-logstash-http.js');
    this.copyFile('src/bunyan-logstash-http.test.js');

    this.copyFile('src/handlers/index.js');
    this.copyFile('src/handlers/index.test.js');
    this.copyFile('src/handlers/app_shutdown.js');
  }
};