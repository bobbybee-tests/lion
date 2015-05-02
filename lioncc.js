var $meow = require("./meow");
var meow = $meow.instance();
var ListTuple = $meow.ListTuple;

var memory = new ListTuple("$Memory");
meow.lists.push(memory);

function $Type(string) {
  this.string = string;
}

$Type.prototype.toString = function() {
  return "[type "+this.string+"]";
}

$Type.prototype.default = function() {
  switch(this.string) {
    case "int": {
      return 0;
    }

    case "float": {
      return "0.0";
    }

    case "string": {
      return "";
    }

    default: {
      console.log("Unknown default for "+this.toString());
      return 0;
    }
  }
}

function $Class(name, properties) {
  this.name = name;
  this.properties = properties;
}

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

// serialization test
var Foo = new $Class("Foo", [
  [new $Type("int"), "foo"],
  [new $Type("float"), "bar"],
  [new $Type("string"), "baz"]
])

meow.addScript(newObject(Foo));

meow.upload(process.argv[3], 'v426', process.argv[4], process.argv[5]);
