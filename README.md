# Eleventy, Gulp and Sass

**Version 1.0**

> A simple setup for for adding Gulp and Gulp-Sass to Eleventy.

Eleventy ([https://www.11ty.dev/](https://www.11ty.dev/)) is my favourite static site generator. But (as of v0.9.0) it doesn’t preprocess CSS.

One of the first things I do with every Eleventy project is add [Sass](https://sass-lang.com/), my CSS preprocessor of choice, using [Gulp](https://gulpjs.com/) and [gulp-sass](https://www.npmjs.com/package/gulp-sass).

(You may want to use Gulp for running other tasks besides gulp-sass. E.g. you may want to preprocess mand/or concatenate JS, and optimise some images. So I have set up up the `gulpfile.js` to look for SCSS files in a `scss/` folder within an `_app` folder – and later you can add other things into the `_app/` folder too.)

**This below is what I already did in this preparing project repository. But I have not included the dependencies `Eleventy`, `Gulp` and `gulp-sass` here.**

**You can just download or clone this repo – and then work though the tutorial instructons below for adding `Eleventy`, `Gulp` and `gulp-sass`.**

---

## Requirements

1. Both Eleventy and Gulp require [NodeJS](https://nodejs.org/en/). So, if you don’t have Node (and the Node Package Manager, NPM, that comes bundled with it), you must first [download it](https://nodejs.org/en/download/) and install it.

2. Once you have Node and NPM, you also need to install the Gulp Command Line Interface ([Gulp-CLI](https://gulpjs.com/docs/en/getting-started/quick-start)) globally, before you can use Gulp in your project. So do this in your command line:

    ```JS
    $ npm install --global gulp-cli
    ```

Now you’re ready to start an Eleventy project – and ready to Gulp to it.

## Start an Eleventy Project

1. Create a new folder with a suitable name for your new project. Then change directory into this folder, in your command line:

    ```JS
    $ cd path/to/my-project
    ```

2. Give your project a `package.json` file. The quickest way to do this is:

    ```JS
    $ npm init -y
    ```

3. Now you can install Eleventy locally in your project:

    ```JS
    $ npm install --save-dev @11ty/eleventy
    ```

Further info can be found at [https://www.11ty.dev/docs/getting-started/](https://www.11ty.dev/docs/getting-started/)

After Eleventy has been installed (it takes a few sec.), you are ready to add `gulp` and `gulp-sass`.

## Adding Gulp and Gulp-Sass

1. Still in project root folder in your command line, add `gulp` and `gulp-sass` locally using NPM:

    ```JS
    $ npm install --save-dev gulp

    $ npm install --save-dev gulp-sass
    ```

    You will see that these have been added to your project’s `package.json`. And their dependencies will have been added into your project’s `node_modules/`.

2. Now create a file named `gulpfile.js` in your project root folder, and copy-paste all this into it:

    ```JS
    const { watch, src, dest, series, parallel } = require('gulp');
    const sass = require('gulp-sass');

    function cssTask() {
      return src('./_app/scss/styles.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .on('error', sass.logError)
        .pipe(dest('./css'))
    }

    function watchFiles() {
      watch('./_app/scss/**/*.scss', parallel(cssTask));
    };

    exports.default = parallel(cssTask, watchFiles);
    ```

3. Create an `_app` folder in your project root folder, and place a `scss` folder inside it. And in the `scss/` folder, create a file named `styles.scss`. (This assumes that your gulpfile’s `cssTask()`, as in the example above, is looking for `src('./_app/scss/styles.scss')`.)

4. Eleventy doesn’t do anything with CSS files by default, so you will need to Eleventy it to pass through the resultant `css/styles.css` (folder and file) into the outputted  `_site/` folder. To do this, create another file in your project root folder, named `.eleventy.js` (note the dot prefix), and then copy-paste this into it:

    ```JS
    module.exports = function(eleventyConfig) {

      // Passthrough copy
      eleventyConfig.addPassthroughCopy("css");
    }
    ```

    For more information, see [https://www.11ty.dev/docs/copy/](https://www.11ty.dev/docs/copy/).

5. I usually place a test style rule in the new SCSS file, to make it obvious that everything is working OK. I usually do this:

    ```SCSS
    body {
      background: yellow;
    }
    ```

    So, if I see a yellow background in my first HTML page in the web browser, I know that Gulp is preprocessing my SCSS and Eleventy is passing through the resultant CSS to the `_site` folder.

## Your First Gulp Run

If you run Eleventy first, or run Gulp and Eleventy simultaneously the first time, Eleventy will now throw an error – because it is looking to pass through  your CSS files but you don’t have any until Gulp has generated them. So, just run gulp by itself, first:

    ```JS
    $ gulp
    ```

When you see that it has created `css/styles.css` in your project root folder, you can stop Gulp by `control+C` (`^C`).

## Running Gulp and Eleventy Together

From now on, you can run Gulp and Eleventy _in tandem_ by doing this:

    ```JS
    $ gulp & eleventy --serve
    ```

Eleventy handles the file watching from the root folder and it sets up a local server, so that you can see the changes in your project’s `_sites/` folder in your browser.

Gulp handles the SCSS file watching `_app/scss/**/*.scss` (i.e. any SCSS file in `_app/scss/` or other folder(s) inside `_app/scss/`). You just use `@include` in your master `_app/scss/styles.scss` to bring in any partial SCSS files you may have in your project.

Gulp will then output one file in your project root folder – `css/styles.css` – and Eleventy will pass that folder and file through to the `_site/` folder. And you will see then changes auto-refreshed in your browser.

## One More Thing...

Of course, you will want some HTML.

The static site generator [Eleventy can handle multiple template languages](https://www.11ty.dev/docs/), so it’s really up to you.

I prefer [Nunjucks](https://mozilla.github.io/nunjucks/) these days, so in this statrter project I have included `index.njk`, with a head link to `./css/styles.css`, ready to go.
