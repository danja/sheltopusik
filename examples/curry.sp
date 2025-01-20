[
  "define", "numbers", ["list", 1, 2, 3, 4, 5],
  
  ["define", "add3", 
    ["curry",
      ["lambda", ["x", "y", "z"], 
        ["+", ["+", "x", "y"], "z"]],
      3]],
  
  ["define", "multiply-by",
    ["lambda", ["n"],
      ["partial",
        ["lambda", ["x", "y"], ["*", "x", "y"]],
        "n"]]],
  
  ["define", "process-numbers",
    ["compose",
      ["partial", "map", ["multiply-by", 2]],
      ["partial", "filter", ["lambda", ["x"], [">", "x", 3]]]
    ]],
  
  ["process-numbers", "numbers"]
]