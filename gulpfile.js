var gulp         = require('gulp');
var sass         = require('gulp-sass');
var scsslint     = require('gulp-scss-lint');
var nano         = require('gulp-cssnano');
var shell        = require('gulp-shell');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync').create();
var deploy       = require('gulp-gh-pages');
var svgstore     = require('gulp-svgstore');
var rename       = require('gulp-rename');

// Build incrementally with _config.yml + _local_config.yml for local development
gulp.task('local-build', shell.task(['bundle exec jekyll build --config _config.yml,_local_config.yml']));

// Build incrementally with _config.yml for production
gulp.task('production-build', shell.task(['bundle exec jekyll build --config _config.yml']));

// Compile SCSS into CSS, sourcemaps, autoprefixer, cssnano + auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src(['_styles/scss/style.scss'])
  .pipe(sass({
    includePaths: [
      'node_modules/ibm-design-colors',
    ]
  }))
  .pipe(autoprefixer())
  .pipe(nano({discardComments: {removeAll: true}}))
  .pipe(gulp.dest('_site/assets/css'))
  .pipe(browserSync.stream());
});

// Create icon-store.svg
gulp.task('icons', function() {
  return gulp.src(['node_modules/ibm-design-icons/dist/svg/**/*.svg', 'images/**/*.svg'])
    .pipe(svgstore())
    .pipe(rename('icon-store.svg'))
    .pipe(gulp.dest('_site/images/'));
});

// Start a local server with browser-sync + watch for changes
gulp.task('serve', function() {
  browserSync.init({
    server: { baseDir: '_site/' }
  });

  gulp.watch('_styles/scss/**/*.scss', gulp.series('local-build', 'sass', 'icons'));
  gulp.watch(['_includes/*.html', '_layouts/*.html', 'index.md', '**/*.md'], gulp.series('local-build', 'sass', 'icons'));
  gulp.watch('_site/**/*.*').on('change', browserSync.reload);
});

// Run sass, local-build, and serve
gulp.task('default', gulp.series('local-build', 'sass', 'icons', 'serve'));

// Pipe CNAME to _site if you are using a custom URL
gulp.task('cname', function() {
  return gulp.src(['CNAME'])
    .pipe(gulp.dest('_site/'));
});

// Deploy _site to gh-pages; note: add the 'cname' task to this tasks series if you are using a custom URL
gulp.task('deploy-gh-pages', gulp.series('production-build', 'sass', 'icons'), function() {
  return gulp.src('_site/**/*')
    .pipe(deploy());
});

// Run production-build, and deploy-gh-pages
gulp.task('deploy', gulp.series('deploy-gh-pages'));
