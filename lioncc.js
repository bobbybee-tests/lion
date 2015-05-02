// lioncc.js
// core of lioncc itself
// by its nature, it's tiny (mostly require statements),
// but it glues all the parts of lion together

var fs = require("fs");
var $meow = require("./meow");
var meow = $meow.instance();
var ListTuple = $meow.ListTuple;
var backend = require("./backend");
var grammar = require("./lion.ne.js");
var nearley = require("nearley");
var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

var memory = new ListTuple("$Memory");
meow.lists.push(memory);

parser.feed(fs.readFileSync(process.argv[2]).toString());

backend(meow, parser.results[0]);

meow.upload(process.argv[3], 'v426', process.argv[4], process.argv[5]);
