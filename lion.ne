main -> program {% id %}

program -> GlobalLine
          | program GlobalLine {% function(d) { return d[0].concat([d[1]]) } %}

GlobalLine -> ClassDeclaration _ {% id %}

ClassName -> SingleWord {% id %}
ClassDeclaration -> "class " ClassName _ "{" _ "}" {%
                    function(d) {
                      return ["class", d[1]];
                    }
                  %}

# define some axioms here

# _ is optional whitespace
_ -> null {% function(d) { return null } %}
    | [\s] _ {% function(d) { return null } %}

# SingleWord is exactly that
SingleWord -> [A-Za-z] {% id %}
            | SingleWord [A-Za-z] {% function(d) { return d[0] + "" + d[1]; } %}
