const { watch, src, dest, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

function cssTask() {
  return src('./_scss/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' })).on('error', sass.logError)
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./css'))
}

function watchFiles() {
  watch('./_scss/**/*.scss', parallel(cssTask));
};

exports.default = parallel(cssTask, watchFiles);
