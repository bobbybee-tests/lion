@{%
  function doubleid(d) {
    return d[0][0];
  }
%}

main -> program {% id %}

program -> GlobalLine
          | program GlobalLine {% function(d) { return d[0].concat([d[1]]) } %}

GlobalLine -> ClassDeclaration _ {% id %}

ClassName -> SingleWord {% id %}
ClassDeclaration -> "class " ClassName _ "{" ClassBody "}" {%
                    function(d) {
                      return ["class", d[1], d[4]];
                    }
                  %}
ClassBodyLine -> Declaration _ {% id %}
ClassBody ->  _ |
              ClassBodyLine |
              ClassBody ClassBodyLine {% function(d) { return d[0].concat([d[1]])} %}

VariableName -> SingleWord {% id %}
Declaration -> TypeName " " VariableName ";" {%
                function(d) {
                  return ["declaration", d[0], d[2], null]
                }
              %} |
              TypeName " " VariableName _ "=" _ Value ";" {%
                function(d) {
                  return ["declaration", d[0], d[2], d[6]]
                }
              %}

AtomicType -> "int" | "string" | "float"
TypeName -> AtomicType {% doubleid %}

# define some axioms here

# _ is optional whitespace
_ -> null {% function(d) { return null } %}
    | [\s] _ {% function(d) { return null } %}

# SingleWord is exactly that
SingleWord -> [A-Za-z] {% id %}
            | SingleWord [A-Za-z0-9] {% function(d) { return d[0] + "" + d[1]; } %}
