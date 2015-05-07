// lion's $Class
// internal compiler module

function $Class(name, properties, inheritance, isSprite, dependencies) {
  this.name = name;
  this.properties = properties;
  this.inheritance = inheritance;
  this.isSprite = isSprite;
  this.dependencies = dependencies;
}

module.exports = $Class;
