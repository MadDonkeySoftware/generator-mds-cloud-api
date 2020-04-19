const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  /**
   * Prompt that can be bypassed via command line args
   * @param {Array<String>} prompts The array housing prompts
   * @param {Object} options Options for the prompt. See https://github.com/SBoudrias/Inquirer.js
   * @param {string} options.type Type of the prompt.
   * @param {string} options.name The key used to store the prompt answer.
   * @param {string} options.message The question to print to the user.
   * @param {string} options.default The default answer for this prompt.
   */
  conditionalPrompt(prompts, options) {
    if (this.options[options.name] === undefined) {
      prompts.push({
        ...options
      })
    }
  }

  /**
   * @param {String} key
   * @param {Object} [templateArgs]
   */
  copyFile(key, templateArgs) {
    if (templateArgs) {
      this.fs.copyTpl(this.templatePath(key), this.destinationPath(key), templateArgs);
    } else {
      this.fs.copy(this.templatePath(key), this.destinationPath(key));
    }
  }

};