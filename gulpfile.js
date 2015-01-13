/* ====================================
 * Load required plug-ins
 * ==================================== */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

/* ====================================
 * Define paths
 * ==================================== */
var source = './source';
var build = './build';

/* ====================================
 * Web server
 * ==================================== */
gulp.task('webserver', function() {
  gulp.src(build)
    .pipe(plugins.webserver({
      livereload: true,
      port: 3000
    }));
});

/* ====================================
 * Styles
 * ==================================== */
gulp.task('styles', function () {
  return gulp.src(source + '/scss/**/*.scss')
    .pipe(plugins.rubySass())
    .pipe(plugins.concat('style.css'))
    .pipe(plugins.autoprefixer((["last 1 version", "> 1%", "ie 8", "ie 7"], { cascade: true })))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest(build + '/css/'))
    .pipe(plugins.notify({ message: 'Styles task complete' }));;
});

/* ====================================
 * Scripts
 * ==================================== */
 gulp.task('jshint', function() {
  return gulp.src(source + '/js/script.js')
  .pipe(plugins.jshint())
  .pipe(plugins.jshint.reporter('default'))
  .pipe(plugins.notify({ message: 'JS Hinting task complete' }));
});

gulp.task('scripts', function () {
  return gulp.src([
    source + '/js/vendor/jquery.js',
    source + '/js/vendor/modernizr.js',
    source + '/js/plugins.js',
    source + '/js/bootstrap.js',
    source + '/js/script.js'
  ])
    .pipe(plugins.uglify())
    .pipe(plugins.concat('script.js'))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest(build + '/js'))
    .pipe(plugins.notify({ message: 'Scripts task complete' }));
});

/* ====================================
 * Images
 * ==================================== */
gulp.task('images', function() {
  return gulp.src(source + '/img/**/*')
    .pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(build + '/img'))
    .pipe(plugins.notify({ message: 'Images task complete' }));
});

/* ====================================
 * Includes
 * ==================================== */
gulp.task('fileinclude', function() {
  return gulp.src([
      source + '/htdocs/**/*.html',
      '!' + source + '/htdocs/_templates{,/**}'
    ])
    .pipe(plugins.fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(build))
    .pipe(plugins.notify({ message: 'Includes: included' }));
});

/* ====================================
 * Clean up
 * ==================================== */
gulp.task('clean', function() {
  return gulp.src(build + '/**/*.*', { read: false })
    .pipe(plugins.rimraf({ force: true }));
});

/* ====================================
 * Copy files
 * ==================================== */
gulp.task('copyfiles', function() {
    return gulp.src(source + '/**/*.{ttf,woff,eof,svg}')
      .pipe(gulp.dest(build))
      .pipe(plugins.notify({ message: 'Files: copied' }));
});

/* ====================================
 * Default Gulp task
 * ==================================== */
gulp.task('default', ['clean', 'copyfiles', 'watch', 'webserver']);

/* ====================================
 * Watch
 * ==================================== */
gulp.task('watch', function() {

  // Compile on start
  gulp.start('styles', 'scripts', 'images', 'fileinclude');

  // Watch .scss files
  gulp.watch(source + '/scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch(source + '/js/**/*.js', ['jshint', 'scripts']);

  // Watch image files
  gulp.watch(source + '/img/**/*', ['images']);

  // Watch htdocs
  gulp.watch(source + '/htdocs/**/*', ['clean', 'fileinclude']);
});
