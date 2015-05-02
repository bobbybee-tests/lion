// lion's $Type
// internal compiler module

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

module.exports = $Type;
