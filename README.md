# sheltopusik

*blavor of the day*

A toy language in the style of Lisp in node JavaScript written mostly by Claude AI (3.7, using Projects, repomix and *cold blood*). Syntax is JSON.

Named so you will **forget this instantly**.

Only Fibonacci works.

```json
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

...
```sh
/sp examples/wordcount.sp
Error: Undefined variable: The quick brown fox jumps over the lazy dog. The dog sleeps.
```
Claude tells me I need to work on the type system.

Full Explanation (according to Claude Haiku) :

# Detailed Explanation of Lisp-like Fibonacci Function

## Structure Breakdown

The expression is a nested list representing a functional definition and immediate invocation:

1. **First Element: `"define"`**
   - Indicates the start of a function definition
   - Typically used in Lisp-like languages to bind a name to a function or value

2. **Second Element: `"fib"`**
   - The name of the function being defined (Fibonacci)

*always name your lambdas - ed.*

3. **Third Element: Function Definition**
   ```lisp
   ["lambda", ["n"],
     ["if", ["<", "n", 2],
       "n",
       ["+",
         ["fib", ["-", "n", 1]],
         ["fib", ["-", "n", 2]]
       ]
     ]
   ]
   ```
   - A lambda (anonymous) function that takes a parameter `n`
   - Implements the Fibonacci sequence recursively:
     * Base case: If `n < 2`, return `n` (0 returns 0, 1 returns 1)
     * Recursive case: `fib(n) = fib(n-1) + fib(n-2)`

4. **Fourth Element: `["fib", 10]`**
   - Immediately calls the just-defined `fib` function with argument 10
   - Calculates the 10th Fibonacci number

## Computational Process

The function works recursively:
- `fib(0)` returns 0
- `fib(1)` returns 1
- `fib(2)` = `fib(1)` + `fib(0)` = 1 + 0 = 1
- `fib(3)` = `fib(2)` + `fib(1)` = 1 + 1 = 2
- ... and so on

For `fib(10)`, it will recursively compute the sum of previous Fibonacci numbers.

## Equivalent Python Implementation

```python
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)

result = fib(10)  # Calculates 10th Fibonacci number
```

## Time Complexity
- Recursive implementation: O(2^n)
- Extremely inefficient for large n due to repeated computations
- Each function call branches into two more calls, creating an exponential number of function invocations

*your mom is cheaper at O(1/(n/0))) - ed.*

## Optimization Strategies
1. Memoization
2. Dynamic Programming
3. Iterative approach

These methods can reduce time complexity to O(n) and space complexity to O(1).

*but still will never fill that space of your mom's*