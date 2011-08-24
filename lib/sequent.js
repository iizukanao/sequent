(function() {
  var DEBUG, Sequent;
  var __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  DEBUG = false;
  module.exports = Sequent = (function() {
    function Sequent(params) {
      this.waits = null;
      this.finished = 0;
      this.args = [];
      this.matured = false;
      this.loops = 0;
      this.loopCallbacks = [];
      this.executedLoops = 0;
      this.readyLoops = [];
      this.isCallbackExecuted = false;
    }
    Sequent.prototype.rewind = function() {
      this.finished = 0;
      return this.matured = false;
    };
    Sequent.prototype.reset = function() {
      this.waits = null;
      this.finished = 0;
      this.callback = null;
      this.args = [];
      this.matured = false;
      this.loops = 0;
      this.loopCallbacks = [];
      this.executedLoops = 0;
      this.readyLoops = [];
      return this.isCallbackExecuted = false;
    };
    Sequent.prototype.wait = function(waits, callback) {
      var finished;
      this.waits = waits;
      this.callback = callback;
      finished = this.finished;
      if (DEBUG) {
        console.log("wait: waits=" + waits + " finished=" + finished);
      }
      if (waits != null) {
        if (this.matured) {
          if (!this.isCallbackExecuted) {
            if (DEBUG) {
              console.log("execute matured callback on wait(): " + callback);
            }
            this.isCallbackExecuted = true;
            return typeof callback === "function" ? callback.apply(null, this.args) : void 0;
          } else {
            if (DEBUG) {
              return console.log("wait and matured but callback has already been executed");
            }
          }
        } else {
          if (finished === waits) {
            if (!this.isCallbackExecuted) {
              if (DEBUG) {
                console.log("execute callback from wait()");
              }
              this.isCallbackExecuted = true;
              return typeof callback === "function" ? callback.apply(null, this.args) : void 0;
            } else {
              if (DEBUG) {
                return console.log("wait ready but callback has already been executed");
              }
            }
          } else if (finished > waits) {
            return console.log("[warn] extra complete: " + finished + " > " + waits);
          }
        }
      } else {
        throw new Error("You have to specify the number of waits");
      }
    };
    Sequent.prototype.mature = function() {
      var args;
      if (this.matured) {
        console.log("[info] matured multiple times, ignored");
        return;
      }
      this.matured = true;
      if (DEBUG) {
        console.log("[info] mature");
      }
      args = this.args = __slice.call(arguments);
      if (this.waits != null) {
        if (DEBUG) {
          console.log("execute matured callback on mature()");
        }
        this.isCallbackExecuted = true;
        return typeof this.callback === "function" ? this.callback.apply(this, args) : void 0;
      } else {
        if (DEBUG) {
          return console.log("matured but callback hasn't ready");
        }
      }
    };
    Sequent.prototype.done = function() {
      var args, finished, waits;
      waits = this.waits;
      finished = ++this.finished;
      if (DEBUG) {
        console.log("done waits=" + waits + " finished=" + finished);
      }
      args = this.args = __slice.call(arguments);
      if (waits != null) {
        if (finished === waits) {
          if (!this.isCallbackExecuted) {
            if (DEBUG) {
              console.log("execute callback from done()");
            }
            this.isCallbackExecuted = true;
            return this.callback.apply(this, args);
          } else {
            if (DEBUG) {
              return console.log("done but callback has already been executed");
            }
          }
        } else if (finished > waits) {
          return console.log("[warn] extra complete: " + finished + " > " + waits);
        }
      } else {
        if (DEBUG) {
          return console.log("done but callback hasn't ready");
        }
      }
    };
    Sequent.prototype.join = Sequent.wait;
    Sequent.prototype.queue = function(callback) {
      var loops;
      loops = this.loops++;
      if (DEBUG) {
        console.log("queueing callback " + loops);
      }
      return this.loopCallbacks[loops] = __bind(function() {
        var args;
        if (this.executedLoops === loops) {
          this.i = loops;
          this.executedLoops++;
          if (DEBUG) {
            console.log("[" + loops + "] executing loop");
          }
          callback.apply(null, arguments);
          if (this.readyLoops[loops + 1]) {
            if (DEBUG) {
              console.log("[" + loops + "] executing chaining next callback");
            }
            args = __slice.call(arguments);
            return process.nextTick(__bind(function() {
              var _ref;
              return (_ref = this.loopCallbacks)[loops + 1].apply(_ref, args);
            }, this));
          } else {
            if (DEBUG) {
              console.log("[" + loops + "] waiting for next callback to be executed");
            }
            if (this.executedLoops === this.loops) {
              if (DEBUG) {
                console.log("flush callback in queue()");
              }
              return typeof this.flushCallback === "function" ? this.flushCallback() : void 0;
            }
          }
        } else {
          if (DEBUG) {
            console.log("[" + loops + "] waiting for previous callback to be executed");
          }
          return this.readyLoops[loops] = true;
        }
      }, this);
    };
    Sequent.prototype.flush = function(callback) {
      if (this.executedLoops === this.loops) {
        if (DEBUG) {
          console.log("flush callback in flush()");
        }
        return typeof callback === "function" ? callback() : void 0;
      } else {
        return this.flushCallback = callback;
      }
    };
    return Sequent;
  })();
}).call(this);
