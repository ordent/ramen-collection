let gulp = require('gulp'),
	readdir = require('recursive-readdir'),
	sass = require('gulp-sass'),
	fs = require('fs'),
	template = require('gulp-template'),
	browserSync = require('browser-sync').create(),
	babel = require('gulp-babel'),
	exec = require('child_process').exec,
	uglify = require('gulp-uglify'),
	jsonminify = require('gulp-jsonminify'),
	replace = require('gulp-replace'),
	htmlmin = require('gulp-htmlmin');

let pathToFolder = 'templates';	
let generateData = (fs, scss, js, json) => {
	let process = { css: '', form: '', js: '', json: ''};

	process = generateCSS(process, scss, fs);
	process = generateJS(process, js, fs);
	process = generateJSON(process, json, fs);

	return process;
}
let generateCSS = (process, scss, fs) => {
	if (fs.existsSync(scss)) {
		return Object.assign(process, {
			css: sass.compiler.renderSync({
				file: scss,
				outputStyle: 'compressed'
			}).css,
		});
	}
	return process;
};
let generateJS = (process, js, fs) => {
	if (fs.existsSync(js)) {
		return Object.assign(process, {
			js: fs.readFileSync(js, 'utf8'),
		});
	}
	return process;
};
let generateJSON = (process, json, fs) => {
	if (fs.existsSync(json)) {
		return Object.assign(process, {
			json: JSON.parse(fs.readFileSync(json, "utf8"))
		});
	}
	return process;
};
let generateHTML = (process, html, fs) => {
	if (fs.existsSync(html)) {
		return Object.assign(process, {
			html: fs.readFileSync(html, "utf8")
		});
	}
	return process;
};
gulp.task('templates', function () {
	readdir(pathToFolder, ['*.scss', '*.js', '*.json'], function (err, files) {
		if(files){
			files.forEach(function (file) {
				// get file html
				let data = file.substr(pathToFolder.length + 1).replace(String.fromCharCode(92), String.fromCharCode(47));
				// get file based on its name
				let index = data.lastIndexOf('/'),
					path = data.substr(0, index),
					scss = file.substr(0, file.lastIndexOf('.')) + '.scss',
					js = file.substr(0, file.lastIndexOf('.')) + '.js',
					json = file.substr(0, file.lastIndexOf('.')) + '.json';
				
				let value = generateData(fs, scss, js, json);
	
				return gulp.src(file)
					.pipe(template(value))
					.pipe(gulp.dest('src/' + path));
			});
		}else{
			console.error('no files in templates folder');
		}
	});
});

gulp.task('reloading', function (done) {
	browserSync.reload();
	done();
});

gulp.task('scripts', function () {
	return gulp.src('./library/*.js')
		.pipe(babel({
			presets: ['env'],
		}))
		.pipe(uglify())
		.pipe(gulp.dest('src/library'));
});

gulp.task('json', function () {
	return gulp.src('./content/*.json')
		.pipe(jsonminify())
		.pipe(gulp.dest('src/content'));
});

gulp.task('dist', function(){
	return gulp.src('./src/*.html')
		.pipe(replace('../bower_components/', '../'))
		.pipe(gulp.dest('./'));
});

gulp.task('index', function () {
	return gulp.src('./index/index.html')
		.pipe(htmlmin({
			collapseWhitespace: true,
			minifyCSS: true,
			minifyJS: true,
			ignoreCustomComments: [/^#/],
			preserveLineBreaks: false,
			removeComments: true
		}))
		.pipe(gulp.dest('./'));
});
gulp.task('default', ['templates', 'scripts', 'json', 'dist'], function () {
	// exec('killall node');
	exec('polymer serve --port 9081');
	exec('browser-sync start --port 9000 --proxy 127.0.0.1:9081 --files \'src/**/*.html, src/**/*.js, images/*\' --online false --open false');
	gulp.watch('templates/*', ['templates']);
	gulp.watch('templates/**/*', ['templates']);
	gulp.watch('library/*', ['scripts']);
	gulp.watch('content/*', ['json']);
	gulp.watch('src/*', ['dist']);
	gulp.watch('./index/index.html', ['index']);
});


gulp.task('express', ['templates', 'scripts', 'index', 'dist'], function () {
	// exec('killall node');
	exec('polymer serve --port 9081');
	exec('browser-sync start --port 9000 --proxy 127.0.0.1:9081 --files \'src/**/*.html, src/**/*.js, images/*\' --online false --open false');
	gulp.watch('templates/*', ['templates']);
	gulp.watch('templates/**/*', ['templates']);
	gulp.watch('library/*', ['scripts']);
	gulp.watch('content/*', ['json']);
	gulp.watch('src/*', ['dist']);
	gulp.watch('./index/index.html', ['index']);
});