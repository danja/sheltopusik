# sheltopusik

A toy language in the style of Lisp in node JavaScript written mostly by Claude AI.

Named so you will forget it.

Syntax is JSON. Fibonacci works, Quicksort doesn't.

json```
[
  "define", "fib",
  ["lambda", ["n"],
    ["if", ["<", "n", 2],
      "n",
      ["+",
        ["fib", ["-", "n", 1]],
        ["fib", ["-", "n", 2]]
      ]
    ]
  ],
  ["fib", 10]
]
```

```sh
./sp examples/fibonacci.sp
55
```

