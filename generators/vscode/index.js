const Generator = require('../BaseGenerator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async prompting() {
    if (this.options.writeVSCode === undefined) {
      this.answers = await this.prompt([
        {
          type: 'confirm',
          name: 'writeVSCodeLaunchConfig',
          message: 'Write VSCode launch config?',
          default: false,
        }
      ]);
    }
  }

  async writing() {
    if (this.stringIsTruthy(this.options.writeVSCode) || this.answers.writeVSCodeLaunchConfig) {
      this.copyFile('.vscode/launch.json');
      this.copyFile('.vscode/settings.json');
    }
  }
}