'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.inject_tests = {
  setUp: function(done) {
    this.globSort = require('../lib/glob-sort');
    this.input = [
      'asset/file',
      'asset/file1',
      'asset/file2',
      'asset/file3',
      'asset/fileabcd'
    ];

    done();
  },

  single_promotion: function(test) {
    test.expect(2);

    var globs = [
      'asset/fileabcd'
    ];

    var result = this.globSort(this.input, globs);

    test.equal(result.length, this.input.length, "the number of elements should be unaffected");

    test.equal(result[0], 'asset/fileabcd', "result in order with asset/fileabcd first");

    test.done();
  },

  milti_promotion: function(test) {
    test.expect(3);

    var globs = [
      'asset/fileabcd',
      'asset/file2'
    ];

    var result = this.globSort(this.input, globs);

    test.equal(result.length, this.input.length, "the number of elements should be unaffected");

    test.equal(result[0], 'asset/fileabcd', "result in order with asset/fileabcd first");

    test.equal(result[1], 'asset/file2', "result in order with asset/file2 second");

    test.done();
  },

  explicit_promotion: function(test) {
    test.expect(1);

    var globs = [
      'asset/file2',
      'asset/file',
      'asset/fileabcd',
      'asset/file1',
      'asset/file3'
    ];

    var expected = [
      'asset/file2',
      'asset/file',
      'asset/fileabcd',
      'asset/file1',
      'asset/file3'
    ];

    var result = this.globSort(this.input, globs);

    test.deepEqual(result, expected, "assets ordered as expected");

    test.done();
  },

  single_wild_promotion: function(test) {
    test.expect(2);

    var globs = [
      '**/*abcd',
    ];

    var result = this.globSort(this.input, globs);

    test.equal(result.length, this.input.length, "the number of elements should be unaffected");

    test.equal(result[0], 'asset/fileabcd', "result in order with asset/fileabcd first");

    test.done();
  },

  multi_wild_promotion: function(test) {

    test.expect(4);

    var globs = [
      'asset/file{1,2,3}'
    ];

    var result = this.globSort(this.input, globs);

    test.equal(result.length, this.input.length, "the number of elements should be unaffected");

    var file1_in_top3 = false;
    var file2_in_top3 = false;
    var file3_in_top3 = false;

    var top3 = result.slice(0,3);
    var asset = "";

    var i;

    for (i = 0; i < top3.length; i++) {
      if (top3[i] === 'asset/file1') {
        file1_in_top3 = true;
        break;
      }
    }

    for (i = 0; i < top3.length; i++) {
      if (top3[i] === 'asset/file2') {
        file2_in_top3 = true;
        break;
      }
    }

    for (i = 0; i < top3.length; i++) {
      if (top3[i] === 'asset/file3') {
        file3_in_top3 = true;
        break;
      }
    }

    test.equal(file1_in_top3, true, "asset/file1 in top 3");

    test.equal(file2_in_top3, true, "asset/file2 in top 3");

    test.equal(file3_in_top3, true, "asset/file3 in top 3");

    test.done();
  },

  composite_promotion: function(test) {
    test.expect(2);

    var globs = [
      ['asset/file{1,2,3}', '!asset/file2']
    ];

    var result = this.globSort(this.input, globs);

    var top3 = result.slice(0, 3);

    var file2_in_top3 = false;

    for (var i = 0; i < top3.length; i++) {
      if (top3[i] === 'asset/file2') {
        file2_in_top3 = true;
      }
    }

    test.equal(result.length, this.input.length, "the number of elements should be unaffected");
    
    test.equal(file2_in_top3, false, "asset/file2 excluded from top 3");

    test.done();
  }
};
