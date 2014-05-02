var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream')

gulp.task('default', function() {
	gulp.watch('./src/*.js', ['browserify']);
});

gulp.task('browserify', function() {
	var bundleStream = browserify('./src/main.js').bundle({ debug: true });

	return bundleStream
		.pipe(source('./bundle.js'))
		.pipe(gulp.dest('./build'));
});