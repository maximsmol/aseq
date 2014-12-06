'use strict';

//
// Standard libraries
var assert = require('assert');

//
// Aseq
var aseq = require('../lib/aseq.js');

//
// Mocha
var describe = global.describe;
var it = global.it;


//
// Main Code
//

//
// Tests
describe('aseq worker == aseq.run == aseq(...)()', function()
{
	describe('Test function last', function()
	{
		it('Should not pass callback', function(done)
		{
			var seq = new aseq();

			seq.append(function()
			{
				assert.strictEqual(arguments.length, 1);

				done();
			});

			seq.run('argument');
		});
	});
	describe('Specifing no arguments', function()
	{
		it('Should only pass callback as arguments', function(done)
		{
			var seq = new aseq();

			seq.append(function()
			{
				assert.strictEqual(arguments.length, 1);
				assert.strictEqual(typeof(arguments[0]), 'function');

				done();
			});

			// Test function should not be the last in the sequence
			seq.append(function() {});

			seq.run();
		});
	});
	describe('Specifing arguments', function()
	{
		it('Should pass specified arguments and callback as arguments',
		function(done)
		{
			var args = ['argument', 'argument1', 'argument2'];


			var seq = new aseq();

			seq.append(function()
			{
				// arguments' length should be args.length + 1 (callback)
				assert.strictEqual(arguments.length, args.length+1);

				for (var i = 0; i < args.length; i++)
				{
					assert.strictEqual(args[i], arguments[i]);
				}

				assert.strictEqual(
					typeof(arguments[arguments.length-1]),
					'function'
				);

				done();
			});

			// Test function should not be the last in the sequence
			seq.append(function() {});

			seq.run('argument', 'argument1', 'argument2');
		});
	});
	describe('Running on a sequence with multiple functions', function()
	{
		it('Should pass the results and callback', function(done)
		{
			var results = ['result', 'result1'];

			var seq = new aseq();

			seq.append(function(callback)
			{
				callback('result', 'result1');
			});
			seq.append(function()
			{
				assert.strictEqual(arguments.length, results.length+1);

				for (var i = 0; i < results.length; i++)
				{
					assert.strictEqual(results[i], arguments[i]);
				}

				assert.strictEqual(
					typeof(arguments[arguments.length-1]),
					'function'
				);

				done();
			});

			// Test function should not be the last in the sequence
			seq.append(function() {});

			seq.run();
		});
	});
});
