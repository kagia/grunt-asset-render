module.exports = function (input, template, options) {
    var StringScanner = require('strscan').StringScanner;

    scanner = new StringScanner(input);

    var output = "";

    var error_context = options.error_context || "";
    var delimiters = options.delimiters || '<!-- -->';
    var start_token = options.start_token || 'START';
    var end_token = options.end_token || 'END';
    var tag_pattern = new RegExp(delimiters.replace(' ', '\\s*(' + start_token + '|' + end_token + ')\\s*'));

    var passes = 0;
    while (!scanner.hasTerminated()) {
        var until_tag = scanner.scanUntil(tag_pattern);
        if (until_tag !== undefined) {
            passes += 1;
            if (scanner.getCapture(0) !== start_token) {
                throw new Error("missing start tag. hint(" + error_context + ")");
            }
            var current_line = scanner.getSource().slice(0, scanner.getPosition()).split(/\n|\r\n/).slice(-1)[0];
            var indent = current_line.indexOf(scanner.getMatch()) + 1;

            var inside_tag = scanner.scanUntil(tag_pattern);
            if (scanner.getCapture(0) !== end_token) {
                throw new Error("missing end tag for start tag. hint(" + error_context + ")");
            }
            var after_template = scanner.getMatch();

            var injection = template;

            var newline = /(\n|\r\n)/.exec(inside_tag);
            if (newline !== null) {
                var line_ending = newline[1];
                injection = insertPadding(template, line_ending, indent);
                after_template = insertPadding(after_template, line_ending, indent);
            }

            output += until_tag;
            output += injection;
            output += after_template;

            if (scanner.checkUntil(tag_pattern) === undefined) {
                while (!scanner.hasTerminated()) {
                    output += scanner.scanChar();
                }
            }
        } else {
            if (passes < 1) {
                return undefined;
            } 
        }
    }

    return output;
}

function insertPadding(input, line_ending, indent) {

    var output = ""

    input.split(/\n|\r\n/).map(function(line) {
        var padding = new Array(indent).join(" ");
        var padded_line = line_ending + padding + line;
        output += padded_line;
    });

    return output;
}