// lioncc backend
// performs actual code generation functionality
// internal compiler module

var $Class = require("./$Class");
var $Type = require("./$Type");

// generates Scratch blocks for object instantiation of $class

// TODO: constructors
function newObject($class) {
  var output = [
    ["insert:at:ofList:", 100, "last", "$Memory"],
    ["insert:at:ofList:", $class.properties.length, "last", "$Memory"],
  ];

  $class.properties.forEach(function(property) {
    console.log(property[0].toString());
    output.push(["insert:at:ofList:", property[0].default(), "last", "$Memory"])
  });

  return output;
}

// actual interface to code generation
// TODO: actually do code generation here
module.exports = function(meow, ast) {
  // serialization test
  var Foo = new $Class("Foo", [
    [new $Type("int"), "foo"],
    [new $Type("float"), "bar"],
    [new $Type("string"), "baz"]
  ])

  meow.addScript(newObject(Foo));

  console.log(ast);
}
