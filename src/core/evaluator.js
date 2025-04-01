handleLambda([params, bodyOrReturnType, maybeBody, ...restOfBody], env) {
    let body;
    let returnType = null;
    let bodies = [];

    // Handle different arities and type annotations
    if (maybeBody !== undefined) {
        // Case with return type annotation
        if (restOfBody && restOfBody.length > 0) {
            // Multiple expressions in the body with a return type
            bodies = [bodyOrReturnType, maybeBody, ...restOfBody];
            returnType = null; // No return type in this case
        } else {
            // Single body with return type
            body = maybeBody;
            returnType = bodyOrReturnType;
        }
    } else {
        // Simple case - one expression body with no return type
        body = bodyOrReturnType;
    }
    
    const fn = (...args) => {
        // Create a new environment extending the lexical environment
        const newEnv = env.extend(params, args);
        
        // Type check arguments if type annotations exist
        if (fn.type) {
            TypeChecker.checkFunctionParams(fn, args, 'Lambda');
        }
        
        let result;
        
        if (bodies.length > 0) {
            // Evaluate multiple expressions in sequence, return the last one
            for (let i = 0; i < bodies.length - 1; i++) {
                this.eval(bodies[i], newEnv);
            }
            result = this.eval(bodies[bodies.length - 1], newEnv);
        } else {
            // Simple case - evaluate the single body expression
            result = this.eval(body, newEnv);
        }
        
        // Type check return value if return type is specified
        if (returnType) {
            const evaledReturnType = this.eval(returnType, env);
            if (evaledReturnType && typeof evaledReturnType.check === 'function' && 
                !evaledReturnType.check(result)) {
                throw new TypeError(`Return value must be of type ${evaledReturnType.name}, got ${typeof result}.`);
            }
        }
        
        return result;
    };
    
    fn.isLambda = true;
    return fn;
}