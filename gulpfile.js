const
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  htmlMin = require('gulp-htmlmin'),
  cssMin = require('gulp-csso'),
  jsMin = require('gulp-terser'),
  imgMin = require('gulp-imagemin'),
  autoPrefix = require('gulp-autoprefixer'),
  rename = require('gulp-rename'),
  brwSync = require('browser-sync'),
  delFiles = require('del'),
  toEs5 = require('gulp-babel');

gulp.task('htmlMin', () => {
  return gulp.src('develop/html/*.html')
    .pipe(htmlMin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('release'));
});

gulp.task('sass', () => {
  return gulp.src('develop/styles/*.sass')
    .pipe(sass())
    .pipe(autoPrefix())
    .pipe(cssMin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('release/styles'));
});

gulp.task('jsMin', () => {
  return gulp.src(['develop/scripts/*.js', '!develop/scripts/*.min.js'])
    .pipe(jsMin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('release/scripts'));
});

gulp.task('imgMin', () => {
  return gulp.src('develop/img/*.+(jpg|png|gif|svg)')
    .pipe(imgMin([
      imgMin.gifsicle({interlaced: true}),
      imgMin.jpegtran({progressive: true}),
      imgMin.optipng({optimizationLevel: 5}),
      imgMin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest('release/img'));
});

gulp.task('move:css', () => {
  return gulp.src('develop/styles/*.css')
    .pipe(cssMin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('release/styles'));
});

gulp.task('move:js', () => {
  return gulp.src('develop/scripts/*.min.js')
    .pipe(gulp.dest('release/scripts'));
});

gulp.task('move:json', () => {
  return gulp.src('develop/json/*.json')
    .pipe(gulp.dest('release/json'));
});

gulp.task('clear', () => {
  return delFiles(['release/**', '!release']);
});

gulp.task('html:watch', () => {
  return gulp.watch('develop/html/*.html', gulp.series('htmlMin', done => {
    brwSync.reload();
    done();
  }))
});

gulp.task('sass:watch', () => {
  return gulp.watch('develop/styles/*.sass', gulp.series('sass', done => {
    brwSync.reload();
    done();
  }))
});

gulp.task('js:watch', () => {
  return gulp.watch('develop/scripts/*.js', gulp.series('jsMin', done => {
    brwSync.reload();
    done();
  }))
});

gulp.task('brwSync', () => {
  return brwSync({
    server: {
      baseDir: 'release'
    },
    browser: 'chrome'
  });
});

gulp.task('default',
  gulp.series('clear',
  gulp.parallel('htmlMin', 'sass', 'jsMin', 'imgMin', 'move:css', 'move:js', 'move:json'),
  gulp.parallel('html:watch', 'sass:watch', 'js:watch', 'brwSync')));




