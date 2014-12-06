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
describe('aseq.voidArguments', function()
{
	it('Should not pass any arguments', function(done)
	{
		var seq = new aseq();

		seq.append(function(callback)
		{
			callback('argument', 'argument1');
		});
		seq.append(aseq.voidArguments);
		seq.append(function()
		{
			assert.strictEqual(arguments.length, 0);

			done();
		});

		seq.run();
	});
});
