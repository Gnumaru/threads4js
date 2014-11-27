"use strict";
(function(module) {
	/** Class definition BEGIN */
	var Thread = function(method, executionFrequency) {
		this.method = method || function() {
		};
		this.executionFrequency = executionFrequency || 100;

		this.name = (+("" + Math.random()).substr(2)).toString(16);
		this.iteration = 0;
		this.timeAsleep = 0;
		this.lastExecution = 0;
		this.isSleeping = false;
		this.isAlive = false;
		this.global = typeof (global) != 'undefined' ? global : window; //asks who is the global object, in case we are running inside node.js
	};

	Thread.prototype.run = function run(self) {
		if(self.isAlive) {
			var currentExecutionTime = new Date().getTime();
			if(!self.isSleeping) {
				self.method();
				self.iteration++;
			} else {
				self.timeAsleep -= currentExecutionTime - self.lastExecution;
				if(self.timeAsleep <= 0) {
					self.isSleeping = false;
				}
			}
			self.lastExecution = currentExecutionTime;
			self.global.setTimeout(run, self.executionFrequency, self);
		}
	};

	Thread.prototype.sleep = function(millis) {
		if(this.isAlive && !this.isSleeping) {
			console.log("Putting thread " + this.name + " to sleep for " + millis + " milliseconds.");
			this.isSleeping = true;
			this.timeAsleep = millis;
		}
	};

	Thread.prototype.wakeUp = function() {
		if(this.isAlive && this.isSleeping) {
			console.log("Forcefully waking up thread " + this.name + ".");
			this.isSleeping = false;
			this.timeAsleep = 0;
		}
	};

	Thread.prototype.start = function() {
		if(!this.isAlive) {
			console.log("Starting thread " + this.name + ".");
			this.isAlive = true;
			this.isSleeping = false;
			this.run(this);
		}
	};

	Thread.prototype.stop = function() {
		if(this.isAlive) {
			this.iteration = 0;
			this.timeAsleep = 0;
			this.lastExecution = 0;
			this.isSleeping = false;
			this.isAlive = false;
			console.log("Thread " + this.name + " forcefully stoped.");
		}
	};
	/** Class definition END */

	Object.freeze(Thread);
	if(module && module.exports) {
		// if required in commonjs style, exports the Thread class
		module.exports.Thread = Thread;
	} else {
		// else, exports the class as a globa object
		window.Thread = Thread;
	}
})(typeof (module) !== "undefined" ? module : undefined);