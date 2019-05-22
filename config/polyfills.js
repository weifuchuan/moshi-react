'use strict';

// use ` require("xxx") ` for import polyfils
 
// require("react-app-polyfill/ie11")
require("intersection-observer/intersection-observer.js")

var EventEmitter = require("wolfy87-eventemitter")
window.EventEmitter=EventEmitter;

const bus = new EventEmitter();