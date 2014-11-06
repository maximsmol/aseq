# Strange if clause

## Question

```js
var _aseq = function(fns, i, args)
{
	//...

	if (i === fns.length-1) fns[i].apply(this, args); // Why does this
	else fns[i].apply(this, args.concat([callback])); // if clause exist?
};
```

## Answer

If that if clause did not exist, then the following situation would occur.

```js
var b = function(callback)
{
	callback(null, 10);
};

var a = function(callback)
{
	var seq = new aseq();
	seq.append(b);
	seq.append(handleError);
	seq.append(aseq.voidArguments);
	seq.append(callback, null, null); // equal to callback(null, aCallback);
};

var seq = new aseq();
seq.append(a);
seq.append(function(err, aCallback, realCallback)
{
	// aCallback came from sequence in function "a"
	// realCallback came from sequence to which this function was appended
});
seq.run();
```
