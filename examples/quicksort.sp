[
  "define", "quicksort",
  ["lambda", ["lst"],
    ["if", ["<", ["length", "lst"], 2],
      "lst",
      ["let", [["pivot", ["car", "lst"]],
               ["rest", ["cdr", "lst"]]],
        ["append",
          ["quicksort", ["filter", ["lambda", ["x"], ["<", "x", "pivot"]], "rest"]],
          [["pivot"]],
          ["quicksort", ["filter", ["lambda", ["x"], [">=", "x", "pivot"]], "rest"]]
        ]
      ]
    ]
  ],
  ["quicksort", [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]]
]