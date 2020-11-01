import gulp from "gulp";
import del from "del";
import sass from "gulp-sass";
import minify from "gulp-csso";
import gpug from "gulp-pug";
import autoprefixer from "gulp-autoprefixer";
import ws from "gulp-webserver";

sass.compiler = require("node-sass");

const routes = {
  css: {
    watch: "src/scss/*",
    src: "src/scss/styles.scss",
    dest: "dest/css"
  },
  pug: {
    watch: "src/*.pug",
    src: "src/index.pug",
    dest: "dest"
  }
};


const pug = () => gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const styles = () =>
  gulp
    .src(routes.css.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        flexbox: true,
        grid: "autoplace"
      })
    )
    .pipe(minify())
    .pipe(gulp.dest(routes.css.dest));

const styleWatch = () => {
  gulp.watch(routes.css.watch, styles);
};

const pugWatch = () => {
  gulp.watch(routes.pug.watch, pug);
}

const clean = () => del(["dest"]);

const webserver = () => gulp.src("dest").pipe(ws({ livereload: true, open: true}));

const prepare = gulp.series([clean]);

const assets = gulp.series([styles, pug]);

const postDev = gulp.parallel([webserver, styleWatch, pugWatch]);

export const dev = gulp.series([prepare, assets, postDev]);