// Include paths file.
var paths = require('./gulp_config/paths');

var css_files_to_gulp = paths.gulpedCssNames;
var js_files_to_gulp = paths.gulpedJsNames;

var sass_root_name = "**/*.scss";  //.min will be appended to output file name by default i.e gulp_default.min.css
var sass_destination_folder = "_scss";

var css_gulped_name = "gulp_default.css";  //.min will be appended to output file name by default i.e gulp_default.min.css
var css_destination_folder = "css";

var js_gulped_name = 'gulp_script.js'; //.min.uglify will be appended to output file name by default i.e gulp_script.min.uglify.js
var js_destination_folder = "js";

var gulp         = require('gulp');
var concat       = require('gulp-concat');
var sass         = require('gulp-sass');
var minifyCss    = require('gulp-clean-css');
var rename       = require('gulp-rename');
var uglify       = require('gulp-uglify');
var del          = require('delete');
var rimraf       = require('gulp-rimraf');
var run          = require('gulp-run');
var runSequence  = require('run-sequence');
var sourcemaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync').create();

//plugin dependencies
var git      = require('gulp-git');
var sequence = require('gulp-sequence');
var replace  = require('gulp-string-replace');
var merge    = require('merge-stream');
var footer   = require('gulp-footer');
var glob     = require('glob');

//computed variables
var site_dir = '_site';
var sass_gulp_path = sass_destination_folder + '/' + sass_root_name;
var css_gulp_path = css_destination_folder + '/' + css_gulped_name;
var js_gulp_path = js_destination_folder + '/' + js_gulped_name;
var js_min_gulp_path = js_destination_folder + '/' + js_gulped_name.replace('.js', '.min.js');

gulp.task('gulp_sass_files', function () {
    return gulp.src(sass_gulp_path)
        .pipe(sourcemaps.init())
        .pipe(sass({
            style: 'compressed',
            trace: true,
            loadPath: [sass_destination_folder]
        }))        
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(site_dir + '/css'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream());
});

gulp.task('gulp_css_files', ['gulp_sass_files'], function () {
    // add all the CSS file names that you want to include in gulp,
    return gulp.src(css_files_to_gulp)
        .pipe(concat(css_gulped_name))
        .pipe(gulp.dest(css_destination_folder));
});

