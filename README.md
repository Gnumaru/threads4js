threads4js
==========

A lightweight javascript threads implementation

Usage
===================

threads4js can be included in a page using conventional script tags
```html
<script src="threads4js.js"></script>
```
or be required as a commonjs style module, 
```javascript
var Thread = require("./threads4js.js").Thread;
```
Once required or included, threads can be created as follow
```javascript
var thread = new Thread(function(){
	console.log("logging something");
}, 50);
thread.start();
```
where the first (optional) parameter is the function to be executed on each thread iteration, and the second (optional) parameter sets the time interval in milliseconds between the iterations' execution. In the previous example, a message will be logged on the terminal each 50 milliseconds.

To stop a thread execution, use:

```javascript
thread.stop();
```
Threads can be put to sleep with

```javascript
thread.sleep();
```
and be wakened with
```javascript
thread.wakeUp();
```
