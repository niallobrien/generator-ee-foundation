# Foundation asset pipeline for Expression Engine

[Yeoman](http://yeoman.io) generator that scaffolds out a Foundation 5 front-end for Expression Engine using [Gulp](http://gulpjs.com/) for the build process.

## Features

* Basically, any changes you make to your html, styles, scripts etc. will be automatically shown without you having to refresh the browser or worry about compiling etc. Welcome to awesome-town my friend! :)


* Built-in preview server with BrowserSync *(new)*
* CSS Autoprefixing *(new)*
* Automagically compile Sass (via libsass) *(new)*
* Automagically lint your scripts
* Awesome Image Optimization (via OptiPNG, pngquant, jpegtran and gifsicle)
* Automagically wire-up dependencies installed with [Bower](http://bower.io) (when `gulp watch` or `gulp wiredep`)

## Getting Started

- Install: `npm install -g generator-ee-foundation`
- Run: `yo ee-foundation` in your new project directory
- Set your vhost/server name to `local.ee.dev` in MAMP etc. and point it to the `app` directory within your new project 
- Run `gulp watch` when developing.
- Default styles are included for `small`, `medium` and `large` breakpoints, so style accordingly
- When ready to deploy, run `gulp` and this will generate a `dist` directory (distribution) when will contain your production ready files (this process will be improved in time)
- Hit me up with questions on Twitter: @niall_obrien


#### Third-Party Dependencies

*(HTML/CSS/JS/Images/etc)*

To install dependencies, run `bower install depName --save` to get the files, then add a `script` or `style` tag to your `index.html` or an other appropriate place.

## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.

* `--test-framework=<framework>`

  Defaults to `mocha`. Can be switched for another supported testing framework like `jasmine`.


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
