'use strict';

var aseq = require('../lib/aseq');

var a = function(a, b, c, callback)
{
	console.log(arguments, this);
	callback('callback argument');
};

var b = function(a, callback)
{
	console.log(arguments, this);
	callback('callback argument');
};

var c = function(a, b, c, callback)
{
	console.log(arguments, this);
	callback('callback argument');
};

var d = function(a, callback)
{
	console.log(arguments, this);
	callback('callback argument');
};

var seq = new aseq();
seq.append(a, null, 'a', 'b');
seq.append(b, {test: 'test'});
seq.append(c, {test: 'test'}, 'e', 'f');
seq.append(d);

seq.run('additional argument');
