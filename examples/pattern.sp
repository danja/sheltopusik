[
  "define", "log-data",
  "2024-01-20 10:15:30 INFO User logged in
   2024-01-20 10:15:35 ERROR Database connection failed
   2024-01-20 10:15:40 INFO Connection restored",

  ["define", "extract-errors",
    ["compose-n",
      ["lambda", ["matches"],
        ["map",
          ["lambda", ["line"],
            ["str-extract", "line", "ERROR.*$"]],
          "matches"]],
      ["lambda", ["text"],
        ["str-split-by-regex", "text", "\n"]]]],
  
  ["extract-errors", "log-data"]
]