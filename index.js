'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var ejs = require('ejs');

function run(options, settings, compile) {
    options = options || {};
    settings = settings || {};

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit(
                'error',
                new gutil.PluginError('gulp-ejs', 'Streaming not supported')
            );
        }

        options = file.data || options;
        options.filename = file.path;

        try {
            file.contents = new Buffer(
                (compile ?
                    ejs.compile(file.contents.toString(), options).toString() :
                    ejs.render(file.contents.toString(), options))
            );

            if (typeof settings.ext !== 'undefined') {
                file.path = gutil.replaceExtension(file.path, settings.ext);
            }
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-ejs', err.toString()));
        }

        this.push(file);
        cb();
    });
};

module.exports = {
    render: function (options, settings) {
        return run(options, settings);
    },
    compile: function (options, settings) {
        return run(options, settings, true);
    }
};


