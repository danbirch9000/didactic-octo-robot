var $ = require('gulp-load-plugins')({ lazy: true });

function gulpConfig() {


    var config = {
        appRoot: './content/app/',
        sassFile: './source/sass/index.scss',
        cssDestination: './content/css/',
        sassSource: './source/sass/**/*.scss',
        angularDestination: './content/js/',
        angularFileName: 'international-portal.js',
        nodeModules: [
            './node_modules/angular-ui-bootstrap/dist/**/*',
            './node_modules/underscore/**/*',
            './node_modules/angular/**/*',
            './node_modules/angular-route/**/*',
            './node_modules/check-types/src/**/*',
            './node_modules/bootstrap-sass/assets/**/*',
            './node_modules/font-awesome/**/*'
        ],
        nodeModulesDest: './source/node_modules_libraries/'
    };

    config.log = function log(msg) {
        if (typeof (msg) === 'object') {
            for (var item in msg) {
                if (msg.hasOwnProperty(item)) {
                    $.util.log($.util.colors.blue(msg[item]));
                }
            }
        }
        else {
            $.util.log($.util.colors.blue(msg));
        }
    };

    return config;
}

module.exports = new gulpConfig();