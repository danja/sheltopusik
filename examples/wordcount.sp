[
  ["define", "text", 
    "The quick brown fox jumps over the lazy dog. The dog sleeps."],

  ["define", "make-map", ["lambda", [], ["hash-map"]]],

  ["define", "update-count", 
    ["lambda", ["map", "key"],
      ["hash-set", "map", "key",
        ["+", 
          ["if", ["null?", ["hash-get", "map", "key"]], 
            0, 
            ["hash-get", "map", "key"]], 
          1]]]],

  ["define", "count-words",
    ["lambda", ["text"],
      ["reduce",
        ["lambda", ["acc", "word"],
          ["update-count", "acc", ["str-lower", "word"]]],
        ["make-map"],
        ["str-split-by-regex", "text", "\\s+"]]]],

  ["define", "result", ["count-words", "text"]],

  ["define", "print-frequencies",
    ["lambda", ["freqs"],
      ["map",
        ["lambda", ["entry"],
          ["list", ["car", "entry"], ["cdr", "entry"]]],
        ["hash-entries", "freqs"]]]],

  ["print-frequencies", "result"]
]