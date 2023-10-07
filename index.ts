// const handEvaluator = require('./handEvaluatorModule')
// const hand = handEvaluator.Hand;

import { type } from "os";


// let h = new hand();
// console.log(h.GetSomething('Hello'));

enum Test {
    One2 = 2,
    Two3 = 3,
    Three4 = 4
}

let testEnum: keyof typeof Test = 'One2';
testEnum = 'Two3';
console.log((<any>Test)["Two" + "2"]);