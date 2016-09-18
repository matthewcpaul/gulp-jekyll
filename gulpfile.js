var gulp         = require('gulp');
var sass         = require('gulp-sass');
var scsslint     = require('gulp-scss-lint');
var nano         = require('gulp-cssnano');
var shell        = require('gulp-shell');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync').create();
var deploy       = require('gulp-gh-pages');

// Compile SCSS into CSS, sourcemaps, autoprefixer, cssnano + auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src('_styles/scss/style.scss')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(sourcemaps.write())
  .pipe(autoprefixer())
  .pipe(gulp.dest('_styles/css'))
  .pipe(nano({discardComments: {removeAll: true}}))
  .pipe(gulp.dest('_site/assets/css'))
  .pipe(browserSync.stream());
});

// Build incrementally with _config.yml + local_config.yml for development
gulp.task('local-build', shell.task(['bundle exec jekyll build --config _config.yml,local_config.yml']));

// Start a local server with browser-sync + watch for changes
gulp.task('serve', ['sass', 'local-build'], function() {
    browserSync.init({
        server: { baseDir: '_site/' }
    });

    gulp.watch('_styles/scss/**/*.scss', ['sass']);
    gulp.watch(['_includes/*.html', '_layouts/*.html', 'index.md', '**/index.md'], ['local-build']);
    gulp.watch('_site/**/*.*').on('change', browserSync.reload);
});

// Run sass, local-build, and serve
gulp.task('default', ['serve']);

// Build once with only _config.yml for production
gulp.task('production-build', shell.task(['bundle exec jekyll build']));

// Deploy _site to gh-pages
gulp.task('deploy-gh-pages', ['production-build'], function () {
  return gulp.src('./_site/**/*')
    .pipe(deploy())
});

// Run production-build, and deploy-gh-pages
gulp.task('deploy', ['deploy-gh-pages']);
