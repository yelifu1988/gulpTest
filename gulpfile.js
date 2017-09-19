var gulp = require('gulp'),
    clean = require('gulp-clean'),//用于删除文件
    uglify = require('gulp-uglify'),//压缩js
    concat = require('gulp-concat'),//合并文件
    cssmin = require('gulp-clean-css'),//压缩css
    cssver = require('gulp-make-css-url-version'),//给css文件里引用url加版本号（根据引用文件的md5生产版本号）
    rev = require('gulp-rev'),//- 对css、js文件名加MD5后缀
    revCollector = require('gulp-rev-collector'),//- 路径替换
    imagemin = require('gulp-imagemin');            //- 压缩图片


gulp.task('clean',function () {
        gulp.src('dist/*',{read:false})
            .pipe(clean());
});

gulp.task('jsmin',function () {
    //压缩js目录下所有js文件
    //除了test03
    return gulp.src(['src/js/*.js','!src/js/{test02,test03}.js'])
        .pipe(concat('all.js'))
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true//类型：Boolean 默认：true 是否完全压缩
            // preserveComments: 'all' //保留所有注释
        }))
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest({
            merge: true
        }))                       //- 生成一个rev-manifest.json
        .pipe(gulp.dest('rev-js'))                  //- 将rev-manifest.json保存到 rev-js 目录内
});

gulp.task('cssmin',function () {
    gulp.src(['src/css/*.css'])
        .pipe(cssmin({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest({
                merge: true
            }))                       //- 生成一个rev-manifest.json
        .pipe(gulp.dest('rev-css'))                  //- 将rev-manifest.json保存到 rev-js 目录内
});

/*修改html文件的link标签和script标签引用的css和js文件名，并把html文件输出到指定的位置*/
gulp.task('rev-html',['cssmin','jsmin'], function() {          //- compress-css和compress-js任务执行完毕再执行rev-index任务
    /*修改index.html文件的link标签和script标签引用的css和js文件名，并把html文件输出到指定的位置*/
    gulp.src(['rev-css/*.json','rev-js/*.json', 'src/index.html'])   //- 读取两个rev-manifest.json文件以及需要进行css和js名替换的html文件
        .pipe(revCollector())                                               //- 执行文件内css和js名的替换
        .pipe(gulp.dest('dist/'));                                          //- 替换后的html文件输出的目录

});

/*压缩并复制图片*/
gulp.task('compress-img',function () {
    gulp.src('src/imgs/**/*.*')    //原图片的位置
        .pipe(imagemin())                   //执行图片压缩
        .pipe(gulp.dest('dist/imgs'));    //压缩后的图片输出的位置
});

/*最终执行的任务-css*/
gulp.task('rev',['rev-html','compress-img']);

/*执行顺序 clean --  rev  */
