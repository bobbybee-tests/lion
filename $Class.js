// lion's $Class
// internal compiler module

function $Class(name, properties, inheritance, isSprite, dependencies, heapLength) {
  this.name = name;
  this.properties = properties;
  this.inheritance = inheritance;
  this.isSprite = isSprite;
  this.dependencies = dependencies;
  this.heapLength = heapLength;
}

module.exports = $Class;