gulp.task('gulp_minify_css', ['gulp_css_files'], function () {
    return gulp.src(css_gulp_path)
        .pipe(minifyCss({compatibility: 'ie9'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(css_destination_folder));
});

gulp.task('gulp_delete_css', function () {
    del.sync(css_gulp_path);
    del.sync(site_dir + '/'+css_gulp_path);
});

gulp.task('gulp_js_files', function () {
    // add all the JS file names that you want to include in gulp,
    return gulp.src(js_files_to_gulp)
        .pipe(gulp.dest(site_dir + '/' + js_destination_folder))
        .pipe(concat(js_gulped_name))
        .pipe(gulp.dest(js_destination_folder))
        .pipe(gulp.dest(site_dir + '/' + js_destination_folder));
});

gulp.task('gulp_minify_js', ['gulp_js_files'], function () {
    return gulp.src(js_gulp_path)
        .pipe(uglify({
            compress: {hoist_funs: false, hoist_vars: false, hoist_props: false}
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(js_destination_folder))
        .pipe(gulp.dest(site_dir + '/' + js_destination_folder));
});

gulp.task('gulp_delete_js', function () {
    del.sync(js_gulp_path);
    del.sync(site_dir + '/' + js_gulp_path);
});

gulp.task('gulp_js_watch', ['gulp_minify_js'], function(callback) {
    browserSync.reload();
    callback();
});

gulp.task('gulp_dump_jekyll', function() {
    del.sync(site_dir + '/gulpfile.js');
    return gulp.src(site_dir + '/_site_gulpfile.js')
        .pipe(rimraf())
        .pipe(rename('gulpfile.js'))
        .pipe(gulp.dest(site_dir));
});

gulp.task('gulp_build_jekyll', function() {
    var shellCommand = 'jekyll build';

    return gulp.src('')
        .pipe(run(shellCommand));
});

gulp.task('gulp_delete_jekyll', function(callback) {
    del(site_dir);
    callback();
});

gulp.task('delete_jekyll', ['gulp_delete_jekyll',
    'gulp_delete_js',
    'gulp_delete_css'
]);

gulp.task('delete', [ 'gulp_delete_js',
    'gulp_delete_css'
]);

gulp.task('build_jekyll', function(callback) {
    runSequence('delete_jekyll',
        ['gulp_minify_js', 'gulp_minify_css'],
        'gulp_build_jekyll', 'gulp_dump_jekyll',        
        callback);
});

gulp.task('gulp_build_jekyll_watch', ['gulp_delete_jekyll', 'gulp_build_jekyll'], function(callback) {
    browserSync.reload();
    callback();
});

//run on Jekyll project
gulp.task('default', ['build_jekyll'], function() {
    browserSync.init({
        server: site_dir + '/',
        ghostMode: false, // Toggle to mirror clicks, reloads etc. (performance)
        logFileChanges: true,
        logLevel: 'debug',
        open: true        // Toggle to automatically open page when starting.
    });

    // Watch site settings.
    gulp.watch(['_config.yml'], { interval: 500 }, ['gulp_build_jekyll_watch']);

    // Watch .scss files; changes are piped to browserSync.
    gulp.watch('_scss/**/*.scss', { interval: 500 }, ['gulp_minify_css']);

    // Watch .js files.
    gulp.watch(['js/**/*.js', '!js/gulp_script.js', '!js/gulp_script.min.js'], { interval: 500 }, ['gulp_js_watch']);

    // Watch posts.
    gulp.watch('_posts/**/*.+(md|markdown|MD)', { interval: 500 }, ['gulp_build_jekyll_watch']);

    // Watch html and markdown files.
    gulp.watch(['**/*.+(html|md|markdown|MD|yml)', '!_site/**/*.*'], { interval: 500 }, ['gulp_build_jekyll_watch']);
});

//download and install plugins
var repo = "Frontend-Plugins";
var plugin;

//clone plugin repo
gulp.task('clone_plugin_repo', function(done){
    plugin = process.argv[4];
    git.clone('https://github.com/Arekibo/Frontend-Plugins.git', function (err) {
        if (err) {
            done(err);
        }
        done();
    });
});

gulp.task('copy_plugin', ['clone_plugin_repo'], function (done) {
    var folders = ['_data', '_includes', 'css/imgs', 'images', 'js', '_scss', 'gulp_config'];
    var tasks = [];

    for (var i in folders) {
        var folder = folders[i];
        tasks.push(
            gulp.src(repo + '/' + plugin + '/' + folder + '/**/*')
                .pipe(gulp.dest('./' + folder + '/'))
        );
    }
    return merge(tasks);
});  

gulp.task('delete_plugin_repo', function(){
    del(repo);
});

gulp.task('write_paths_js', function(){
    return gulp.src('gulp_config/plugins.js')
        .pipe(replace("// '" + plugin + "'", "'" + plugin + "'"))
        .pipe(gulp.dest('./gulp_config/'));
});

gulp.task('write_paths_yaml', function(){
    return gulp.src('_data/plugins.yml')
        .pipe(replace('#- name: "' + plugin + '"','- name: "' + plugin + '"'))
        .pipe(gulp.dest('./_data/'));
});

gulp.task('write_paths_sass', function(){
    var files = glob.sync('_scss/' + plugin + '/**/*');
    var paths = '';
    for (var i in files) {
        var file = files[i],
            before = file.lastIndexOf('/'),
            beforeRemoved = file.substring(before + 2),
            afterRemoved = beforeRemoved.split('.')[0],
            finalPath = '\n@import "' + plugin + '/' + afterRemoved + '";';
        paths += finalPath;
    }
    return gulp.src('_scss/_plugins.scss')
        .pipe(footer(paths))
        .pipe(gulp.dest('./_scss/'));
});

gulp.task('write_plugin', ['write_paths_js', 'write_paths_yaml', 'write_paths_sass']);

gulp.task('download_plugin', function(done){
    sequence('copy_plugin', 'write_plugin', 'delete_plugin_repo', done);
});