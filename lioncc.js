var $meow = require("./meow");
var meow = $meow.instance();
var ListTuple = $meow.ListTuple;

var backend = require("./backend");

var memory = new ListTuple("$Memory");
meow.lists.push(memory);

backend(meow);

meow.upload(process.argv[3], 'v426', process.argv[4], process.argv[5]);
