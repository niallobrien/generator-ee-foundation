'use strict';
var fs = require('fs');
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var wiredep = require('wiredep');

var AppGenerator = module.exports = function Appgenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.options = options;
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AppGenerator, yeoman.generators.Base);

AppGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  if (!this.options['skip-welcome-message']) {
    console.log(this.yeoman);
    console.log(chalk.magenta('Out of the box I include HTML5 Boilerplate, jQuery, and a gulpfile.js to build your app.'));
  }

  var prompts = [{
    type: 'checkbox',
    name: 'features',
    message: 'What more would you like?',
    choices: [{
      name: 'Foundation 5',
      value: 'includeFoundation',
      checked: true
    }, {
      name: 'Modernizr',
      value: 'includeModernizr',
      checked: true
    }]
  }];

  this.prompt(prompts, function (answers) {
    var features = answers.features;

    var hasFeature = function (feat) {
      return features.indexOf(feat) !== -1;
    }

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.includeFoundation = hasFeature('includeFoundation');
    this.includeModernizr = hasFeature('includeModernizr');

    cb();
  }.bind(this));
};

AppGenerator.prototype.gulpfile = function () {
  this.template('gulpfile.js');
};

AppGenerator.prototype.packageJSON = function () {
  this.template('_package.json', 'package.json');
};

AppGenerator.prototype.git = function () {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

AppGenerator.prototype.bower = function () {
  this.copy('bowerrc', '.bowerrc');
  this.copy('bower.json', 'bower.json');
};

AppGenerator.prototype.jshint = function () {
  this.copy('jshintrc', '.jshintrc');
};

AppGenerator.prototype.editorConfig = function () {
  this.copy('editorconfig', '.editorconfig');
};

AppGenerator.prototype.mainStylesheet = function () {
  var css = 'main.scss';
  this.copy(css, 'assets/styles/' + css);
};

AppGenerator.prototype.responsiveStylesheets = function () {
  this.copy('_settings.scss', 'assets/styles/_settings.scss');
  this.copy('small.scss', 'assets/styles/small.scss');
  this.copy('medium.scss', 'assets/styles/medium.scss');
  this.copy('large.scss', 'assets/styles/large.scss');
};

AppGenerator.prototype.writeIndex = function () {
  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'master.html'));
  this.indexFile = this.engine(this.indexFile, this);

  // wire Bootstrap plugins
  if (this.includeFoundation) {
    var f5 = 'assets/bower_components/foundation/js/foundation/';
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
      f5 + 'foundation.abide.js',
      f5 + 'foundation.accordion.js',
      f5 + 'foundation.alert.js',
      f5 + 'foundation.clearing.js',
      f5 + 'foundation.dropdown.js',
      f5 + 'foundation.equalizer.js',
      f5 + 'foundation.interchange.js',
      f5 + 'foundation.joyride.js',
      f5 + 'foundation.js',
      f5 + 'foundation.magellan.js',
      f5 + 'foundation.offcanvas.js',
      f5 + 'foundation.orbit.js',
      f5 + 'foundation.reveal.js',
      f5 + 'foundation.slider.js',
      f5 + 'foundation.tab.js',
      f5 + 'foundation.tooltip.js',
      f5 + 'foundation.topbar.js'
    ]);
  }

  this.indexFile = this.appendFiles({
    html: this.indexFile,
    fileType: 'js',
    optimizedPath: 'assets/scripts/main.js',
    sourceFileList: ['assets/scripts/main.js']
  });
};

AppGenerator.prototype.app = function () {
  this.mkdir('assets');
  this.mkdir('assets/scripts');
  this.mkdir('assets/styles');
  this.mkdir('assets/images');
  this.write('admin/templates/default_site/layouts.group/master.html', this.indexFile);
  this.write('assets/scripts/main.js', 'console.log(\'\\\'Allo \\\'Allo!\');');
};

AppGenerator.prototype.install = function () {
  var howToInstall =
    '\nAfter running `npm install & bower install`, inject your front end dependencies into' +
    '\nyour HTML by running:' +
    '\n' +
    chalk.yellow.bold('\n  gulp wiredep');

  if (this.options['skip-install']) {
    console.log(howToInstall);
    return;
  }

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    callback: function () {
      var bowerJson = JSON.parse(fs.readFileSync('./bower.json'));

      // wire Bower packages to .html
      wiredep({
        bowerJson: bowerJson,
        directory: 'assets/bower_components',
        src: 'admin/templates/default_site/layouts.group/master.html'
      });

      // wire Bower packages to .scss
      wiredep({
        bowerJson: bowerJson,
        directory: 'assets/bower_components',
        src: 'assets/styles/*.scss'
      });

      done();
    }.bind(this)
  });
};
