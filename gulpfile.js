const project_folder = "dist";
const source_folder = "src";

const path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: source_folder + "/*.html",
    css: source_folder + "/**/*.scss",
    js: source_folder + "/js/scripts.js",
    img: source_folder + "/image/**/*.{jpg,png,svg,gif,iso,wcbp}",
    fonts: source_folder + "/fonts/**/*.*",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/**/*.scss",
    js: source_folder + "/**/*.js",
    img: source_folder + "/image/**/*.{jpg,png,svg,gif,iso,webp}",
  },
  clean: "./" + project_folder + "/",
};

const { src, dest } = require("gulp"),
  gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  autoprefixer = require("gulp-autoprefixer"),
  group_media = require("gulp-group-css-media-queries"),
  clean_css = require("gulp-clean-css"),
  concat = require("gulp-concat"),
  scss = require("gulp-sass")(require("sass")),
  fileinclude = require("gulp-file-include"),
  del = require("del"),
  plumber = require("gulp-plumber"),
  rename = require("gulp-rename"),
  sourcemaps = require("gulp-sourcemaps"),
  imagemin = require("gulp-imagemin"),
  uglify = require("gulp-uglify-es").default,
  babel = require("gulp-babel");

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream());
}

function css() {
  return (
    src([
      source_folder + "/scss/vars.scss",
      path.src.css,
      "!" + source_folder + "/scss/media.scss",
      source_folder + "/scss/media.scss",
    ])
      .pipe(sourcemaps.init()) // Удалить на продакшн!!!
      .pipe(concat("styles.scss"))
      .pipe(
        scss({
          outputStyle: "expanded",
        })
      )
      //.pipe(group_media())
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 5 version"],
          cascade: true,
        })
      )
      .pipe(dest(path.build.css))
      .pipe(clean_css())
      .pipe(
        rename({
          extname: ".min.css",
          //basename: "styles"
        })
      )
      .pipe(sourcemaps.write(".")) // Удалить на продакшн!!!
      .pipe(dest(path.build.css))
      .pipe(browserSync.stream())
  );
}

function js() {
  return src([
    "node_modules/scroll-to-element/build/scrollToElement.js",
    path.src.js,
  ])
    .pipe(plumber())
    .pipe(sourcemaps.init()) // Удалить на продакшн!!!
    .pipe(concat("scripts.js"))
    .pipe(dest(path.build.js))
    //.pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(sourcemaps.write(".")) // Удалить на продакшн!!!
    .pipe(dest(path.build.js))
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )

    .pipe(browserSync.stream());
}

function images() {
  return src(path.src.img)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: true }],
        interlaced: true,
        optimizationLevel: 3, // 0 to 7
      })
    )

    .pipe(dest(path.build.img))
    .pipe(browserSync.stream());
}

function fonts() {
  return src(path.src.fonts).pipe(dest(path.build.fonts));
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

function clean() {
  return del(path.clean);
}

const build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
const watch = gulp.parallel(build, watchFiles, serve);

function serve() {
  browserSync.init({
    server: {
      baseDir: "./" + project_folder + "/",
    },

    port: 3000,
    notify: false,
  });
}

exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
