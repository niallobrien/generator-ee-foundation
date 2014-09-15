# Foundation asset pipeline for Expression Engine

[Yeoman](http://yeoman.io) generator that scaffolds out a Foundation 5 front-end for Expression Engine using [Gulp](http://gulpjs.com/) for the build process.

## Features

* Any changes you make to your html, styles, scripts etc. will be automatically shown without you having to refresh the browser or worry about compiling etc. Welcome to awesome-town my friend! :)


* Built-in preview server with BrowserSync *(new)*
* CSS Autoprefixing *(new)*
* Automagically compile Sass (via libsass) *(new)*
* Automagically lint your scripts
* Awesome Image Optimization (via OptiPNG, pngquant, jpegtran and gifsicle)
* Automagically wire-up dependencies installed with [Bower](http://bower.io) (when you run `gulp watch` or `gulp wiredep`)

## Getting Started

- Install Expression Engine into your project directory
- Set your vhost/server name to `dev.ee.local` in MAMP etc. and point it to your project.
- Install: `npm install generator-ee-foundation -g`.
- Run: `yo ee-foundation` in your project directory.
- Within Expression Engine, set your master template to `master.html` under `admin/templates/default_site/layouts.group/` which was created by this generator (I like to rename the Expression Engine `system` directory to `admin`).
- Run `gulp watch` when developing. This will wire all bower dependencies & watch your styles, scripts and even your Gulpfile for changes and automatically reload the browser.
- Default styles are included for `small`, `medium` and `large` breakpoints, so style accordingly.
- When ready to deploy, run `gulp build` and this will generate a `dist` directory (distribution) which will contain your production ready files, ready to be deployed.
- If you want to over-ride any of Foundation's settings, please see `_settings.scss`.
- Hit me up with questions on Twitter: @niall_obrien


## NOTE
Libsass (gulp-sass) does not yet support all of the features of Ruby Sass >= 3.3. At the moment, gulp-sass cannot compile Foundation 5.4.3 out of the box as they're using Sass syntax >= 3.3. Please see [this open issue](https://github.com/zurb/foundation/pull/5632) and [this forum thread](http://foundation.zurb.com/forum/posts/19063-grunt---error-error-reading-values-after----libsass). Remove the `!global` statement from the `_functions.scss` file and gulp-sass will work. I tried gulp-ruby-sass, which can compile with no problems, but damn it's slow!


#### Third-Party Dependencies

*(HTML/CSS/JS/Images/etc)*

To install dependencies, run `bower install depName --save` to get the files. When you run `gulp watch` again, it will automatically wire your dependencies in your `master.html` file.

## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.

* `--test-framework=<framework>`

  Defaults to `mocha`. Can be switched for another supported testing framework like `jasmine`.


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
