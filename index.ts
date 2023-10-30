//const handEvaluator = require('./handEvaluatorModule')
import Hand from './handEvaluatorModule';
const evaluator = Hand;

console.log(Hand);

let hand = 'As Ad';
let board = 'Ah 2s 3s';
//console.log(evaluator.validateHand(hand, board))


let numCards = { value: 0 };
const handMask = evaluator.parseHand(hand, numCards, board);
console.log(handMask);
console.log(numCards)

const handVal = evaluator.evaluate(handMask, numCards.value);
console.log(`hand value: ${handVal}`);
const handDescription = evaluator.descriptionFromHandValue(handVal);
console.log(handDescription);


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