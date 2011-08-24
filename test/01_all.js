(function() {
  var Sequent, assert, vows;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Sequent = require('../lib/sequent');
  vows = require('vows');
  assert = require('assert');
  vows.describe('Sequent').addBatch({
    'reset': {
      topic: new Sequent,
      'reset': {
        topic: function(seq) {
          seq.wait(1, __bind(function(num, name) {
            seq.reset();
            seq.wait(2, __bind(function(a, b) {
              return this.callback(null, [a, b]);
            }, this));
            seq.done(54321, 'Naomi Iizuka');
            return seq.done(4321, 'naomi iizuka');
          }, this));
          seq.done();
        },
        'we get num and name': function(err, result) {
          assert.isNull(err);
          return assert.deepEqual(result, [4321, 'naomi iizuka']);
        }
      }
    },
    'wait - 1': {
      topic: new Sequent,
      'wait - done': {
        topic: function(seq) {
          seq.wait(1, __bind(function(num, name) {
            return this.callback(null, [num, name]);
          }, this));
          seq.done(4321, 'naomi iizuka');
        },
        'we get num and name': function(err, result) {
          assert.isNull(err);
          return assert.deepEqual(result, [4321, 'naomi iizuka']);
        }
      }
    },
    'wait - 2': {
      topic: new Sequent,
      'done - wait': {
        topic: function(seq) {
          seq.done(1234, 'nao iizuka');
          seq.wait(1, __bind(function(num, name) {
            return this.callback(null, [num, name]);
          }, this));
        },
        'we get num and name': function(err, result) {
          assert.isNull(err);
          return assert.deepEqual(result, [1234, 'nao iizuka']);
        }
      }
    },
    'wait - 3': {
      topic: new Sequent,
      'done - done - wait': {
        topic: function(seq) {
          seq.done(123, 'Lupin');
          seq.done(456, 'Lupin III');
          seq.wait(2, __bind(function(num, name) {
            return this.callback(null, [num, name]);
          }, this));
        },
        'we get num and name': function(err, result) {
          assert.isNull(err);
          return assert.deepEqual(result, [456, 'Lupin III']);
        }
      }
    },
    'wait - 4': {
      topic: new Sequent,
      'wait - done - done': {
        topic: function(seq) {
          seq.wait(2, __bind(function(num, name) {
            return this.callback(null, [num, name]);
          }, this));
          seq.done(123, 'Lupin');
          seq.done(456, 'Lupin III');
        },
        'we get num and name': function(err, result) {
          assert.isNull(err);
          return assert.deepEqual(result, [456, 'Lupin III']);
        }
      }
    },
    'wait - 5': {
      topic: new Sequent,
      'done - wait - done': {
        topic: function(seq) {
          seq.done(123, 'Lupin');
          seq.wait(2, __bind(function(num, name) {
            return this.callback(null, [num, name]);
          }, this));
          seq.done(789, 'Lupin IIII');
        },
        'we get num and name': function(err, result) {
          assert.isNull(err);
          return assert.deepEqual(result, [789, 'Lupin IIII']);
        }
      }
    },
    'wait - 6': {
      topic: new Sequent,
      'done - done - wait': {
        topic: function(seq) {
          seq.done(123, 'Lupin');
          seq.done(456, 'Lupin III');
          seq.wait(2, __bind(function(num, name) {
            return this.callback(null, [num, name]);
          }, this));
        },
        'we get num and name': function(err, result) {
          assert.isNull(err);
          return assert.deepEqual(result, [456, 'Lupin III']);
        }
      }
    },
    'wait - 7': {
      topic: new Sequent,
      'done - done - wait (with setTimeout)': {
        topic: function(seq) {
          setTimeout(function() {
            return seq.done(123, 'Lupin');
          }, 0);
          seq.done(456, 'Lupin III');
          seq.wait(2, __bind(function(num, name) {
            return this.callback(null, [num, name]);
          }, this));
        },
        'we get num and name': function(err, result) {
          assert.isNull(err);
          return assert.deepEqual(result, [123, 'Lupin']);
        }
      }
    },
    'wait - 8': {
      topic: new Sequent,
      'mature': {
        topic: function(seq) {
          setTimeout(function() {
            seq.done(123, 'Lupin');
            return seq.done(234, 'Lupin II');
          }, 100);
          seq.mature(456, 'Lupin III');
          seq.wait(2, __bind(function(num, name) {
            return this.callback(null, [num, name]);
          }, this));
        },
        'we get num and name': function(err, result) {
          assert.isNull(err);
          return assert.deepEqual(result, [456, 'Lupin III']);
        }
      }
    },
    'wait - 9': {
      topic: new Sequent,
      'mature': {
        topic: function(seq) {
          setTimeout(function() {
            seq.done(123, 'Lupin');
            return seq.done(234, 'Lupin II');
          }, 100);
          seq.wait(2, __bind(function(num, name) {
            return this.callback(null, [num, name]);
          }, this));
          seq.mature(456, 'Lupin III');
        },
        'we get num and name': function(err, result) {
          assert.isNull(err);
          return assert.deepEqual(result, [456, 'Lupin III']);
        }
      }
    },
    'wait - 10': {
      topic: new Sequent,
      'large sequent - wait - done': {
        topic: function(seq) {
          var i, num, results;
          results = [];
          seq.wait(100001, __bind(function() {
            return this.callback(null, [results]);
          }, this));
          i = 0;
          for (num = 1000000; num <= 1100000; num++) {
            results.push(i++);
            seq.done();
          }
        },
        'we get ordered array': function(err, result) {
          var _i, _results;
          assert.isNull(err);
          return assert.deepEqual(result, [
            (function() {
              _results = [];
              for (_i = 0; _i <= 100000; _i++){ _results.push(_i); }
              return _results;
            }).apply(this, arguments)
          ]);
        }
      }
    },
    'queue - 1': {
      topic: new Sequent,
      'queue (queue - flush)': {
        topic: function(seq) {
          var func, funcs, num, results, _i, _len;
          funcs = [];
          results = [];
          for (num = 130; num >= 100; num--) {
            funcs.push(seq.queue((function(num) {
              return function() {
                return results.push(num);
              };
            })(num)));
          }
          for (_i = 0, _len = funcs.length; _i < _len; _i++) {
            func = funcs[_i];
            func();
          }
          seq.flush(__bind(function() {
            return this.callback(null, [results]);
          }, this));
        },
        'we get ordered array': function(err, result) {
          var _i, _results;
          assert.isNull(err);
          return assert.deepEqual(result, [
            (function() {
              _results = [];
              for (_i = 130; _i >= 100; _i--){ _results.push(_i); }
              return _results;
            }).apply(this, arguments)
          ]);
        }
      }
    },
    'queue - 2': {
      topic: new Sequent,
      'queue (flush - queue)': {
        topic: function(seq) {
          var func, funcs, num, results, _i, _len;
          funcs = [];
          results = [];
          seq.flush(__bind(function() {
            return this.callback(null, [results]);
          }, this));
          for (num = 130; num >= 100; num--) {
            funcs.push(seq.queue((function(num) {
              return function() {
                return results.push(num);
              };
            })(num)));
          }
          for (_i = 0, _len = funcs.length; _i < _len; _i++) {
            func = funcs[_i];
            func();
          }
        },
        'we get ordered array': function(err, result) {
          var _i, _results;
          assert.isNull(err);
          return assert.deepEqual(result, [
            (function() {
              _results = [];
              for (_i = 130; _i >= 100; _i--){ _results.push(_i); }
              return _results;
            }).apply(this, arguments)
          ]);
        }
      }
    },
    'queue - 3': {
      topic: new Sequent,
      'large sequence - done - wait': {
        topic: function(seq) {
          var i, num, results;
          results = [];
          i = 0;
          for (num = 1000000; num <= 1100000; num++) {
            results.push(i++);
            seq.done();
          }
          seq.wait(100001, __bind(function() {
            return this.callback(null, [results]);
          }, this));
        },
        'we get ordered array': function(err, result) {
          var _i, _results;
          assert.isNull(err);
          return assert.deepEqual(result, [
            (function() {
              _results = [];
              for (_i = 0; _i <= 100000; _i++){ _results.push(_i); }
              return _results;
            }).apply(this, arguments)
          ]);
        }
      }
    },
    'queue - 4': {
      topic: new Sequent,
      'large queue': {
        topic: function(seq) {
          var func, funcs, i, results, _i, _len, _ref;
          funcs = [];
          results = [];
          for (i = 1000000; i <= 1100000; i++) {
            funcs.push(seq.queue(function() {
              return results.push(seq.i);
            }));
          }
          _ref = [funcs[3], funcs[0]], funcs[0] = _ref[0], funcs[3] = _ref[1];
          funcs.reverse();
          for (_i = 0, _len = funcs.length; _i < _len; _i++) {
            func = funcs[_i];
            func();
          }
          seq.flush(__bind(function() {
            return this.callback(null, [results]);
          }, this));
        },
        'we get ordered array': function(err, result) {
          var _i, _results;
          assert.isNull(err);
          return assert.deepEqual(result, [
            (function() {
              _results = [];
              for (_i = 0; _i <= 100000; _i++){ _results.push(_i); }
              return _results;
            }).apply(this, arguments)
          ]);
        }
      }
    }
  })["export"](module);
}).call(this);
