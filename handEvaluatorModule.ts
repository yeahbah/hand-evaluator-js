const constants = require('./handEvaluatorConstants');

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

    private static BitCount(bitField: number): number {
        
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
        return (handValue >> constants.HANDTYPE_SHIFT);
    }

    private static topCard(handValue: number): number {
        return (handValue >> constants.TOP_CARD_SHIFT) & constants.CARD_MASK;
    }

    private static secondCard(handValue: number): number {
        return (handValue >> constants.SECOND_CARD_SHIFT) & constants.CARD_MASK;
    }

    private static thirdCard(handValue: number): number {
        return (handValue >> constants.THIRD_CARD_SHIFT) & constants.CARD_MASK;
    }

    private static fourthCard(handValue: number): number {
        return (handValue >> constants.FOURTH_CARD_SHIFT) & constants.CARD_MASK;
    }

    private static fifthCard(handValue: number): number {
        return (handValue >> constants.FIFTH_CARD_SHIFT) & constants.CARD_MASK;
    }
    
    private static handTypeValue(handType: HandTypes): number {
        return handType << constants.HANDTYPE_SHIFT;
    }

    public static descriptionFromHandValue(handValue: number): string {
        let result = [];

        const handType = <any>(HandTypes)[this.handType(handValue)];
        switch(handType) {
            case HandTypes.HighCard: 
                result.push('High card: ');
                result.push(constants.RANK_TABLE[this.topCard(handValue)]);
                break;
            case HandTypes.Pair:
                result.push('One pair, ');
                result.push(constants.RANK_TABLE[this.topCard(handValue)]);
                break;
            case HandTypes.TwoPair:
                result.push('Two Pair, ');
                result.push(constants.RANK_TABLE[this.topCard(handValue)]);
                result.push("'s with a ");
                result.push(constants.RANK_TABLE[this.secondCard(handValue)]);
                result.push(constants.RANK_TABLE[this.thirdCard(handValue)]);
                result.push(' for a kicket');
                break;
            case HandTypes.Trips:
                result.push('Three of a kind, ');
                result.push(constants.RANK_TABLE[this.topCard(handValue)]);
                result.push("'s");
                break;
            case HandTypes.Straight:
                result.push('A straight, ');
                result.push(constants.RANK_TABLE[this.topCard(handValue)]);
                result.push(' high');
                break;
            case HandTypes.Flush:
                result.push('A flush');
                result.push(constants.RANK_TABLE[this.topCard(handValue)]);
                result.push(' high');
                break;
            case HandTypes.FullHouse:
                result.push('A fullhouse, ');
                result.push(constants.RANK_TABLE[this.topCard(handValue)]);
                result.push("'s and ");
                result.push(constants.RANK_TABLE[this.secondCard(handValue)]);
                result.push("'s");
                break;
            case HandTypes.FourOfAKind:
                result.push('Four of a kind, ');
                result.push(constants.RANK_TABLE[this.topCard(handValue)]);
                result.push("'s");
                break;
            case HandTypes.StraightFlush:
                result.push('A straight flush');
                break;
        }

        return result.join('');
    }

    /**
     * Evaluates a hand and returns a descriptive string
     * @param cards : cards mask
     */
    public static DescriptionFromMask(cards: number): string {

    }
}


module.exports = { HandTypes, Hand, Suits }
