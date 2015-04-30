'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the snowy ' + chalk.red('Sleighdogs Boilerplate') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What is the name of the app/web? (lowercase only, no white-space)',
      default: 'web_app'
    },{
      type: 'list',
      name: 'cssframework',
      message: 'What CSS Framework do you want to install?',
      choices: [{
        value: 'inuit',
        name: 'inuit.css'
      },{
        value: 'bootstrap-sass-official',
        name: 'twitter bootstrap (sass version)',
      },{
        value: 'none',
        name: 'none'
      }]
    },{
      type: 'checkbox',
      name: 'components',
      message: 'Which components do you want to install? (Press Space to select)',
      choices: [{
        value: 'bourbon',
        name: 'Bourbon',
        checked: true,
      },{
        value: 'animate.css',
        name: 'Animate.css',
      }]
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      this.camelName = _s.classify(props.name);

      this.bowerInstall([props.cssframework],{'saveDev': true});

      for (var component in props.components) {
        this.bowerInstall([props.components[component]],{'saveDev': true});
      }

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {name: this.camelName}
      );
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        {name: this.camelName}
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('src/'),
        this.destinationPath('src/')
      );
      this.fs.copy(
        this.templatePath('public/'),
        this.destinationPath('public/')
      );
      this.fs.copyTpl(
        this.templatePath('style.scss'),
        this.destinationPath('src/sass/style.scss'),
        {props: this.props}
      );
      if (this.props.cssframework === 'inuit.css') {
        this.fs.copy(
          this.templatePath('inuit_vars.scss'),
          this.destinationPath('src/sass/inuit_vars.scss')
        );
      }
    }
  },

  install: function () {
    this.installDependencies();
  }
});
