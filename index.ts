//const handEvaluator = require('./handEvaluatorModule')
import Hand from './handEvaluatorModule';
const evaluator = Hand;

console.log(Hand);

let hand = 'As Ad';
let board = 'Ah 2s 3s';
console.log(evaluator.validateHand(hand, board))


// const handMask = evaluator.parseHand(hand +' '+board);
// const handVal = evaluator.evaluate(handMask, 5);
// const handDescription = evaluator.descriptionFromHandValue(handVal);
// console.log(handDescription);


// const Suits = handEvaluator.Suits;

// let suit = 0;

// let index = { value: 1 };
// let cards = hand;
// switch (cards[index.value++]) {
//     case 'H': 
//     case 'h':
//         suit = Suits.Hearts;
//         break;
//     case 'D':
//     case 'd':
//         suit = Suits.Diamonds;
//         break;
//     case 'C': 
//     case 'c':
//         suit = Suits.Clubs;
//         break;
//     case 'S':
//     case 's':
//         suit = Suits.Spades;
//         break;
// }

// console.log(suit);
// console.log(index.value)