"use strict";
(function(module) {
	/**
	 * Class constructor. Initialize the class' attributes, and sets it's
	 * execution behavior and its frequency, if provided
	 */
	var Thread = function(method, executionFrequency) {
		/**
		 * The method executed by the thread each iteration. By defaul, does
		 * nothing.
		 */
		this.method = method || function() {
		};
		/**
		 * The frequency, in milliseconds, the thread execute its method. By
		 * default it is 100ms, wich seems to be a very cost efective value for
		 * non processing intensive tasks
		 */
		this.executionFrequency = executionFrequency || 100;

		/**
		 * The thread's name. Preferrably could be a unique one, but not
		 * necessarily
		 */
		this.id = (+("" + Math.random()).substr(2)).toString(16);
		/**
		 * The count of iterations already executed by this thread
		 */
		this.iteration = 0;
		/**
		 * The amount of time this thread has been put to sleep, in milliseconds
		 */
		this.timeAsleep = 0;
		/**
		 * The timestamp of the last time this thread executed an iteration
		 */
		this.lastExecution = 0;
		/**
		 * Tells wether this thread is asleep or awake
		 */
		this.isSleeping = false;
		/**
		 * Tells wether this thread is alive of not
		 */
		this.isAlive = false;
		/**
		 * The result of this thread execution. Not all threads need to generate
		 * and outcome value of processing, but if it does, at the end of its
		 * last iteration, it should put its processing result in this attribute
		 * and then call stop() onto itself.
		 */
		this.result = null;
		/**
		 * Variable to hold a reference to the global object, which may change
		 * in case the code is running inside a browser or inside nodejs
		 */
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
			this.result = null;
			console.log("Thread " + this.id + " forcefully stoped.");
		}
		return this;
	};

	/**
	 * Restarts the current thread. Usefull when some kind of exception resulted
	 * in a dirty thread halt.
	 * 
	 * @returns {Thread}
	 */
	Thread.prototype.restart = function() {
		this.stop();
		this.start();
		return this;
	}
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
