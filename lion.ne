@{%
  function doubleid(d) {
    return d[0][0];
  }
%}

@{%
  function dsconcat(d) {
    return d[0].concat([d[d.length - 1]]);
  }
%}

main -> program {% id %}

program -> GlobalLine
          | program GlobalLine {% dsconcat %}

GlobalLine -> ClassDeclaration _ {% id %}

ClassName -> SingleWord {% id %}
ClassDeclaration -> "class " ClassName _ "{" ClassBody "}" {%
                    function(d) {
                      return ["class", d[1], null, d[4]];
                    }
                  %} |
                  "class " ClassName " :" _ ClassName _ "{" ClassBody "}" {%
                    function(d) {
                      return ["class", d[1], d[4], d[7]];
                    }
                  %}
ClassBodyLine -> Declaration _ {% id %}
                | ShortFunctionDeclaration _ {% id %}
                | FunctionDeclaration _ {% id %}
                | "@staticsprite" _

ClassBody ->  _ |
              ClassBodyLine |
              ClassBody ClassBodyLine {% dsconcat %}

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

FunctionCall -> FunctionName "(" TypelessParameterList ")" {%
                  function(d) {
                    return ["call", d[0], d[2]]
                  }
                %}
TypelessParameterList -> _ |
                        TypelessParameter |
                        TypelessParameterList "," _ TypelessParameter {% dsconcat %}
TypelessParameter -> Value {% id %}

FunctionName -> SingleWord {% id %}
ParameterList -> _ |
                Parameter |
                ParameterList "," _ Parameter {% dsconcat %}
Parameter -> TypeName " " VariableName {% function(d) { return d[0], d[2] } %}

ShortFunctionDeclaration -> TypeName " " FunctionName "(" ParameterList ")" ";" {%
                            function(d) {
                              return ["shortfunction", d[0], d[2], d[4]];
                            }
                          %}
FunctionDeclaration -> TypeName " " FunctionName "(" ParameterList ")" _ "{" FunctionBody "}" _ ";" {%
                        function(d) {
                          return ["function", d[0], d[2], d[4], d[8]]
                        }
                      %}
FunctionBody -> Block {% id %}

Block -> _ |
        BlockLine |
        Block BlockLine {% dsconcat %}

BlockLine -> Declaration _ {% id %}
            | FunctionCall ";" _ {% id %}
            | ASM ";" _ {% id %}

AtomicType -> "int" | "string" | "float" | "void"
TypeName -> AtomicType {% doubleid %}

ASM -> "__asm__(" String ")" {% function(d) { return ["asm", d[1]]} %}

# define some axioms here

# _ is optional whitespace
_ -> null {% function(d) { return null } %}
    | [\s] _ {% function(d) { return null } %}

# SingleWord is exactly that
SingleWord -> [A-Za-z] {% id %}
            | SingleWord [A-Za-z0-9] {% function(d) { return d[0] + "" + d[1]; } %}

# TODO: arithmetic, etc.
Value -> SingleWord {% id %}
        | String {% id %}
String -> "\"" StringValue "\"" {% function(d) { return d[1] } %}
StringValue -> [A-Za-z0-9 [\]':,] {% id %}
              | StringValue [A-Za-z0-9 [\]':,] {% function(d) { return d[0] + d[1]; } %}
              | StringValue "\\\"" {% function(d) { return d[0] + "\""} %}
