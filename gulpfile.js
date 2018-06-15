'use strict';

/**
 * 程序入口:package.json的main
 * 构建框架start
*/

/**
 * 1.引入构建器gulp
 */
var gulp = require('gulp');

/**
 * 2.引入sass将sass打包成css
 */
var sass = require('gulp-sass');

/**
 * 3.引入gulp-html-beautify格式化（美化）HTML，JavaScript和CSS
 */
var beautify = require('gulp-html-beautify');

/**
 * 4.引入gulp-clean-css压缩css
 */
var cleanCss = require('gulp-clean-css');

/**
 * 5.引入gulp-rename重命名JavaScript和CSS
 */
var rename = require('gulp-rename');

/**
 * 6.引入gulp-uglify压缩JavaScript
 */
var uglify = require('gulp-uglify');

/**
 * 7.引入gulp-rtlcss格式化CSS
 */
var rtlcss = require("gulp-rtlcss");

/**
 * 8.引入gulp-connect启动一个本地webServer服务器+监控自动刷新
 */
var connect = require('gulp-connect');


/**
 * webServer服务启动
 */
//默认webServer
gulp.task('defaultConnect', function () {
    connect.server();
});
//开启自动刷新的webServer
gulp.task('liveConnect', function () {
    connect.server({
        name: 'Project Tracking System',
        port: 8888,
        livereload: true  //自动刷新     
    });
});
//定义需要刷新的资源
gulp.task('liveAssets', function () {
    gulp.src(['./index.html', './tpl/*.html', './views/**/*.html', './js/**/*.js']) //资源位置
        .pipe(connect.reload());  //刷新操作
});
//监听变化的资源并执行实时刷新
gulp.task("connect:watch", function () {
    //gulp.watch(glob[, opts], tasks)
    //glob 为要监视的文件匹配模式，规则和用法与gulp.src()方法中的glob相同。 
    //opts 为一个可选的配置对象，通常不需要用到 
    //tasks 为文件变化后要执行的任务，为一个数组
    gulp.watch(['./index.html', './tpl/*.html', './views/**/*.html', './js/**/*.js'], ['liveAssets'])
})
//默认启动服务
gulp.task('default', ['liveConnect', 'connect:watch', 'sass:watch']);

/**
 * 处理sass
 */
gulp.task('sass', function () {
    // bootstrap compilation
    gulp.src('./sass/bootstrap.scss') //路径
        .pipe(sass()) //编译
        .pipe(gulp.dest('./assets/global/plugins/bootstrap/css/')); //输出
    // select2 compilation using bootstrap variables
    gulp.src('./assets/global/plugins/select2/sass/select2-bootstrap.min.scss').pipe(sass({ outputStyle: 'compressed' })).pipe(gulp.dest('./assets/global/plugins/select2/css/'));
    // global theme stylesheet compilation
    gulp.src('./sass/global/*.scss').pipe(sass()).pipe(gulp.dest('./assets/global/css'));
    gulp.src('./sass/apps/*.scss').pipe(sass()).pipe(gulp.dest('./assets/apps/css'));
    gulp.src('./sass/pages/*.scss').pipe(sass()).pipe(gulp.dest('./assets/pages/css'));
    // theme layouts compilation
    gulp.src('./sass/layouts/layout/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout/css'));
    gulp.src('./sass/layouts/layout/themes/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout/css/themes'));
});
/**
 * 监听sass实时刷新
 */
gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

/**
 * 格式化css
 */
gulp.task('rtlcss',function() {
    gulp.src(['./assets/apps/css/*.css', '!./assets/apps/css/*-rtl.min.css', '!./assets/apps/css/*-rtl.css', '!./assets/apps/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/apps/css'));

  gulp.src(['./assets/pages/css/*.css', '!./assets/pages/css/*-rtl.min.css', '!./assets/pages/css/*-rtl.css', '!./assets/pages/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/pages/css'));

  gulp.src(['./assets/global/css/*.css', '!./assets/global/css/*-rtl.min.css', '!./assets/global/css/*-rtl.css', '!./assets/global/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/global/css'));

  gulp.src(['./assets/layouts/**/css/*.css', '!./assets/layouts/**/css/*-rtl.css', '!./assets/layouts/**/css/*-rtl.min.css', '!./assets/layouts/**/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/layouts'));

  gulp.src(['./assets/layouts/**/css/**/*.css', '!./assets/layouts/**/css/**/*-rtl.css', '!./assets/layouts/**/css/**/*-rtl.min.css', '!./assets/layouts/**/css/**/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/layouts'));

  gulp.src(['./assets/global/plugins/bootstrap/css/*.css', '!./assets/global/plugins/bootstrap/css/*-rtl.css', '!./assets/global/plugins/bootstrap/css/*.min.css'])
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    .pipe(gulp.dest('./assets/global/plugins/bootstrap/css')); 
});

/**
 * 压缩JavaScript和CSS
 */
gulp.task('minify', function () {
    // css minify 
    gulp.src(['./assets/apps/css/*.css', '!./assets/apps/css/*.min.css']) //资源路径
    .pipe(cleanCss())  //压缩css
    .pipe(rename({ suffix: '.min' })) //更名(加min后缀)
    .pipe(gulp.dest('./assets/apps/css/')); //输出

    gulp.src(['./assets/global/css/*.css', '!./assets/global/css/*.min.css']).pipe(cleanCss()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/global/css/'));
    gulp.src(['./assets/pages/css/*.css', '!./assets/pages/css/*.min.css']).pipe(cleanCss()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/pages/css/'));

    gulp.src(['./assets/layouts/**/css/*.css', '!./assets/layouts/**/css/*.min.css']).pipe(rename({ suffix: '.min' })).pipe(cleanCss()).pipe(gulp.dest('./assets/layouts/'));
    gulp.src(['./assets/layouts/**/css/**/*.css', '!./assets/layouts/**/css/**/*.min.css']).pipe(rename({ suffix: '.min' })).pipe(cleanCss()).pipe(gulp.dest('./assets/layouts/'));

    gulp.src(['./assets/global/plugins/bootstrap/css/*.css', '!./assets/global/plugins/bootstrap/css/*.min.css']).pipe(cleanCss()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/global/plugins/bootstrap/css/'));

    //js minify
    gulp.src(['./assets/apps/scripts/*.js', '!./assets/apps/scripts/*.min.js']).pipe(uglify()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/apps/scripts/'));
    gulp.src(['./assets/global/scripts/*.js', '!./assets/global/scripts/*.min.js']).pipe(uglify()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/global/scripts'));
    gulp.src(['./assets/pages/scripts/*.js', '!./assets/pages/scripts/*.min.js']).pipe(uglify()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/pages/scripts'));
    gulp.src(['./assets/layouts/**/scripts/*.js', '!./assets/layouts/**/scripts/*.min.js']).pipe(uglify()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/layouts/'));
});

/**
 * 格式化（美化）HTML，JavaScript和CSS
 */
// gulp.task('beautify',function() {
//     gulp.src(['./assets/**/**/css/*.css', '!./assets/**/**/css/*-rtl.css', '!./assets/**/**/css/*-rtl.min.css', '!./assets/**/**/css/*.min.css'])
//     .pipe(beautify({
//         "indent_size": 4,
//         "indent_char": " ",
//         "eol": "\n"
//     }))
//     .pipe(gulp.dest('./'));
// });

/**
 * 启动步骤：
 * 1.打包sass为css:gulp sass
 * 2.格式化css:gulp rtlcss
 * 3.压缩JavaScript和CSS:gulp minify
 * 4.启动服务:gulp default
 */