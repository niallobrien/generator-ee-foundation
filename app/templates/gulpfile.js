'use strict';
// generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

var gulp = require('gulp');
var spawn = require('child_process').spawn;
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
// var sass = require('gulp-ruby-sass');
var bowerFiles = require('main-bower-files');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('autoreload', function () {
    // Store current process if any
     var p;
     gulp.watch('./gulpfile.js', spawnChildren);
     // Comment the line below if you start your server by yourslef anywhere else
     spawnChildren();
    
     function spawnChildren(e) {
       if(p) {
         p.kill(); 
       }
    
       p = spawn('gulp', ['watch'], {stdio: 'inherit'});
     }
});

gulp.task('styles', function () {
    return gulp.src('assets/styles/main.scss')
        .pipe($.sass({
            errLogToConsole: true,
            onError: function(err) {
                return $.notify().write(err);
            }
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('assets/styles'))
        .pipe(reload({stream:true}))
        .pipe($.size())
        .pipe($.notify("Compilation complete."));;
});

gulp.task('scripts', function () {
    return gulp.src('assets/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.browserify())
        .pipe(reload({stream:true}))
        .pipe($.size());
});

gulp.task('html', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('admin/templates/default_site/layouts.group/*.html')
        .pipe($.useref.assets({searchPath: './'}))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('images', function () {
    return gulp.src('assets/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/assets/images'))
        .pipe(reload({stream:true, once:true}))
        .pipe($.size());
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')().concat('assets/fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('copy', function () {
    return gulp.src('admin/templates/default_site/layouts.group/*.html', { base: './'})
        .pipe(gulp.dest('dist'));
});

gulp.task('move', function () {
    gulp.src('./dist/*.html')
    .pipe(gulp.dest('./dist/admin/templates/default_site/layouts.group/'))

    gulp.src('./dist/*.html')
    .pipe($.rimraf())
});

gulp.task('clean', require('del').bind(null, ['dist']));

gulp.task('build', function() {
    runSequence('clean', 'wiredep', 'html', 'images', 'fonts', 'move');
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('serve', ['styles', 'wiredep'], function () {
    browserSync.init(null, {
        proxy: "dev.ee.local",
        logInfo: 'info',
        open: 'external',
        hostnameSuffix: ".xip.io"
    }, function (err, bs) {
        require('opn');
        console.log('Started connect web server on ' + bs.options.urls.external);
    });
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;
    gulp.src('assets/styles/*.scss')
        .pipe(wiredep({
            directory: 'assets/bower_components'
        }))
        .pipe(gulp.dest('assets/styles'));
        
    gulp.src('admin/templates/default_site/layouts.group/master.html')
        .pipe(wiredep({
            directory: 'assets/bower_components',
            ignorePath: '../../../../'
        }))
        .pipe(gulp.dest('admin/templates/default_site/layouts.group/'));
});


gulp.task('watch', ['serve'], function () {
 
    // watch for changes
    gulp.watch(['admin/templates/default_site/**/*.html'], reload);
 
    gulp.watch('assets/styles/**/*.scss', ['styles']);
    gulp.watch('assets/scripts/**/*.js', ['scripts']);
    gulp.watch('assets/images/**/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);
});
