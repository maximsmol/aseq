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

var d = function(arg, callback)
{
	console.log(arguments);
	callback('callback argument');
};

var seq = new aseq(a, b, c, d);

seq.run('additional argument');
