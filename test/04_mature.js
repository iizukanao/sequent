var vows = require('vows');
var assert = require('assert');

var Sequent = require('../lib/sequent')

vows.describe('example mature').addBatch({
    'mature': {
        topic: new Sequent,
        'mature fast': {
            topic: function(seq){
                var self = this;

                seq.wait(100, function(arg1, arg2){
                    self.callback(null, [arg1, arg2]);
                });
                for (var i=0; i<100; i++) {
                    if (i == 5) {
                        seq.mature("matured", "hah");
                    }
                    seq.done("done " + i);
                }
            },
            'all done': function(err, result){
                assert.isNull(err);
                assert.deepEqual(result, ["matured", "hah"]);
            },
        }
    }
}).export(module);
