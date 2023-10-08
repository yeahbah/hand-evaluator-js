enum HandTypes {
    HighCard = 0,
    Pair = 1,
    TwoPair = 2,
    Trips = 3,
    Straight = 4,
    Flush = 5,
    FullHouse = 6,
    FourOfAKind = 7,
    StraightFlush = 8
}

enum Suits {
    Clubs = 0,
    Diamonds = 1,
    Hearts = 2,
    Spades = 3,   
}

enum Rank {
    Rank2 = 0,
    Rank3 = 1,
    Rank4 = 2,
    Rank5 = 3,
    Rank6 = 4,
    Rank7 = 5,
    Rank8 = 6,
    Rank9 = 7,
    RankTen = 8,
    RankJack = 9,
    RankQueen = 10,
    RankKing = 11,
    RankAce = 12,
    Joker = 51
}

const NUMBER_OF_CARDS = 52;
const NUMBER_OF_CARDS_WITH_JOKER = 53;
const HANDTYPE_SHIFT = 24;
const TOP_CARD_SHIFT = 16;
const TOP_CARD_MASK = 0x000F0000;
const SECOND_CARD_SHIFT = 12;
const SECOND_CARD_MASK = 0X0000F000;
const THIRD_CARD_SHIFT = 8;
const FOURTH_CARD_SHIFT = 4;
const FIFTH_CARD_SHIFT = 0;
const FIFTH_CARD_MASK = 0x0000000F;
const CARD_WIDTH = 4;
const CARD_MASK = 0x0F;

class Hand {
    private handmask: number;
    private pocket: string;
    private board: string;
    private handval: number;

    private _pocketCards: string;
    public get pocketCards(): string {
        return this._pocketCards;
    }

    public set pocketCards(value: string) {
        this._pocketCards = value;
    }

    constructor() {
        this.pocket = this.board = '';
    }

    private static nextCard(cards: string, index: { value: number }): number {

        while (index.value < cards.length && cards[index.value] == ' ') {
            index.value++;
        }

        if (index.value >= cards.length) {
            return -1;
        }

        if (index.value >= cards.length) return -2;
        
        let rank = 0;
        let card = cards[index.value++];
        switch (card) {
            case '1':
                try {
                    if (cards[index.value] === '0') {
                        index.value++;
                        rank = Rank.RankTen;
                    }
                } catch (error) {
                    console.log(error);
                    throw new Error('Bad hand string');
                }
                break;
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8': 
            case '9':
                rank = (<any>(Rank)[`Rank${card}`]);
                break;
            case 'T' || 't':
                rank = Rank.RankTen;
                break;
            case 'J' || 'j':
                rank = Rank.RankJack;
                break;
            case 'Q' || 'q':
                rank = Rank.RankQueen;
                break;
            case 'K' || 'k':
                rank = Rank.RankKing;
                break;
            case 'A' || 'a':
                rank = Rank.RankAce;
                break;
            
        }
        
        if (index.value >= cards.length) return -2;
        
        let suit = 0;        
        switch (cards[index.value++]) {
            case 'H': 
            case 'h':
                suit = Suits.Hearts;
                break;
            case 'D':
            case 'd':
                suit = Suits.Diamonds;
                break;
            case 'C': 
            case 'c':
                suit = Suits.Clubs;
                break;
            case 'S':
            case 's':
                suit = Suits.Spades;
                break;
        }
        
        console.log(`rank: ${rank}, suit: ${suit}`);    
        return rank + (suit * 13);

    }
    
    /**
     * This function takes a string representing a full or partial holdem mask and
     * validates that the text represents valid cards and that no card is duplicated.
     * @param hand Poker hand in text format e.g. 2c Js
     * @returns 
     */
    public static validateHand(hand: string): boolean;
    public static validateHand(hand: string, board?: string): boolean {
        if (hand === undefined) return false;

        if (board != undefined) {
            hand += ` ${board}`;
        }
        let index = { value: 0 };
        let handmask = 0;
        let cards = 0;
        let card = 0;

        try {
            for (card = this.nextCard(hand, index); card >= 0; card = this.nextCard(hand, index)) {
                if ((handmask & (1 << card)) != 0) {
                    return false;
                }
                handmask |= 1 << card;                
                cards++;
            }    
            return card == -1 && cards > 0 && index.value >= hand.length;
        } catch (error) {
            console.error(error)
            return false;
        }
    }

    /**
     * Parses the passed pocket cards and board and produces a card mask
     * 
     * let handMask = Hand.ParseHand(mask);
     * let handVal = Hand.Evaludate(handMask, 7);
     * let handDescription = Hand.DescriptionFromHandValue(handVal); 
     * 
     * @param mask string description of a mask
     */
    public static parseHand(hand: string): number;    
    public static parseHand(hand: string, board?: string, numCards = { value: 0}): number {
        let index = { value: 0 };
        let handMask = 0;

        hand = hand.trim();
        if (hand.length == 0) {
            return 0;
        }
        hand = board != undefined ? `${hand} ${board}` : hand;

        for (let card = this.nextCard(hand, index); card >=0; card = this.nextCard(hand, index)) {
            handMask |= 1 << card;
            numCards.value++;
        }
        return handMask;
    }

    /**
     * Reads a string definition of a card and returns the card value
     * @param card: the card
     * @returns card value
     */
    public static parseCard(card: string): number {
        return this.nextCard(card, { value: 0 })
    }

    /**
     * Given a card value, returns its rank
     * @param card value
     * @returns card rank
     */
    public static cardRank(card: number): number {
        return card % 13;
    }

    /**
     * Given a card value, return its suit
     * @param card the card
     */
    public static cardSuit(card: number): number {
        return card / 13;
    }

    public static handType(handValue: number): number {
        return (handValue >> HANDTYPE_SHIFT);
    }

    public static descriptionFromHandValue(handValue: number): string {
        let result = [];

        switch(<any>(HandTypes)[this.handType(handValue)]) {
            case HandTypes.HighCard: result.push('High card: ')
        }
    }
}


module.exports = { HandTypes, Hand, Suits }
