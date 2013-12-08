module.exports = function(input, globs) {
    var grunt = require('grunt');

    var buckets = []
    globs.map(function(glob) {
        var matches = grunt.file.match(glob, input);
        buckets.push( matches );
    });

    var output = [];
    buckets.map(function(bucket) {
        bucket.map(function(asset) {
            if (output.indexOf(asset) === -1) {
                output.push(asset);
            }
        });
    });

    input.map(function(file) {
        if (output.indexOf(file) === -1) {
            output.push(file);
        }
    });

    return output;
}