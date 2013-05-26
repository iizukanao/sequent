DEBUG = false

doImmediately = setImmediate ? (callback) -> setTimeout callback, 0
idCounter = 1

class Sequent
    toString: ->
        str = "[seq:#{@id}]"
        if @waits?
            str += " #{@finished}/#{@waits}"
        if @isCallbackExecuted
            str += " (finished)"
        str

    constructor: (params) ->
        @id = idCounter++
        @waits = null
        @finished = 0
        @args = []
        @matured = false
        @loops = 0
        @loopCallbacks = []
        @executedLoops = 0
        @readyLoops = []
        @isCallbackExecuted = false

    rewind: ->
        @finished = 0
        @matured = false

    reset: ->
        @waits = null
        @finished = 0
        @callback = null
        @args = []
        @matured = false
        @loops = 0
        @loopCallbacks = []
        @executedLoops = 0
        @readyLoops = []
        @isCallbackExecuted = false

    wait: (waits, callback) ->
        @waits = waits
        @callback = callback
        finished = @finished
        console.log "wait: waits=#{waits} finished=#{finished}" if DEBUG
        if waits?
            if @matured
                if not @isCallbackExecuted
                    console.log "execute matured callback on wait(): #{callback}" if DEBUG
                    @isCallbackExecuted = true
                    callback? @args...
                else
                    console.log "wait and matured but callback has already been executed" if DEBUG
            else
                if finished is waits
                    if not @isCallbackExecuted
                        console.log "execute callback from wait()" if DEBUG
                        @isCallbackExecuted = true
                        callback? @args...
                    else
                        console.log "wait ready but callback has already been executed" if DEBUG
                else if finished > waits
                    console.log "[WARN] extra done() has been called: done=#{finished} > wait=#{waits}"
        else
            throw new Error "You have to specify the number of waits"

    mature: ->
        if @matured
            console.log "[info] matured multiple times, ignored"
            return
        @matured = true
        console.log "[info] mature" if DEBUG
        args = @args = [arguments...]
        if @waits?
            console.log "execute matured callback on mature()" if DEBUG
            @isCallbackExecuted = true
            @callback? args...
        else
            console.log "matured but callback hasn't ready" if DEBUG

    done: ->
        waits = @waits
        finished = ++@finished
        console.log "done waits=#{waits} finished=#{finished}" if DEBUG
        args = @args = [arguments...]
        if waits?
            if finished is waits
                if not @isCallbackExecuted
                    console.log "execute callback from done()" if DEBUG
                    @isCallbackExecuted = true
                    @callback args...
                else
                    console.log "done but callback has already been executed" if DEBUG
            else if finished > waits
                console.log "[WARN] extra done() has been called: done=#{finished} > wait=#{waits}"
        else
            console.log "done but callback hasn't ready" if DEBUG

    join: @wait

    queue: (callback) ->
        loops = @loops++
        console.log "queueing callback #{loops}" if DEBUG
        @loopCallbacks[loops] = =>
            if @executedLoops is loops
                @i = loops
                @executedLoops++
                console.log "[#{loops}] executing loop" if DEBUG
                callback arguments...
                if @readyLoops[loops+1]
                    console.log "[#{loops}] executing chaining next callback" if DEBUG
                    args = [arguments...]
                    doImmediately =>
                        @loopCallbacks[loops+1] args...
                else
                    console.log "[#{loops}] waiting for next callback to be executed" if DEBUG
                    if @executedLoops is @loops
                        console.log "flush callback in queue()" if DEBUG
                        @flushCallback?()
            else
                console.log "[#{loops}] waiting for previous callback to be executed" if DEBUG
                @readyLoops[loops] = true

    flush: (callback) ->
        if @executedLoops is @loops
            console.log "flush callback in flush()" if DEBUG
            callback?()
        else
            @flushCallback = callback

if define? and define.amd
    define -> Sequent
else if module?.exports
    module.exports = Sequent
else
    @Sequent = Sequent
