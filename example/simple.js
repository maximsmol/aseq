'use strict';

var aseq = require('../lib/aseq');

var a = function(arg, callback)
{
	console.log(arguments);
	callback('callback argument');
};

var b = function(arg, callback)
{
	console.log(arguments);
	callback('callback argument');
};

var c = function(arg, callback)
{
	console.log(arguments);
	callback('callback argument');
};

var d = function()
{
	console.log(arguments);
};

var seq = aseq(a, b, c, d);

seq('additional argument');
