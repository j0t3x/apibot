const assert = require('assert');

let singleton;

function validator() {
	// body...
}

validator.prototype.isLatLngOk = function( arr ){
	if(typeof arr === 'string'){
		arr = arr.split(',');
	}
	assert.deepStrictEqual(arr.length, 2);
	if(typeof arr[0] !== 'number' &&  typeof arr[1] !== 'number'){
		arr[0] = parseFloat(arr[0]);
		arr[1] = parseFloat(arr[1]);
	}

	return arr;
};

validator.prototype.isDistanceOk = function( d ){
	if(typeof d === 'string')
		d = parseFloat(d);
	
	assert.deepEqual(typeof d, 'number');
	return d;
};

// tags will come in string form 'tag,value,tag,value'
validator.prototype.areTagsOk = function( t ){
	assert.ok(typeof t, 'string');
	let tarr = t.split(',');
	assert.notStrictEqual(t.length, 0);

	return tarr;
};

validator.prototype.formatTags = function( t ){
	let ft = [];
	for (var i = 0; i < t.length; i++) {
		let one = {};
		one[process.env.NODECOL_TAG] = { $eq : t[i] }
		ft.push( one );
	}
	return ft;
};

exports = module.exports = function(){
	if (!singleton) {
        singleton = new validator();
    }
    return singleton;
};