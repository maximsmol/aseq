'use strict';

var aseq = require('../lib/aseq');

var doStuff = function(arg, arg1, callback)
{
	var handleErr = aseq.callOnError(callback);

	var seq = new aseq();

	seq.append(function(arg, arg1, callback)
	{
		console.log(arguments);
		console.log('Ok.');
		callback(null, 'callback argument');
	});
	seq.append(handleErr);
	seq.append(function(arg, callback)
	{
		console.log(arguments);
		console.log('Ok.');
		callback(null, 'callback argument');
	});
	seq.append(handleErr);
	seq.append(function(arg, callback)
	{
		console.log(arguments);
		console.log('Critical error!!!');
		callback('error!', 'callback argument');
	});
	seq.append(handleErr);
	seq.append(function(arg)
	{
		console.log(arguments);
		callback(null, 'This argument will be voided and will not ruin the callback.');
	});
	seq.append(handleErr);
	seq.append(aseq.voidArguments);
	seq.append(callback, this, null); // This callback could be ruined by excess arguments

	seq.run(arg, arg1);
};


doStuff('a', 'b', function(err)
{
	console.log('doStuff returned. Error:', err);
});
