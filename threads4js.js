"use strict";
(function(module) {
	/**
	 * Class constructor. Initialize the class' attributes, and sets it's
	 * execution behavior and its frequency, if provided
	 */
	var Thread = function(method, executionFrequency) {
		this.method = method || function() {
		};
		this.executionFrequency = executionFrequency || 100;

		/**
		 * The thread's name, currently unused.
		 */
		this.id = (+("" + Math.random()).substr(2)).toString(16);
		this.iteration = 0;
		this.timeAsleep = 0;
		this.lastExecution = 0;
		this.isSleeping = false;
		this.isAlive = false;
		this.global = typeof (global) != 'undefined' ? global : window; //asks who is the global object, in case we are running inside node.js
	};

	/**
	 * Initiates thread execution. This method calls itself continously while
	 * the thread is alive, and calls the thread methods if the thread is not
	 * asleep.
	 */
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

	/**
	 * Put the thread to sleep for the specified time (in milliseconds)
	 * 
	 * @param millis
	 *            Amount of milliseconds this thread should be put to sleep
	 * @returns {Thread} Returns the own thread for chaining
	 */
	Thread.prototype.sleep = function(millis) {
		if(this.isAlive && !this.isSleeping) {
			console.log("Putting thread " + this.id + " to sleep for " + millis + " milliseconds.");
			this.isSleeping = true;
			this.timeAsleep = millis;
		}
		return this;
	};

	/**
	 * Wakes up a sleeping thread, despite its remaining time to sleep.
	 * 
	 * @returns {Thread} Returns the own thread for chaining
	 */
	Thread.prototype.wakeUp = function() {
		if(this.isAlive && this.isSleeping) {
			console.log("Forcefully waking up thread " + this.id + ".");
			this.isSleeping = false;
			this.timeAsleep = 0;
		}
		return this;
	};

	/**
	 * Initiates the thread execution, if not yet initiated.
	 * 
	 * @returns {Thread} Returns the own thread for chaining
	 */
	Thread.prototype.start = function() {
		if(!this.isAlive) {
			console.log("Starting thread " + this.id + ".");
			this.isAlive = true;
			this.isSleeping = false;
			this.run(this);
		}
		return this;
	};

	/**
	 * Terminates the thread execution, if it is running
	 * 
	 * @returns {Thread}
	 */
	Thread.prototype.stop = function() {
		if(this.isAlive) {
			this.iteration = 0;
			this.timeAsleep = 0;
			this.lastExecution = 0;
			this.isSleeping = false;
			this.isAlive = false;
			console.log("Thread " + this.id + " forcefully stoped.");
		}
		return this;
	};
	/* Class definition END */

	// Freeze the Class' function object, to prevent class modification
	Object.freeze(Thread);
	if(module && module.exports) {// Common js style module export
		module.exports.Thread = Thread;
	} else if(typeof (define) !== "undefined") {// AMD style module export
		define(function() {
			return {
				"Thread" : Thread
			};
		});
	} else {// Classical global variable export
		window.Thread = Thread;
	}
})(typeof (module) !== "undefined" ? module : undefined);
