const { watch, src, dest, series, parallel } = require('gulp');
const sass = require('gulp-sass');

function cssTask() {
  return src('./_app/scss/styles.scss')
    .pipe(sass({ outputStyle: 'compressed' })) // or 'expanded'
    .on('error', sass.logError)

    // Eleventy `addPassthroughCopy()` looks in the root folder, where it will find this css/ folder
    .pipe(dest('./css'))
}

function watchFiles() {
  watch('./_app/scss/**/*.scss', parallel(cssTask));
};

exports.default = parallel(cssTask, watchFiles);
