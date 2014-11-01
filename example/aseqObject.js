'use strict';

var aseq = require('../lib/aseq');

var a = function(a, b, c, callback)
{
	console.log(arguments);
	callback('callback argument');
};

var b = function(a, b, c, callback)
{
	console.log(arguments);
	callback('callback argument');
};

var c = function(a, b, c, callback)
{
	console.log(arguments);
	callback('callback argument');
};

var d = function(a, b, c, callback)
{
	console.log(arguments);
	callback('callback argument');
};

var seq = new aseq();
seq.append(a, null, 'a', 'b');
seq.append(b, null, 'c', 'd');
seq.append(c, null, 'e', 'f');
seq.append(d, null, 'g', 'h');

seq.run('additional argument');
