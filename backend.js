// lioncc backend
// performs actual code generation functionality
// internal compiler module

var $Class = require("./$Class");
var $Type = require("./$Type");

var classLookup = {};

// interface to code generation
module.exports = function(meow, ast) {

  ast.forEach(function(global) {
    console.log(global);
    if(global[0] == "class") {
      // TODO: functions, short + long

      var propertyList = [];

      global[3].forEach(function(bit) {
          if(bit) {
            if(bit[0] == "declaration") {
              propertyList.push([new $Type(bit[1]), bit[2]]);

              // TODO: initialization values
            } else if(bit[0] == "shortfunction") {
              // TODO: implement
              console.log(bit);
            } else if(bit[0] == "function") {
              meow.addScript(compileFunction(bit));
            } else {
              die("Unknown bit type "+bit[0]);
            }
          }
      });

      // TODO: inheritance
      classLookup[global[1]] = new $Class(global[1], propertyList);
    } else {
      die("Unknown global command" + global[0])
    }
  })
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

function compileFunction(functionSpec) {
  // TODO: parameters to functions
  // TODO: mangling names

  var blockSpec = functionSpec[2];
  var paramNames = [];
  var defaults = [];

  var atomic = false;

  var output = [
    ["procDef", blockSpec, paramNames, defaults, atomic]
  ]

  output = output.concat(compileBody(functionSpec[4]));

  return output;
}

function compileBody(body) {
  var output = [];

  body.forEach(function(line) {
    if(line[0] == "declaration") {
      // TODO: declaration
    } else {
      die("Unknown body line type "+line[0]);
    }
  });

  return output;
}

function die(message) {
  console.error(message);
  process.exit(-1);
}
