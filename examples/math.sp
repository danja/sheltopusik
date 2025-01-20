[
  ["define", "factorial",
    ["lambda", ["n"],
      ["if", ["=", "n", 0],
        1,
        ["*", "n", ["factorial", ["-", "n", 1]]]]]],

  ["define", "fibonacci",
    ["lambda", ["n"],
      ["if", ["<", "n", 2],
        "n",
        ["+",
          ["fibonacci", ["-", "n", 1]],
          ["fibonacci", ["-", "n", 2]]]]]],

  ["export", "factorial", "factorial"],
  ["export", "fibonacci", "fibonacci"]
]