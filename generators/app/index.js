const _ = require('lodash');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('githubName', { type: String, description: 'The name to use for the project in Github links and documentation' });
    this.option('nodeName', { type: String, description: 'The project name to use for various node/npm resources.' });
    this.option('description', { type: String, description: 'The description to use for the github README.md and node package.json files.' });
    this.option('writeVSCode', { type: Boolean, default: undefined, description: 'True to write the VSCode launch config, false to skip. Undefined to prompt.'})
    this.option('writeDocker', { type: Boolean, default: undefined, description: 'True to write the Docker stubs, false to skip. Undefined to prompt.'})
    this.option('dockerRegistryPrefix', { type: String, description: 'The docker registry prefix to use.' });
    this.option('dockerContainerName', { type: String, description: 'The container name to use.' });
  }

  initializing() {
    this.composeWith(require.resolve('../base'), this.options);
    this.composeWith(require.resolve('../vscode'), this.options);
    this.composeWith(require.resolve('../docker'), this.options);
  }
};