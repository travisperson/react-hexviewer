var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var jshint = require("gulp-jshint");
var react = require("gulp-react");

gulp.task('default', ['jshint', 'build', 'example'], function () {
	gulp.watch(['lib/**/*.js'], ['jshint', 'build', 'example'])
})

gulp.task('example', function() {
	return browserify({
		entries: ['./examples/main.js'],
		debug: true
	})
	.bundle()
	.pipe(source('bundle.js'))
	.pipe(gulp.dest('examples'))
})

gulp.task('build', function() {
	return browserify({
		entries: ['./index.js'],
		debug: true
	})
	.bundle()
	.pipe(source('hexviewer.js'))
	.pipe(gulp.dest('src')) // TODO: change this to a build or dist directory
})

gulp.task('jshint', function() {
	return gulp.src('lib/**/*.js')
	.pipe(react()).pipe(jshint())
	.pipe(jshint.reporter('default'))
})
