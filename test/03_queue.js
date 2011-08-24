var vows = require('vows');
var assert = require('assert');

var Sequent = require('../lib/sequent')

vows.describe('example queue').addBatch({
    'queue': {
        topic: new Sequent,
        'queue elements': {
            topic: function(seq){
                var self = this;

                var funcs = [];
                var results = [];
                for (var i=1; i<=10; i++) {
                    funcs.push(seq.queue(
                        (function(_i){
                            return function(){
                                results.push(_i);
                            }
                        })(i)
                    ));
                }
                funcs.reverse();
                for (var i=0, l=funcs.length; i<l; i++) {
                    funcs[i]();
                }
                seq.flush(function(){
                    self.callback(null, results);
                });
            },
            'flushed': function(err, result){
                assert.isNull(err);
                assert.deepEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            },
        }
    }
}).export(module);
