[
  "define", "quicksort",
  ["lambda", ["lst"],
    ["if", ["<", ["length", "lst"], 2],
      "lst",
      ["append",
        ["quicksort", ["filter", ["lambda", ["x"], ["<", "x", ["car", "lst"]]], ["cdr", "lst"]]],
        ["list", ["car", "lst"]],
        ["quicksort", ["filter", ["lambda", ["x"], [">=", "x", ["car", "lst"]]], ["cdr", "lst"]]]
      ]
    ]
  ],
  ["quicksort", ["list", 3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]]
]