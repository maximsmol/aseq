'use strict';

//
// Helpers
//

var argumentsToArray = function(args, start, end)
{
	return Array.prototype.slice.call(args, start, end);
};

var arrayShouldContainFunctions = function(array)
{
	for (var i = 0; i < array.length; i++)
	{
		if (typeof(array[i]) !== 'function')
		{
			var msg = 'Expected function as argument number ' + (i+1) + '.';
			throw new TypeError(msg);
		}
	}
};


//
// Main code
//

var _aseq = function(fns, i, args)
{
	if (fns.length === 0) return; // End of sequence reached

	// Create callback function
	var callback = function()
	{
		if (i === fns.length-1) return; // End of sequence reached

		// Call next function in sequence
		_aseq.call(this, fns, ++i, argumentsToArray(arguments));
	};

	// Don't pass callback if this is the last function in the sequence
	if (i !== fns.length-1) args.push(callback);

	fns[i].apply(this, args);
};


//
// aseq object
//

var aseq = function()
{
	if (this != null && this instanceof aseq)
	{
		// Called as constructor

		this.functions = [];

		this.functions = argumentsToArray(arguments);
		arrayShouldContainFunctions(this.functions);
	}
	else
	{
		//Called as a function generator

		arrayShouldContainFunctions(arguments);

		var generatorArguments = arguments;
		return function()
		{
			_aseq(generatorArguments, 0, argumentsToArray(arguments));
		};
	}
};

//
// Error handler generators
aseq.callOnError = function(handle)
{
	// We are always passing a valid function to createErrorHandler
	// => we need to check if the handle is valid ourselves.
	if (typeof(handle) !== 'function')
		throw new TypeError('Expected handle to be a function.');

	return aseq.createErrorHandler(function(err, callback)
	{
		if (err != null) handle(err, callback);
		else if (callback != null) callback();
	});
};

aseq.createErrorHandler = function(handle)
{
	if (typeof(handle) !== 'function')
		throw new TypeError('Expected handle to be a function.');

	return function()
	{
		// Sequence called error handler

		var seqCallback = arguments[arguments.length-1];

		if (arguments.length > 1)
		{
			// Arguments contain an error argument
			// => have a structre of
			// error + ... + callback
			// => length > 1

			var generatorArguments = arguments;

			// error == arguments[0]
			handle(arguments[0], function()
			{
				// Error was handled successfully

				if (generatorArguments.length > 2)
				{
					// Sequence call's arguments contain
					// an error + additional arguments + callback
					// => length > 2

					// Forward arguments except error and callback
					var args = argumentsToArray(
						generatorArguments,
						1,
						generatorArguments.length-1
					);

					if (seqCallback != null) seqCallback.apply(
						this,

						// Also forward arguments, that handle passed
						args.concat(argumentsToArray(arguments))
					);
				}
				else
				{
					// Sequence call's arguments do not contain
					// additional arguments
					// => nothing to forward from sequence call
					if (seqCallback != null)
						seqCallback(argumentsToArray(arguments));
				}
			});
		}
		else
		{
			// Arguments do not contain an error argument
			// => Error handled
			// => Nothing to do
			if (seqCallback != null) process.nextTick(seqCallback);
		}
	};
};


aseq.voidArguments = function()
{
	// arguments[arguments.length-1] == last argument == callback
	var callback = arguments[arguments.length-1];

	if (callback != null) callback();
};

aseq.prototype.run = function()
{
	_aseq(this.functions, 0, argumentsToArray(arguments));
};

aseq.prototype.append = function()
{
	var func = arguments[0];
	if (typeof(func) !== 'function')
		throw new TypeError('Expected function as first argument.');

	if (arguments.length === 1)
	{
		// Only function specified

		this.functions.push(func);
	}
	else if (arguments.length === 2)
	{
		// Function and custom 'this' specified

		// arguments[1] == custom 'this'
		this.functions.push(func.bind(arguments[1]));
	}
	else if (arguments.length > 2)
	{
		// Function, custom 'this' and prefix arguments specified

		var appendArguments = arguments;
		this.functions.push(function()
		{
			// Wrapper function is needed

			// Cut off the function and custom 'this' argument
			var args = argumentsToArray(
				appendArguments,
				2,
				appendArguments.length
			);

			// appendArguments[1] == custom 'this'
			func.apply(
				appendArguments[1],

				// Forward prefix arguments + sequence arguments
				args.concat(argumentsToArray(arguments))
			);
		});
	}
};


//
// Module exports
//

module.exports = aseq;
