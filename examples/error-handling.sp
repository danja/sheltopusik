[
  ["define", "safe-divide",
    ["lambda", ["x", "y"],
      ["if", ["=", "y", 0],
        ["error", "Division by zero"],
        ["/", "x", "y"]]]],
  
  ["define", "try-catch",
    ["lambda", ["thunk", "handler"],
      ["try",
        ["thunk"],
        ["handler"]]]],
  
  ["define", "process-numbers",
    ["lambda", ["nums", "divisor"],
      ["map",
        ["lambda", ["n"],
          ["try-catch",
            ["lambda", [], ["safe-divide", "n", "divisor"]],
            ["lambda", ["err"], ["str-concat", "Error: ", "err"]]]],
        "nums"]]],
  
  ["process-numbers", 
    ["list", 10, 20, 30, 40], 
    0]
]