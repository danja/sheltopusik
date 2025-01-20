[
  ["define", "numbers", ["range", 1, 10]],
  ["define", "letters", ["list", "a", "b", "c"]],
  
  ["define", "combinations",
    ["lambda", ["nums", "chars"],
      ["fold-left",
        ["lambda", ["acc", "n"],
          ["append", "acc",
            ["map",
              ["lambda", ["c"],
                ["list", "n", "c"]],
              "chars"]]],
        ["list"],
        "nums"]]],
  
  ["define", "matrix-transpose",
    ["lambda", ["matrix"],
      ["fold-right",
        ["lambda", ["row", "acc"],
          ["zip", "row", "acc"]],
        ["take", 1, ["car", "matrix"]],
        ["cdr", "matrix"]]]],
  
  ["define", "result",
    ["compose-n",
      ["partial", "filter",
        ["lambda", ["pair"],
          ["and",
            [">", ["car", "pair"], 5],
            ["str=?", ["car", ["cdr", "pair"]], "a"]]]],
      ["partial", "combinations", "numbers", "letters"]]],
  
  "result"
]