var $meow = require("./meow");
var meow = $meow.instance();
var ListTuple = $meow.ListTuple;

var memory = new ListTuple("$Memory");
meow.lists.push(memory);

meow.upload(process.argv[3], 'v426', process.argv[4], process.argv[5]);

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

function newObject($class) {
  console.log($class);
}
