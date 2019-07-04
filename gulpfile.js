//Подключаем модули галпа
const gulp = require("gulp");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const del = require("del");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const jquery = require("gulp-jquery");
const cssFiles = [
  "./src/css/test.css",
  "./src/css/main.css",
  "./src/css/media.css"
];
const jsFiles = ["./src/js/media.js", "./src/js/main.js"];
const sassFiles = ["./src/sass/test.sass"];

function pugCompile() {
  return gulp
    .src("src/pug/*.pug")
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(gulp.dest("./"))
    .pipe(browserSync.stream());
}

function sassCompile() {
  return gulp
    .src(sassFiles)

    .pipe(sass().on("error", sass.logError))

    .pipe(gulp.dest("./src/css"))
    .pipe(browserSync.stream());
}
function styles() {
  return (
    gulp
      .src(cssFiles)
      .pipe(concat("style.css"))
      .pipe(
        autoprefixer({
          browsers: ["last 2 versions"],
          cascade: false
        })
      )
      .pipe(
        cleanCSS({
          level: 2
        })
      )
      //Выходная папка для стилей
      .pipe(gulp.dest("./build/css"))
      .pipe(browserSync.stream())
  );
}

function scripts() {
  return (
    gulp
      .src(jsFiles)

      .pipe(concat("script.js"))

      .pipe(
        uglify({
          toplevel: true
        })
      )
      //Выходная папка для скриптов
      .pipe(gulp.dest("./build/js"))
      .pipe(browserSync.stream())
  );
}

//Удалить всё в указанной папке
function clean() {
  return del(["build/*"]);
}

//Просматривать файлы
function watch() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch("./src/pug/**/*.pug", gulp.series("pug"));

  gulp.watch("./src/sass/**/*.sass", gulp.series("sass-compile"));

  gulp.watch("./src/css/**/*.css", styles);

  gulp.watch("./src/js/**/*.js", scripts);

  gulp.watch("./*.html").on("change", browserSync.reload);
}

gulp.task("pug", pugCompile);

gulp.task("sass-compile", sassCompile);

gulp.task("styles", gulp.series(styles, sassCompile));

gulp.task("scripts", scripts);

gulp.task("del", clean);

gulp.task("watch", watch);

gulp.task(
  "build",
  gulp.series(clean, gulp.parallel(styles, scripts, pugCompile))
);

gulp.task("dev", gulp.series("build", "watch"));
