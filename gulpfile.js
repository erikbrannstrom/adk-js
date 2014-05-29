var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task('default', function() {
	gulp.watch(['./src/*.js', './src/**/*.jsx'], ['browserify']);
});

gulp.task('browserify', function() {
	var bundler = browserify({ extensions: '.jsx' }).add('./src/main.js');
	bundler.transform(reactify);
	var stream = bundler.bundle({ debug: true });

	return stream
		.pipe(source('./bundle.js'))
		.pipe(gulp.dest('./build'));
});