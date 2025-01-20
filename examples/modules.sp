[
  ["import", ["list", "factorial", "fibonacci"], "./modules/math.sp"],
  
  ["define", "numbers", ["list", 5, 6, 7]],
  
  ["define", "result",
    ["map",
      ["lambda", ["n"],
        ["list",
          ["factorial", "n"],
          ["fibonacci", "n"]]],
      "numbers"]],
  
  "result"
]