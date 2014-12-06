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
	callback('Test');
};

var test1 = function(callback)
{
	callback('test1: this.test == '+this.test);
};

var test2 = function(arg, arg1, arg2, callback)
{
	callback(
		'test2: arg == '+arg+
		' arg1 == '+arg1+
		' arg2 == '+arg2+
		' this.test == '+this.test
	);
};

//
// Tests
describe('aseq.append', function()
{
	describe('Only specifing the function', function()
	{
		it('Should append the function correctly', function(done)
		{
			var seq = new aseq();

			seq.append(test);
			test(function(expected)
			{
				seq.functions[0](function(recieved)
				{
					assert.strictEqual(expected, recieved);
					done();
				});
			});
		});
	});
	describe('Specifing the function and custom \'this\'', function()
	{
		it('Should append the function correctly', function(done)
		{
			var seq = new aseq();

			var obj = {test: 10};
			seq.append(test1, obj);

			test1.bind(obj)(function(expected)
			{
				seq.functions[0](function(recieved)
				{
					assert.strictEqual(expected, recieved);
					done();
				});
			});
		});
	});
	describe('Specifing the function, custom \'this\' and prefix arguments',
	function()
	{
		it('Should append the function correctly', function(done)
		{
			var seq = new aseq();

			var obj  = {test: 10};
			var arg  = 'argument';
			var arg1 = 'argument1';
			var arg2 = 'argument2';

			seq.append(test2, obj, arg, 'argument1');

			test2.bind(obj)(arg, arg1, arg2, function(expected)
			{
				seq.functions[0](arg2, function(recieved)
				{
					assert.strictEqual(expected, recieved);
					done();
				});
			});
		});
	});
	describe('Passing invalid function as first argument', function()
	{
		it('Should fail with TypeError', function()
		{
			var seq = new aseq();

			assert.throws(
				function()
				{
					seq.append('I am totally a function!');
				},

				function(err)
				{
					if ((err instanceof TypeError) &&
						err.message === 'Expected function as first argument.')
					{
						return true;
					}
					else return false;
				},

				'Unexpected error!'+
				' Expected TypeError with message'+
				' "Expected function as first argument."'
			);
		});
	});
});
