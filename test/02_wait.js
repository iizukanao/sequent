var vows = require('vows');
var assert = require('assert');

var Sequent = require('../lib/sequent')

vows.describe('example wait').addBatch({
    'wait': {
        topic: new Sequent,
        'wait 2': {
            topic: function(seq){
                var self = this;

                setTimeout(function(){
                    seq.done("done 1");
                }, 500);

                setTimeout(function(){
                    seq.done("done 2", "end");
                }, 1000);

                seq.wait(2, function(arg1, arg2){
                    self.callback(null, [arg1, arg2]);
                });
            },
            'all done': function(err, result){
                assert.isNull(err);
                assert.deepEqual(result, ["done 2", "end"]);
            },
        }
    }
}).export(module);
