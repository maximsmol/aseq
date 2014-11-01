'use strict';

//
// Helpers
//

var argumentsToArray = function(args)
{
	return Array.prototype.slice.call(args);
};

var arrayShouldContainFunctions = function(array)
{
	for (var i = 0; i < array.length; i++)
	{
		if (typeof(array[i]) !== 'function')
		{
			var msg = 'Expected function as argument number ' + i + '.';
			throw new TypeError(msg);
		}
	}
};

var _aseq = function(fns, i, args)
{
	var callback = function()
	{
		i++;
		if (i >= fns.length) return;

		_aseq.call(this, fns, i, argumentsToArray(arguments));
	};
	if (this != null) callback = callback.bind(this);

	if (i === fns.length-1) fns[i].apply(this, args);
	else fns[i].apply(this, args.concat([callback]));
};


//
// aseq object
//

var aseq = function()
{
	if (this != null)
	{
		this.functions = argumentsToArray(arguments);
		arrayShouldContainFunctions(this.functions);
	}
	else
	{
		var fns = argumentsToArray(arguments);
		arrayShouldContainFunctions(fns);

		return function()
		{
			_aseq(fns, 0, argumentsToArray(arguments));
		};
	}
};

aseq.createErrorHandler = function(handle)
{
	if (typeof(handle) !== 'function')
		throw new TypeError('Expected handle to be a function.');

	return function()
	{
		var args = argumentsToArray(arguments);
		var callback = args[args.length-1];

		if (args.length > 1) handle(args[0], function()
		{
			var handleArgs = argumentsToArray(arguments);
			var callbackArgs = args.slice(1, args.length-1).concat(handleArgs);

			if (args.length > 2) callback.apply(this, callbackArgs);
			else callback();
		});
	};
};

aseq.prototype.run = function()
{
	_aseq(this.functions, 0, argumentsToArray(arguments));
};

aseq.prototype.append = function()
{
	var args = argumentsToArray(arguments);

	if (typeof(args[0]) !== 'function')
		throw new TypeError('Expected function as first argument.');

	if 		(args.length === 1) this.functions.push(args[0]);
	else if (args.length === 2) this.functions.push(args[0].bind(args[1]));
	else if (args.length   > 2)
		this.functions.push(function()
		{
			args[0].apply(args[1],
				args.slice(2, args.length).concat(argumentsToArray(arguments))
			);
		});
};


//
// Module exports
//

module.exports = aseq;
