describe('nested lexical scoping', () => {
    it('should handle nested defines with proper lexical scoping', () => {
        // Define a function that creates a counter with proper closure
        const defineFn = parser.parse([
            'define', 'make-counter', 
            ['lambda', [], 
                ['let', [['count', 0]], 
                    ['lambda', [], 
                        ['define', 'count', ['+', 'count', 1]],
                        'count'  // Explicitly return the updated count
                    ]
                ]
            ]
        ]);
        interpreter.evaluator.eval(defineFn);
        
        // Create a counter
        const createCounter = parser.parse(['make-counter']);
        const counter = interpreter.evaluator.eval(createCounter);
        
        // Call the counter multiple times
        expect(counter()).toBe(1);
        expect(counter()).toBe(2);
        expect(counter()).toBe(3);
        
        // Create another counter, it should be independent
        const counter2 = interpreter.evaluator.eval(createCounter);
        expect(counter2()).toBe(1);
        expect(counter()).toBe(4); // The first counter continues from where it left off
    });
});