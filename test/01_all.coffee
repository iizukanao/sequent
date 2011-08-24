Sequent = require '../lib/sequent'
vows = require 'vows'
assert = require 'assert'

vows.describe('Sequent').addBatch

    'reset':
        topic: new Sequent
        'reset':
            topic: (seq) ->
                seq.wait 1, (num, name) =>
                    seq.reset()
                    seq.wait 2, (a, b) =>
                        this.callback null, [a, b]
                    seq.done 54321, 'Naomi Iizuka'
                    seq.done 4321, 'naomi iizuka'
                seq.done()
                return

            'we get num and name': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [4321, 'naomi iizuka']

    'wait - 1':
        topic: new Sequent
        'wait - done':
            topic: (seq) ->
                seq.wait 1, (num, name) =>
                    this.callback null, [num, name]
                seq.done 4321, 'naomi iizuka'
                return

            'we get num and name': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [4321, 'naomi iizuka']

    'wait - 2':
        topic: new Sequent
        'done - wait':
            topic: (seq) ->
                seq.done 1234, 'nao iizuka'
                seq.wait 1, (num, name) =>
                    this.callback null, [num, name]
                return

            'we get num and name': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [1234, 'nao iizuka']

    'wait - 3':
        topic: new Sequent
        'done - done - wait':
            topic: (seq) ->
                seq.done 123, 'Lupin'
                seq.done 456, 'Lupin III'
                seq.wait 2, (num, name) =>
                    this.callback null, [num, name]
                return

            'we get num and name': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [456, 'Lupin III']

    'wait - 4':
        topic: new Sequent
        'wait - done - done':
            topic: (seq) ->
                seq.wait 2, (num, name) =>
                    this.callback null, [num, name]
                seq.done 123, 'Lupin'
                seq.done 456, 'Lupin III'
                return

            'we get num and name': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [456, 'Lupin III']

    'wait - 5':
        topic: new Sequent
        'done - wait - done':
            topic: (seq) ->
                seq.done 123, 'Lupin'
                seq.wait 2, (num, name) =>
                    this.callback null, [num, name]
                seq.done 789, 'Lupin IIII'
                return

            'we get num and name': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [789, 'Lupin IIII']

    'wait - 6':
        topic: new Sequent
        'done - done - wait':
            topic: (seq) ->
                seq.done 123, 'Lupin'
                seq.done 456, 'Lupin III'
                seq.wait 2, (num, name) =>
                    this.callback null, [num, name]
                return

            'we get num and name': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [456, 'Lupin III']

    'wait - 7':
        topic: new Sequent
        'done - done - wait (with setTimeout)':
            topic: (seq) ->
                setTimeout ->
                    seq.done 123, 'Lupin'
                , 0
                seq.done 456, 'Lupin III'
                seq.wait 2, (num, name) =>
                    this.callback null, [num, name]
                return

            'we get num and name': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [123, 'Lupin']

    'wait - 8':
        topic: new Sequent
        'mature':
            topic: (seq) ->
                setTimeout ->
                    seq.done 123, 'Lupin'
                    seq.done 234, 'Lupin II'
                , 100
                seq.mature 456, 'Lupin III'
                seq.wait 2, (num, name) =>
                    this.callback null, [num, name]
                return

            'we get num and name': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [456, 'Lupin III']

    'wait - 9':
        topic: new Sequent
        'mature':
            topic: (seq) ->
                setTimeout ->
                    seq.done 123, 'Lupin'
                    seq.done 234, 'Lupin II'
                , 100
                seq.wait 2, (num, name) =>
                    this.callback null, [num, name]
                seq.mature 456, 'Lupin III'
                return

            'we get num and name': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [456, 'Lupin III']

    'wait - 10':
        topic: new Sequent
        'large sequent - wait - done':
            topic: (seq) ->
                results = []
                seq.wait 100001, =>
                    this.callback null, [results]
                i = 0
                for num in [1000000..1100000]
                    results.push i++
                    seq.done()
                return

            'we get ordered array': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [[0..100000]]

    'queue - 1':
        topic: new Sequent
        'queue (queue - flush)':
            topic: (seq) ->
                funcs = []
                results = []
                for num in [130..100]
                    funcs.push seq.queue do (num) -> ->
                        results.push num
                func() for func in funcs
                seq.flush =>
                    this.callback null, [results]
                return

            'we get ordered array': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [[130..100]]

    'queue - 2':
        topic: new Sequent
        'queue (flush - queue)':
            topic: (seq) ->
                funcs = []
                results = []
                seq.flush =>
                    this.callback null, [results]
                for num in [130..100]
                    funcs.push seq.queue do (num) -> ->
                        results.push num
                func() for func in funcs
                return

            'we get ordered array': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [[130..100]]

    'queue - 3':
        topic: new Sequent
        'large sequence - done - wait':
            topic: (seq) ->
                results = []
                i = 0
                for num in [1000000..1100000]
                    results.push i++
                    seq.done()
                seq.wait 100001, =>
                    this.callback null, [results]
                return

            'we get ordered array': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [[0..100000]]

    'queue - 4':
        topic: new Sequent
        'large queue':
            topic: (seq) ->
                funcs = []
                results = []
                for i in [1000000..1100000]
                    funcs.push seq.queue ->
                        results.push seq.i
                [funcs[0], funcs[3]] = [funcs[3], funcs[0]]
                funcs.reverse()
                for func in funcs
                    func()
                seq.flush =>
                    this.callback null, [results]
                return

            'we get ordered array': (err, result) ->
                assert.isNull err
                assert.deepEqual result, [[0..100000]]

.export module
