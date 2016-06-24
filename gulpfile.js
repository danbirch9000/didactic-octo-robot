/// <binding BeforeBuild='buildSass, bundleAngularJs' ProjectOpened='watch, buildSass, bundleAngularJs' />
var config = require('./gulp.config');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var rimraf = require('rimraf');
var minify = require('gulp-minify');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');

gulp.task('cleanCss', function (done) {
    config.log('cleaning: ' + $.util.colors.red(config.cssDestination));
    return rimraf(config.cssDestination, done);
});

gulp.task('buildSass', function () {
    return gulp.src(config.sassFile)
    .pipe($.count('## files', { logFiles: true }))
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(config.cssDestination));
});

gulp.task('watch', function () {
    gulp.watch(config.sassSource, ['buildSass']);
    gulp.watch(config.appRoot + '**/*.js', ['bundleAngularJs']);
});


gulp.task('cleanAngularJs', function (done) {
    return rimraf(config.angularDestination + config.angularFileName, done);
});

gulp.task('bundleAngularJs', ['cleanAngularJs'], function () {
    var angularFilesort = require('gulp-angular-filesort');
    return gulp.src([config.appRoot + '**/*.js', '!' + config.appRoot + '**/*.spec.js']).pipe(angularFilesort())
        .pipe($.count('## files', { logFiles: true }))
        .pipe($.concat(config.angularFileName))
        .pipe($.minify({
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest(config.angularDestination));
});

gulp.task('clr-node-modules-libraries', function (done) {
    return rimraf(config.nodeModulesDest, done);
});

gulp.task('cpy-node-modules', ['clr-node-modules-libraries'], function () {
    return gulp.src(config.nodeModules, { base: 'node_modules' })
        .pipe($.count('## files', { logFiles: true }))
        .pipe(gulp.dest(config.nodeModulesDest));
});

gulp.task('default', ['watch', 'buildSass', 'cpy-node-modules']);