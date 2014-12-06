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
describe('aseq.callOnError', function()
{
	describe('Passing invalid function as first argument', function()
	{
		it('Should fail with TypeError', function()
		{
			assert.throws(
				function()
				{
					aseq.callOnError('I am totally a function!');
				},

				function(err)
				{
					if ((err instanceof TypeError) &&
						err.message === 'Expected handle to be a function.')
					{
						return true;
					}
					else return false;
				},

				'Unexpected error!'+
				' Expected TypeError with message'+
				' "Expected handle to be a function."'
			);
		});
	});
	describe('Passing error', function()
	{
		describe('Error is critical', function()
		{
			it('Should call the handle and not continue', function(done)
			{
				var error = 'Critical error';

				var handler = aseq.callOnError(function(err)
				{
					assert.strictEqual(err, error);
					done();
				});

				handler(error, function()
				{
					assert.strictEqual(0, 1); // Test failed
				});
			});
		});
		describe('Error is not critical', function()
		{
			it('Should call the handle and continue', function(done)
			{
				var error = 'Non-critical error';

				var handler = aseq.callOnError(function(err, callback)
				{
					assert.strictEqual(err, error);

					callback();
				});

				handler(error, function()
				{
					done();
				});
			});
		});
		describe('Passing additional arguments', function()
		{
			it('Should forward arguments', function(done)
			{
				var argument  = 'argument';
				var argument1 = 'argument1';
				var argument2 = 'argument2';

				var handler = aseq.callOnError(function(err, callback)
				{
					callback(argument2);
				});

				handler('err', argument, argument1, function(arg, arg1, arg2)
				{
					assert.strictEqual(arg , argument );
					assert.strictEqual(arg1, argument1);
					assert.strictEqual(arg2, argument2);

					done();
				});
			});
		});
	});
	describe('Passing null error', function()
	{
		it('Should not call the handle', function(done)
		{
			var handler = aseq.callOnError(function()
			{
				assert.strictEqual(0, 1); // Test failed
			});

			handler(null, function()
			{
				done();
			});
		});
	});
	describe('Passing no error', function()
	{
		it('Should not call the handle and continue immediatly',
		function(done)
		{
			var handler = aseq.callOnError(function()
			{
				assert.strictEqual(0, 1); // Test failed
			});

			handler(function()
			{
				done();
			});
		});
	});
});
