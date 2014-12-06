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
// Helpers
var test = function(callback)
{
	callback('test');
};

var test1 = function(callback)
{
	callback('test1');
};

//
// Tests
describe('new aseq(...)', function()
{
	describe('Passing functions', function()
	{
		it('Should append functions correctly', function(done)
		{
			var seq = new aseq(test, test1);

			// Test #1
			test(function(expected)
			{
				seq.functions[0](function(recieved)
				{
					assert.strictEqual(expected, recieved);

					// Test #2
					test1(function(expected)
					{
						seq.functions[1](function(recieved)
						{
							assert.strictEqual(expected, recieved);

							done();
						});
					});

				});
			});
		});
	});
	describe('Passing invalid function', function()
	{
		it('Should fail with TypeError', function()
		{
			assert.throws(
				function()
				{
					void(new aseq(test, 'I am totally a function!'));
				},

				function(err)
				{
					if ((err instanceof TypeError) &&
						err.message ===
						'Expected function'+
						' as argument number 2.')
					{
						return true;
					}
					else return false;
				},

				'Unexpected error!'+
				' Expected TypeError with message'+
				' "Expected function as argument number 2."'
			);
		});
	});
});

describe('aseq(...)', function()
{
	describe('Passing functions', function()
	{
		it('Should append functions correctly', function(done)
		{
			test(function(expected)
			{
				var seq = aseq(test,
				function(recieved)
				{
					assert.strictEqual(expected, recieved);

					done();
				});

				seq();
			});
		});
	});
	describe('Passing invalid function', function()
	{
		it('Should fail with TypeError', function()
		{
			assert.throws(
				function()
				{
					void(aseq(test, 'I am totally a function!'));
				},

				function(err)
				{
					if ((err instanceof TypeError) &&
						err.message ===
						'Expected function'+
						' as argument number 2.')
					{
						return true;
					}
					else return false;
				},

				'Unexpected error!'+
				' Expected TypeError with message'+
				' "Expected function as argument number 2."'
			);
		});
	});
});
