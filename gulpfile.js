"use strict";

var gulp = require("gulp"),
	browserify = require("browserify"),
	babelify = require("babelify"),
	watchify = require("watchify"),
	eslint = require("gulp-eslint"),
	mocha = require("gulp-mocha"),
	istanbul = require("gulp-istanbul"),
	coveralls = require("gulp-coveralls"),
	isparta = require("isparta"),
	glob = require("glob"),
	plato = require("plato"),
	watch = require("gulp-watch"),
	source = require("vinyl-source-stream");

var argv = require("yargs").boolean(["travis"]).argv;

gulp.task("build", ["test-coveralls", "lint"], function () {
	bundle(false);
});

gulp.task("default", function () {
	bundle(false);
});

gulp.task("watch", function () {
	bundle(true);
	gulp.start("test-lint-watch");
});

function bundle(watching) {
	var src = "./src/index.js",
		dest = "./dist/equations.js";

	var b = browserify(src, {
		debug: true,
		cache: {}
	}).transform(babelify);

	if (watching) {
		b = watchify(b);
		b.on("update", rebundle);
	}

	return rebundle();

	function rebundle() {
		return b.bundle()
			.on("error", errorHandler)
			.pipe(source(dest))
			.pipe(gulp.dest("."));
	}
}

gulp.task("test", function (next) {
	var coverageVariable = "$$cov_" + new Date().getTime() + "$$";

	gulp.src("src/**/*.js")
		.pipe(istanbul({
			instrumenter: isparta.Instrumenter,
			coverageVariable: coverageVariable
		}))
		.on("error", errorHandler)
		.pipe(istanbul.hookRequire())
		.on("finish", function () {
			gulp.src([
					"tests/**/*.js"
				])
				.pipe(mocha())
				.on("error", errorHandler)
				.pipe(istanbul.writeReports({
					dir: "coverage",
					reporters: ["text", "html", "lcovonly"],
					coverageVariable: coverageVariable
				}))
				.on("end", next);
		});
});

gulp.task("test-coveralls", ["test"], function () {
	gulp.src("coverage/lcov.info")
		.pipe(coveralls());
});

gulp.task("test-watch", function () {
	watch([
		"src/**/*.js",
		"tests/**/*.js"
	], function () {
		gulp.start("test");
	});
	gulp.start("test");
});

gulp.task("lint", function () {
	return gulp.src("src/**/*.js")
		.pipe(eslint({
			useEslintrc: true
		}))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
		.on("error", errorHandler);
});

gulp.task("lint-watch", function () {
	watch([
		"src/**/*.js"
	], function () {
		gulp.start("lint");
	});
	gulp.start("lint");
});

gulp.task("test-lint-watch", function () {
	watch([
		"src/**/*.js",
		"tests/**/*.js"
	], run);
	run();

	function run() {
		gulp.start("test", function () {
			gulp.start("lint", function () {
				//
			});
		});
	}
});

gulp.task("complexity", function (next) {
	var files = glob.sync("src/**/*.js"),
		output = "./complexity",
		options = {
			title: "equations.js"
		};

	plato.inspect(files, output, options, next);
});


function errorHandler(e) {
	/* eslint-disable no-console */
	console.error(e.message);
	console.error(e.stack);
	/* eslint-enable no-console */

	if(!argv.travis) {
		if(this.emit) {
			this.emit("end");
		}
		gulp.stop();
	}
}
