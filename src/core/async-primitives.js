import { SPList, SPAtom } from './types.js';
import log from 'loglevel';

export const asyncPrimitives = {
    'delay': (ms, value) => 
        new Promise(resolve => setTimeout(() => resolve(value), ms)),
    
    'all': (promises) => 
        Promise.all(promises.map(p => p instanceof Promise ? p : Promise.resolve(p))),
    
    'race': (promises) => 
        Promise.race(promises.map(p => p instanceof Promise ? p : Promise.resolve(p))),
    
    'then': (promise, fn) => 
        promise instanceof Promise ? promise.then(fn) : fn(promise),
    
    'catch': (promise, fn) => 
        promise instanceof Promise ? promise.catch(fn) : promise,
    
    'chain': (value, ...fns) => 
        fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(value))
};