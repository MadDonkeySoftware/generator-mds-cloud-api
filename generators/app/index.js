const _ = require('lodash');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('name', { type: String });
    this.option('description', { type: String });
    this.option('dockerRegistryPrefix', { type: String });
  }

  async prompting() {
    const prompts = [];

    if (!this.options.name) {
      prompts.push({
        type: 'input',
        name: 'name',
        message: 'Project Name',
        default: this.options.name || this.appname // default to the current folder
      });
    }

    if (!this.options.description) {
      prompts.push({
        type: 'input',
        name: 'description',
        message: 'A short description of the project',
        default: ''
      });
    }

    if (!this.options.dockerRegistryPrefix) {
      prompts.push({
        type: 'input',
        name: 'dockerRegistryPrefix',
        message: 'DockerRegistryPrefix (blank to skip. Ex: 192.168.1.100:5000/user/)',
        default: null
      });
    }

    const answers = await this.prompt(prompts);
    this.answers = _.merge({}, answers, this.options)
  }

  /**
   * @param {String} key
   * @param {Object} [templateArgs]
   */
  _copyFile(key, templateArgs) {
    if (templateArgs) {
      this.fs.copyTpl(this.templatePath(key), this.destinationPath(key), templateArgs);
    } else {
      this.fs.copy(this.templatePath(key), this.destinationPath(key));
    }
  }

  async writing() {
    const templateArgs = {
      ...this.answers,
    };

    // Standardize
    if (templateArgs.dockerRegistryPrefix && !templateArgs.dockerRegistryPrefix.endsWith('/')) {
      templateArgs.dockerRegistryPrefix = templateArgs.dockerRegistryPrefix + '/';
    }

    this._copyFile('README.md', templateArgs);
    this._copyFile('package.json', templateArgs);
    this._copyFile('LICENSE', templateArgs);
    this._copyFile('Dockerfile', templateArgs);
    if (templateArgs.dockerRegistryPrefix) {
      this._copyFile('docker-build.sh', templateArgs);
    } else {
      this.log('Skipping docker-build.sh');
    }
    this._copyFile('.dockerignore');
    this._copyFile('.eslintignore');
    this._copyFile('.eslintrc.js');
    this._copyFile('.gitignore');
    this._copyFile('.mocharc.json');
    this._copyFile('.nycrc.json');

    this._copyFile('src/index.js');
    this._copyFile('src/globals.js', templateArgs);
    this._copyFile('src/bunyan-logstash-http.js');

    this._copyFile('src/handlers/index.js');
    this._copyFile('src/handlers/app_shutdown.js');

    this._copyFile('.vscode/launch.json');
  }
};