# Eleventy, Gulp and Sass

**Version 1.2**

> A simple setup for for adding Gulp and Gulp-Sass to Eleventy.

Eleventy ([https://www.11ty.dev/](https://www.11ty.dev/)) is one of my favourite static site generators — my go-to for simple projects. But I am a fan of SCSS, and (as of v0.11.0) Eleventy doesn’t preprocess CSS.

One of the first things I do with every Eleventy project is add [Sass](https://sass-lang.com/), my CSS preprocessor of choice, using [Gulp](https://gulpjs.com/) and [gulp-sass](https://www.npmjs.com/package/gulp-sass). I also add some other useful modules such as an autoprefixer and a sourcemap generator.

(You may want to use Gulp for running other tasks besides gulp-sass. E.g. you may want to preprocess and/or concatenate JS, and optimise some images. So I have set up up the `gulpfile.js` to look for SCSS files in a `scss/` folder within an `_app` folder – and later you can add other things into the `_app/` folder too.)

**This below is what I did in preparing this project repository. (Node modules for Eleventy and Gulp are not included here — you will need to install these locally, in your project.)**

## Three ways to use this repository

* If you want to staty from scratch, you can just download or clone this repo – and then work though these tutorial instructons below for installing everything you need, to get going.

* Alternatively, you can learn how to do this yourself, by following this [README.md](https://github.com/SimonPadbury/eleventy-gulp-and-sass/blob/master/README.md) file’s tutorial.

* Alternatively, to retro-fit Gulp, `gulp-sass` etc. to your already existing Eleventy project, you can follow along from [Adding Gulp and Gulp-Sass](#adding-gulp-and-gulp-sass).

## Requirements

Both Eleventy and Gulp require [NodeJS](https://nodejs.org/en/). So, if you don’t already have Node (and the Node Package Manager, NPM, that comes bundled with it), you must first [download it](https://nodejs.org/en/download/) and install it.

## Install Gulp CLI gLobally

Once you have Node and NPM, you also need to install the Gulp Command Line Interface ([Gulp-CLI](https://gulpjs.com/docs/en/getting-started/quick-start)) globally, before you can use Gulp in your project. So do this in your command line:

    ```JS
    $ npm install --global gulp-cli
    ```

Now you’re ready to start an Eleventy project — and ready to Gulp to it.

## Start an Eleventy project

1. Create a new folder with a suitable name for your new project. Then _change directory_ into this folder, in your command line:

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

After Eleventy has been installed (it takes a few sec.), you are ready to add `gulp`, `gulp-sass`, etc.

## Adding Gulp and Gulp-Sass

1. Still in project root folder in your command line, add `gulp` and all these pakages using NPM — add them _locally_  using the `--save-dev` flag:

    ```JS
    $ npm install --save-dev gulp

    $ npm install --save-dev cssnano

    $ npm install --save-dev autoprefixer

    $ npm install --save-dev gulp-sass

    $ npm install --save-dev gulp-postcss

    $ npm install --save-dev gulp-sourcemaps
    ```

    You will see that these have been added to your project’s `package.json`. (And their dependencies will have been added into your project’s `node_modules/` — where your local Eleventy installation already is.)

2. Now create a file named `gulpfile.js` in your project root folder, and copy-paste all this into it:

    ```JS
    const { watch, src, dest, parallel } = require('gulp');
    const sass = require('gulp-sass');
    const autoprefixer = require('autoprefixer');
    const cssnano = require('cssnano');
    const postcss = require('gulp-postcss');
    const sourcemaps = require('gulp-sourcemaps');

    function cssTask() {
    return src('./_assets/scss/style.scss', { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed'})).on('error', sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./css'))
    }

    function watchFiles() {
    watch('./**/*.scss', parallel(cssTask));
    };

    exports.default = parallel(cssTask, watchFiles);
    ```
    
    * So here’s what the `cssTask()` will do: it will look in your specified `src()` folder for your `styles.scss`; initiate a sourcemap by tracing through your SCSS and its partial files; preprocess the SCSS using the Sass preprocessor; the `postcss()` module will add some browser-specific CSS prefixes and then minify the output; finally the sourcemap will be compiled and written based on the outputted CSS; and both the `styles.css` and `styles.css.map` will be outputted to your specified `dest()` folder.

3. (If you haven’t cloned this repo) Create an `_assets` folder in your project root folder, and create a `scss/` folder inside it. And in this `scss/` folder, create a file named `style.scss`. (This assumes that your gulpfile’s `cssTask()`, as in the example above, is looking for `src('./_assets/scss/style.scss')`.)

    * As configured above, Gulp will preprocess (and and autoprefix, and sourcemap) your `style.scss` to become `css/style.css` in your project root folder — so that Eleventy can pick it up from there (when you have configured Eleventy, in step 4 below).

4. **Eleventy doesn’t do anything with CSS files by default**, so now you need to tell Eleventy to pass through the resulting `css/style.css` (folder and file) into Eleventy’s outputted  `_site/` folder. To do this, create another file in your project root folder, named `.eleventy.js` (note the dot prefix), and then copy-paste this into it:

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

    So, if I see a yellow background in my first HTML page in the web browser, I know that Gulp is preprocessing my SCSS and Eleventy is passing through the resultant CSS to the `_site` folder. Win-win!

## Your first Gulp run

If you run Eleventy first, or run Gulp and Eleventy simultaneously the first time, _Eleventy will now throw an error_ – because it is looking to pass through  your CSS files but you don’t have any until Gulp has generated them. So, just run gulp by itself, first:

```JS
$ gulp
```

(Alternatively, do `$ npx gulp` to run your local Gulp installation, e.g. if you don’t have Gulp installed globally.)

When you see that Gulp has created `css/styles.css` in your project root folder, you can stop Gulp by `control+C` (`^C`).

## Running Gulp and Eleventy together

From now on, you can run Gulp and Eleventy _in tandem_ by doing this:

```JS
$ gulp & @11ty/eleventy --serve
```

(The above assumes you want to run your local Eleventy installation, e.g. if you don’t have Eleventy installed globally — see [https://www.11ty.dev/docs/usage/](https://www.11ty.dev/docs/usage/).)

Here’s what’s happening in your project, if both Gulp and Eleventy are running:

Gulp will then output one file in your project root folder – `css/style.css` – and Eleventy will copy that same `css/style.css` (i.e. pass it through) to the `_site/` folder.

And you will see the changes auto-refreshed in your browser.

## Making development easier to start

You probably don’t want to remember and do `gulp & @11ty/eleventy --serve` every time you start this project, so I have included a `"dev"` script in the `package.json`. So now all you need do start both Gulp and Eleventy _in tandem_ in the terminal is:

```JS
$ npm run dev
```

## One more thing...

Of course, you will want some HTML!

The static site generator [Eleventy can handle multiple template languages](https://www.11ty.dev/docs/), so it’s really up to you.

I prefer [Nunjucks](https://mozilla.github.io/nunjucks/) these days, so in this starter project I have included `index.njk`, with a head link to `./css/styles.css`, ready to go.
