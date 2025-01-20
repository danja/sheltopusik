[
  "define", "numbers", ["list", 1, 2, 3, 4, 5],
  
  ["define", "double", ["lambda", ["x"], ["*", "x", 2]]],
  ["define", "add-one", ["lambda", ["x"], ["+", "x", 1]]],
  ["define", "square", ["lambda", ["x"], ["*", "x", "x"]]],
  
  ["define", "transform",
    ["compose-n",
      "square",
      "add-one",
      "double"]],
  
  ["map", "transform", "numbers"]
]