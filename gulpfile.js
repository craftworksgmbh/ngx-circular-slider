/* eslint-disable */
var gulp = require('gulp'),
  path = require('path'),
  ngc = require('@angular/compiler-cli/src/main').main,
  rollup = require('gulp-rollup'),
  rename = require('gulp-rename'),
  del = require('del'),
  runSequence = require('run-sequence'),
  inlineResources = require('./tools/gulp/inline-resources'),
  typedoc = require("gulp-typedoc"),
  replace = require('gulp-replace');
const change = require('gulp-change');
const jsonFormat = require('gulp-json-format');

const rootFolder = path.join(__dirname);
const srcFolder = path.join(rootFolder, 'src');
const tmpFolder = path.join(rootFolder, '.tmp');
const buildFolder = path.join(rootFolder, 'build');
const distFolder = path.join(rootFolder, 'dist');
const sources = [`${srcFolder}/app/ngx-circular-slider-src/**/*`, `!${srcFolder}/app/ngx-circular-slider-src/**/*.spec.ts`];
/**
 * library external dependencies
 */
const externalDependencies = {
  typescript: 'ts',
  '@angular/core': '@angular/core',
  '@angular/common': '@angular/common',
  'rxjs/Rx': 'rxjs/Rx'
};

function resolveDependencies(id) {
  return externalDependencies[id];
}

/**
 * 1. Delete /dist folder
 */
gulp.task('clean:dist', function () {
  return deleteFolders([distFolder]);
});

/**
 * 2. Clone the /src/app/ngx-circular-slider-src folder into /.tmp/app/ngx-circular-slider-src excluding test files
 */
gulp.task('copy:source', function () {
  return gulp.src(sources, { base: `${srcFolder}/app/ngx-circular-slider-src` })
    .pipe(gulp.dest(tmpFolder));
});

/**
 * 2.1. Clone the /src/index.ts and /src/tsconfig.es5.json folder into /.tmp
 */
gulp.task('copy:builDefinition', function () {
  return gulp.src([`${srcFolder}/tsconfig.es5.json`])
    .pipe(gulp.dest(tmpFolder));
});

/**
 * 3. Inline template (.html) and style (.css) files into the the component .ts files.
 *    We do this on the /.tmp folder to avoid editing the original /src files
 */
gulp.task('inline-resources', function () {
  return Promise.resolve()
    .then(() => inlineResources(tmpFolder));
});


/**
 * 4. Run the Angular compiler, ngc, on the /.tmp folder. This will output all
 *    compiled modules to the /build folder.
 */
gulp.task('ngc', function () {
  return ngc([], {
    project: `${tmpFolder}/tsconfig.es5.json`
  })
    /*.then((exitCode) => {
      if (exitCode === 1) {
        // This error is caught in the 'compile' task by the runSequence method callback
        // so that when ngc fails to compile, the whole compile process stops running
        throw new Error('ngc compilation failed');
      }
    })*/;
});

/**
 * 5. Run rollup inside the /build folder to generate our Flat ES module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:fesm', function () {
  return gulp.src(`${buildFolder}/**/*.js`)
    // transform the files here.
    .pipe(rollup({
      // Bundle's entry point
      // See https://github.com/rollup/rollup/wiki/JavaScript-API
      input: `${buildFolder}/index.js`,

      // A list of IDs of modules that should remain external to the bundle
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#external
      external: resolveDependencies,

      // Format of generated bundle
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#format
      output: { format: 'es' }
    }))
    .pipe(gulp.dest(distFolder));
});

/**
 * 6. Run rollup inside the /build folder to generate our UMD module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:umd', function () {
  return gulp.src(`${buildFolder}/**/*.js`)
    // transform the files here.
    .pipe(rollup({

      // Bundle's entry point
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#entry
      entry: `${buildFolder}/index.js`,

      // A list of IDs of modules that should remain external to the bundle
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#external
      external: resolveDependencies,

      // Format of generated bundle
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#format
      format: 'umd',

      // Export mode to use
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#exports
      exports: 'named',

      // The name to use for the module for UMD/IIFE bundles
      // (required for bundles with exports)
      // See https://github.com/rollup/rollup/wiki/JavaScript-API#modulename
      moduleName: 'ngx-cs-slider',

      // See https://github.com/rollup/rollup/wiki/JavaScript-API#globals
      globals: externalDependencies

    }))
    .pipe(rename('ngx-cs-slider.umd.js'))
    .pipe(gulp.dest(distFolder));
});

/**
 * 7. Copy all the files from /build to /dist, except .js files. We ignore all .js from /build
 *    because with don't need individual modules anymore, just the Flat ES module generated
 *    on step 5.
 */
gulp.task('copy:build', function () {
  return gulp.src([`${buildFolder}/**/*`, `!${buildFolder}/**/*.js`])
    .pipe(gulp.dest(distFolder));
});

/**
 * 8. Copy manifest.json from /src to /dist/package.json
 * and inject version inject version there (from src package.json) and also adapts it in manifest.json
 */
gulp.task('copy:manifest', function () {
  const p = require(`${rootFolder}/package.json`);
  console.log('package.json', p.version);
  return gulp.src([`${srcFolder}/manifest.json`])
    .pipe(change((content) => {
      const contentJSON = JSON.parse(content);

      contentJSON.version = p.version;
      contentJSON.dependencies = p.dependencies;
      content = JSON.stringify(contentJSON);
      return content;
    }))
    .pipe(jsonFormat(4))
    .pipe(gulp.dest(srcFolder))
    .pipe(rename('package.json'))
    .pipe(gulp.dest(distFolder));
});
/*
 * 9. Copy README.md from / to /dist
 */
gulp.task('copy:readme', function () {
  return gulp.src([path.join(rootFolder, 'README.MD')])
    .pipe(gulp.dest(distFolder));
});

/**
 * 10. Delete /.tmp folder
 */
gulp.task('clean:tmp', function () {
  return deleteFolders([tmpFolder]);
});

/**
 * 11. Delete /build folder
 */
gulp.task('clean:build', function () {
  return deleteFolders([buildFolder]);
});

gulp.task('compile', function () {
  runSequence(
    'clean:dist',
    'copy:source',
    'copy:builDefinition',
    'inline-resources',
    'ngc',
    'rollup:fesm',
    'rollup:umd',
    'copy:build',
    'copy:manifest',
    'copy:readme',
    'clean:build',
    'clean:tmp',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
        deleteFolders([distFolder, tmpFolder, buildFolder]);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

gulp.task("typedoc", function () {
  return gulp
    .src(sources)
    .pipe(typedoc({
      module: "amd",
      out: "docs/",
      readme: "README.md",
      name: "ngx-cs-slider",
      ignoreCompilerErrors: true
    }));
});

gulp.task("format:doc", function () {
  return gulp
    .src("docs/**/*.html")
    .pipe(replace("_@_", "@"))
    .pipe(gulp.dest("docs/"));
});

/**
 * Watch for any change in the /src folder and compile files
 */
gulp.task('watch', function () {
  gulp.watch(`${srcFolder}/**/*`, ['compile']);
});

gulp.task('clean', ['clean:dist', 'clean:tmp', 'clean:build']);

gulp.task('build', ['clean', 'compile']);
gulp.task('build:watch', ['build', 'watch']);
gulp.task('docs', function () {
  runSequence('typedoc', 'format:doc')
});
gulp.task('docs:watch', ['docs', 'watch']);
gulp.task('default', ['build:watch']);

/**
 * Deletes the specified folder
 */
function deleteFolders(folders) {
  return del(folders);
}
