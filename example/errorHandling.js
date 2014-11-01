'use strict';

var aseq = require('../lib/aseq');

var handleErr = aseq.createErrorHandler(
function(err, callback)
{
	console.log('Got error:', err);
	callback();
});

var a = function(arg, callback)
{
	console.log(arguments);
	callback('errA', 'callback argument');
};

var b = function(arg, callback)
{
	console.log(arguments);
	callback(null, 'callback argument');
};

var c = function(arg, callback)
{
	console.log(arguments);
	callback('errC', 'callback argument');
};

var d = function(arg, callback)
{
	console.log(arguments);
	callback('errD', 'callback argument');
};

var seq = aseq(a, handleErr, b, handleErr, c, handleErr, d, handleErr);

seq('additional argument');
