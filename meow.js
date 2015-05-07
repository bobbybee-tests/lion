/*
maintains a Scratch project in memory,
with JSON serialization support
*/

var http = require('http');

function Meow() {
	this.scripts = [];
	this.lists = [];
	this.variables = [];
	this.sprites = [];
	this.spriteKeys = {}; // used to index this.sprites
}

Meow.prototype.serialize = function() {
	// I extracted this from the Scratch Wiki; when it breaks, you can blame veggie

	return {
			"lists": this.lists,
			"variables": this.variables,
		    "objName": "Stage",
		    "costumes": [{
		            "costumeName": "backdrop1",
		            "baseLayerID": 1,
		            "baseLayerMD5": "510da64cf172d53750dffd23fbf73563.png",
		            "bitmapResolution": 1,
		            "rotationCenterX": 240,
		            "rotationCenterY": 180
		        }],
		    "currentCostumeIndex": 0,
		    "penLayerMD5": "279467d0d49e152706ed66539b577c00.png",
		    "tempoBPM": 60,
		    "videoAlpha": 0.5,
		    "scripts" : this.scripts,
		    "children": this.sprites,
		    "info": {
		        "scriptCount": 0,
		        "flashVersion": "MAC 11,8,800,94",
		        "spriteCount": 0,
		        "swfVersion": "v341",
		        "videoOn": false,
		        "projectID": "11175527",
		        "userAgent": "Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/30.0.1552.0 Safari\/537.36",
		        "hasCloudData": false
		    }
		};
}

Meow.prototype.upload = function(projectID, version, csrf, sessionsid) {
	var data = JSON.stringify(this.serialize());

	var options = {
		host: 'projects.scratch.mit.edu',
		port: '80',
		path: '/internalapi/project/'+projectID+'/set/?v='+version+'&_rnd='+Math.random(),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': data.length,
			'X-Csrftoken': csrf,
			'Cookie': 'scratchcsrftoken='+csrf+'; scratchsessionsid='+sessionsid
		}
	};

	var req = http.request(options, function(res) {
		res.on('data', function(d) {
			console.log(d.toString());
		})
	})

	req.write(data);
	req.end();
}

Meow.prototype.addScript = function(blocks, context) {
	var tuple = new ScriptTuple(blocks, 0, 0);

	console.log("S: "+context);

	if(context == "Stage" || !context)
		this.scripts.push(tuple);
	else
		this.sprites[this.spriteKeys[context]].scripts.push(tuple);
}

Meow.prototype.addList = function(name) {
	this.lists.push(new ListTuple(name));
}

Meow.prototype.addVariable = function(name, value) {
	this.variables.push(new VariableTuple(name, value));
}

Meow.prototype.addSprite = function(id) {
	this.spriteKeys[id] = this.sprites.length;

	this.sprites.push({
		objName: id,
		scratchX: 0,
		scratchY: 0,
		visible: true,
		spriteInfo: {},
		sounds: [],
		scripts: [],
		costumes: [{
                    "costumeName": "costume1",
                    "baseLayerID": 1,
                    "baseLayerMD5": "f9a1c175dbe2e5dee472858dd30d16bb.svg",
                    "bitmapResolution": 1,
                    "rotationCenterX": 47,
                    "rotationCenterY": 55
                }],
		currentCostumeIndex: 0,
		isDraggable: false,
		indexInLibrary: this.spriteKeys[id] + 1,
		rotationStyle: "normal",
		direction: 90,
		scale: 1,
	});
}

function ScriptTuple(blocks, x, y) {
	this.blocks = blocks || [];
	this.x = x || 0;
	this.y = y || 0;
}

ScriptTuple.prototype.toJSON = function() {
	return [this.x, this.y, this.blocks];
}

function ListTuple(name) {
	this.listName = name;
	this.contents = [];
	this.isPersistent = false;
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.visible = false;
}

ListTuple.prototype.classicTTY = function() {
	this.x = 5;
	this.y = 5;
	this.width = 470;
	this.height = 350;
	this.visible = true;
}

function VariableTuple(name, value) {
	this.name = name;
	this.value = value;
	this.isPersistent = false;
}

module.exports.ListTuple = ListTuple;

module.exports.instance = function() {
	return (new Meow());
}
