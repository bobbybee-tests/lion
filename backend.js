// lioncc backend
// performs actual code generation functionality
// internal compiler module

var $Class = require("./$Class");
var $Type = require("./$Type");

var functionLookup = {};
var classLookup = {};

// interface to code generation
module.exports = function(meow, ast) {

  ast.forEach(function(global) {
    console.log(global);
    if(global[0] == "class") {
      // TODO: functions, short + long

      var propertyList = [];
      var prefix = {
        className: global[1],
        inheritance: global[2],
        functionDefs: [],
      }

      global[3].forEach(function(bit) {
          if(bit) {
            if(bit[0] == "declaration") {
              propertyList.push([new $Type(bit[1]), bit[2]]);

              // TODO: initialization values
            } else if(bit[0] == "shortfunction") {
              // TODO: implement
              console.log(bit);
            } else if(bit[0] == "function") {
              prefix.functionDefs.push({
                name: bit[2],
                return: bit[1]
              });

              propertyList.push({
                name: bit[2],
                return: bit[1]
              });

              meow.addScript(compileFunction(prefix, bit));
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

function calcBlockSpec(prefix, functionName, paramCount) {
  return prefix +
          "::" +
          functionName +
          (Array(paramCount+1)).join(" %s");
}

function compileFunction(prefix, functionSpec) {
  // TODO: parameters to functions
  // TODO: mangling names

  var blockSpec = prefix.className + "::" + functionSpec[2];
  var paramNames = [];
  var defaults = [];

  functionSpec[3].forEach(function(p) {
    if(p) {
      paramNames.push(p);
      defaults.push("");
      blockSpec += " %s";
    }
  });

  var atomic = false;

  var output = [
    ["procDef", blockSpec, paramNames, defaults, atomic]
  ]

  output = output.concat(compileBody(functionSpec[4], prefix));

  console.log(functionSpec);

  return output;
}

function compileBody(body, currentClass) {
  var output = [];

  body.forEach(function(line) {
    if(line && line[0]) {
      if(line[0] == "declaration") {
        // TODO: declaration
      } else if(line[0] == "call") {
        // TODO: function calls
        output.push(compileFunctionCall(currentClass, line));
      } else if(line[0] == "asm") {
        output.push(JSON.parse(line[1]));
      } else {
        die("Unknown body line type "+line[0]);
      }
    }
  });

  return output;
}

function compileFunctionCall(prefix, call) {
  // TODO: proper Sprite and Stage inheritance

  //if(call[1] == "playSound") {
  //  return ["playSound:", call[2][0]];
  //}

  // TODO: implement function calls
  // atm, this breaks for nonatomic types, return values, etc.

  console.log("Function Call: ");
  console.log(classLookup);
  console.log(call);
  console.log(prefix);

  // find the nearest class that owns us
  var blockName = call[1];
  var searching = true;

  for(var j = 0; j < prefix.functionDefs.length; ++j) {
    if(prefix.functionDefs[j].name == call[1]) {
      blockName = prefix.className;
      searching = false;
      break;
    }
  }

  var searchClass = prefix;

  while(searching) {
      var searcher;

      if(searchClass.inheritance) {
        searcher = searchClass.inheritance;
      } else {
        searching = false;
        console.error("Cannot find inheritable path for "+call);
        break;
      }

      var classToSearch = classLookup[searcher];

      for(var i = 0; i < classToSearch.properties.length; ++i) {
        if(classToSearch.properties[i].name == call[1]) {
          blockName = searcher;
          searching = false;
          break;
        }
      }

      searchClass = classToSearch;
  }

  var blockSpec = calcBlockSpec(blockName, call[1], call[2].length);

  return ["call", blockSpec].concat(call[2]);
}

function die(message) {
  console.error(message);
  process.exit(-1);
}
