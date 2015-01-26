/* ====================================
 * Define paths
 * ==================================== */
var source = './source';
var build = './build';

/* ====================================
 * Load required plug-ins
 * ==================================== */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var runSequence = require('run-sequence');
var del = require('del');

/* ====================================
 * Web server
 * ==================================== */
gulp.task('serve', ['watch'], function(){
  browserSync({
    server: {
      baseDir: build
    },
    notify: false,
    ghostMode: false
  });
});

/* ====================================
 * Styles
 * ==================================== */
gulp.task('styles', function () {
  return gulp.src(source + '/scss/**/*.scss')
    .pipe($.rubySass())
    .pipe($.concat('style.css'))
    .pipe($.autoprefixer((["last 1 version", "> 1%", "ie 8", "ie 7"], { cascade: true })))
    .pipe($.minifyCss())
    .pipe(gulp.dest(build + '/css/'));
});

/* ====================================
 * Scripts
 * ==================================== */
 gulp.task('jshint', function() {
  return gulp.src(source + '/js/script.js')
  .pipe($.jshint())
  .pipe($.jshint.reporter('default'));
});

gulp.task('scripts', function () {
  return gulp.src([
    source + '/js/vendor/jquery.js',
    source + '/js/vendor/modernizr.js',
    source + '/js/plugins.js',
    source + '/js/bootstrap.js',
    source + '/js/script.js'
  ])
    .pipe($.uglify())
    .pipe($.concat('script.js'))
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(build + '/js'));
});

/* ====================================
 * Images
 * ==================================== */
gulp.task('images', function() {
  return gulp.src(source + '/img/**/*')
    .pipe($.cache($.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(build + '/img'));
});

/* ====================================
 * Includes
 * ==================================== */
gulp.task('fileinclude', function() {
  return gulp.src([
      source + '/htdocs/**/*.html',
      '!' + source + '/htdocs/_templates{,/**}'
    ])
    .pipe($.fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(build));
});

/* ====================================
 * Clean up
 * ==================================== */
gulp.task('clean', del.bind(null, ['build/*'], {dot: true}));

/* ====================================
 * Copy files
 * ==================================== */
gulp.task('copyfiles', function() {
    return gulp.src(source + '/**/*.{ttf,woff,eof,svg,ico}')
      .pipe(gulp.dest(build));
});

/* ====================================
 * Default Gulp task
 * ==================================== */
gulp.task('default', ['clean'], function(){
  runSequence(
    ['styles', 'scripts', 'images', 'fileinclude', 'copyfiles'],
    ['serve']
  );
});


/* ====================================
 * Watch
 * ==================================== */
gulp.task('watch', function() {
  gulp.watch(source + '/scss/**/*.scss', ['styles', reload]);

  gulp.watch(source + '/js/**/*.js', ['jshint', 'scripts', reload]);

  gulp.watch(source + '/img/**/*', ['images', reload]);

  gulp.watch(source + '/htdocs/**/*', ['fileinclude', reload]);
});
