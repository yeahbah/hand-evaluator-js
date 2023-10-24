//import { isContinueStatement } from 'typescript';
import { constants } from './handEvaluatorConstants';
import { HandTypes, Suits, Rank } from './handEvaluatorEnums';

export default class Hand {
    private handmask: number;
    private pocket: string;
    private board: string;
    //private handval: number;

    private _pocketCards: string;

    constructor() {
        this.pocket = this.board = '';
    }

    public get pocketCards(): string {
        return this._pocketCards;
    }

    public set pocketCards(value: string) {
        this._pocketCards = value;
    }

    public get maskValue(): number {
        return this.handmask;
    }

    public get pocketMask(): number {
        return Hand.parseHand(this.pocketCards);
    }

    // public set pocketMask(value: number) {
    //     this.pocketCards = this.maskToString(value);
    // }    

    private static bitCount(bitField: any): number {
        const result = constants.BITS_TABLE[bitField & 0x1FFF]
            + constants.BITS_TABLE[(bitField >> 13) & 0x1FFF]
            + constants.BITS_TABLE[(bitField >> 26) & 0x1FFF]
            + constants.BITS_TABLE[(bitField >> 39) & 0x1FFF];
        return result;
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
        let handmask = BigInt(0);
        let cards = 0;
        let card = 0;

        try {
            for (card = this.nextCard(hand, index); card >= BigInt(0); card = this.nextCard(hand, index)) {
                if ((handmask & (BigInt(1) << BigInt(card))) != BigInt(0)) {
                    return false;
                }
                handmask |= BigInt(1) << BigInt(card);                
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
    //public static parseHand(hand: string): number;    
    public static parseHand(hand: string, numCards = { value: 0 }, board?: string): bigint {
        let index = { value: 0 };
        let handMask = BigInt(0);

        hand = hand.trim();        
        if (hand.length == 0) {
            return BigInt(0);
        }
        hand = board != undefined ? `${hand} ${board}` : hand;        

        let card = 0;
        for (card = this.nextCard(hand, index); card >=0; card = this.nextCard(hand, index)) {            
            handMask |= BigInt(1) << BigInt(card);
            console.log(handMask);
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
        console.log(handType)
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
     * Evaluates a mask (passed as a string) and returns a mask value.
     * A mask value can be compared against another mask value to
     * determine which has the higher value.
     * @param mask mask string
     * @returns Hand value bit field
     */
    public static evaluateMask(mask: string): number {        
        return Hand.evaluate(Hand.parseHand(mask, { value: 0 }));
    }

    /**
     * Evaluates a mask (passed as a mask mask) and returns a mask value.
     * A mask value can be compared against another mask value to
     * determine which has the higher value.
     * @param cards: cards mask
     * @param numCards : number of cards in the mask
     */
    public static evaluate(cards: bigint): bigint;
    public static evaluate(cards: bigint, numCards?: number): bigint {
        numCards = numCards ?? this.bitCount(cards);
        let result = BigInt(0);

        const sc = (cards >> constants.CLUB_OFFSET) & BigInt(0x1FFF);
        const sd = (cards >> constants.DIAMOND_OFFSET) & BigInt(0x1FFF);
        const sh = (cards >> constants.HEART_OFFSET) & BigInt(0x1FFF);
        const ss = (cards >> constants.SPADE_OFFSET) & BigInt(0x1FFF);

        const ranks = sc | sd | sh | ss;
        const ranksNumber = Number(ranks);

        const nRanks = constants.BITS_TABLE[Number(ranks)];
        const nDups = (numCards - nRanks);

        // Check for straight, flush, or straight flush, and return if we can
        // determine immediately that this is the best possible mask
        if (nRanks >= 5) {
            const ssNumber = Number(ss);
            const scNumber = Number(sc);
            const sdNumber = Number(sd);
            const shNumber = Number(sh);
            if (constants.BITS_TABLE[ssNumber] >= 0) {
                if (constants.STRAIGHT_TABLE[ssNumber] != 0) {
                    var ret = constants.HANDTYPE_VALUE_STRAIGHTFLUSH + constants.STRAIGHT_TABLE[ssNumber] << constants.TOP_CARD_SHIFT;            
                    return BigInt(ret);
                } else {
                    var ret = constants.HANDTYPE_VALUE_FLUSH + constants.TOP_FIVE_CARDS_TABLE[ssNumber];
                    return BigInt(ret);
                }
            } else if (constants.BITS_TABLE[scNumber] >= 5) {
                if (constants.STRAIGHT_TABLE[scNumber] != 0) {
                    var ret = constants.HANDTYPE_VALUE_STRAIGHTFLUSH + constants.STRAIGHT_TABLE[scNumber] << constants.TOP_CARD_SHIFT;                    
                    return BigInt(ret);
                } else {
                    var ret = constants.HANDTYPE_VALUE_FLUSH + constants.TOP_FIVE_CARDS_TABLE[scNumber];
                    return BigInt(ret);
                }
            } else if (constants.BITS_TABLE[sdNumber] >= 5) {
                if (constants.STRAIGHT_TABLE[sdNumber] != 0) {
                    var ret = constants.HANDTYPE_VALUE_STRAIGHTFLUSH + constants.STRAIGHT_TABLE[sdNumber] << constants.TOP_CARD_SHIFT;
                    return BigInt(ret);
                } else {
                    var ret = constants.HANDTYPE_VALUE_FLUSH + constants.TOP_FIVE_CARDS_TABLE[sdNumber];
                    return BigInt(ret);
                }
            } else if (constants.BITS_TABLE[shNumber] >= 5) {
                if (constants.STRAIGHT_TABLE[shNumber] != 0) {
                    var ret = constants.HANDTYPE_VALUE_STRAIGHTFLUSH + constants.STRAIGHT_TABLE[shNumber] << constants.TOP_CARD_SHIFT;
                    return BigInt(ret);
                } else {
                    var ret = constants.HANDTYPE_VALUE_FLUSH + constants.TOP_FIVE_CARDS_TABLE[shNumber];
                    return BigInt(ret);
                }
            } else {
                const st = constants.STRAIGHT_TABLE[ranksNumber];
                if (st != 0) {
                    var ret = constants.HANDTYPE_VALUE_STRAIGHT + (st << constants.TOP_CARD_SHIFT);
                    return BigInt(ret);
                }        
         
            }
        
            //    Another win -- if there can't be a FH/Quads (n_dups < 3), 
            //    which is true most of the time when there is a made mask, then if we've
            //    found a five card mask, just return.  This skips the whole process of
            //    computing two_mask/three_mask/etc.
            if (result != BigInt(0) && nDups < 3) {
                return result;
            }
        }
        
        // By the time we're here, either:
        // 1. There's no five-card mask possible (flush or straight) or
        // 2. There's a flush or straight, but we know that there are enough duplicates
        //    to make a full house / quads possible.        
        switch (nDups) {
            case 0:
                var ret = constants.HANDTYPE_VALUE_HIGHCARD + constants.TOP_FIVE_CARDS_TABLE[ranksNumber];
                return BigInt(ret);
            case 1:
                var twoMask = ranks ^ (sc ^ sd ^ sh ^ ss);
                result = BigInt(constants.HANDTYPE_VALUE_PAIR + constants.TOP_CARD_TABLE[Number(twoMask)] << constants.TOP_CARD_SHIFT);
                
                // Only one bit set in twoMask
                var t = ranks ^ twoMask;

                // get the top five cards in what is left, drop all but the top three
                // cards, and shift them by one to get the three desired kickers
                const kickers = BigInt(constants.TOP_FIVE_CARDS_TABLE[Number(t)] >> constants.CARD_WIDTH & ~constants.FIFTH_CARD_MASK);
                result += kickers;
                return result;
                
            case 2:
                // either two pair or trips
                var twoMask = ranks ^ (sc ^ sd ^ sh ^ ss);                
                if (twoMask != BigInt(0)) {
                    var t = ranks ^ twoMask; // exactly two bits set in twoMask                                        
                    var ret = constants.HANDTYPE_VALUE_TWOPAIR
                        + (constants.TOP_FIVE_CARDS_TABLE[Number(twoMask)] & (constants.TOP_CARD_MASK | constants.SECOND_CARD_MASK))
                        + (constants.TOP_CARD_TABLE[Number(t)] << constants.THIRD_CARD_SHIFT);
                    return BigInt(result);
                } else {
                    var threeMask = ((sc & sd) | (sh & ss)) & ((sc &sh) | (sd & ss));
                    const threeMaskNumber = Number(threeMask);
                    result = constants.HANDTYPE_VALUE_TRIPS + (constants.TOP_CARD_TABLE[threeMaskNumber] << constants.TOP_CARD_SHIFT);
                    var t = ranks ^ threeMask; // only one bit set in threeMask
                    var second = constants.TOP_CARD_TABLE[Number(t)];
                    result += (second << constants.SECOND_CARD_SHIFT);
                    t ^= BigInt(1) << BigInt(second);
                    result += constants.TOP_CARD_TABLE[Number(t)] << constants.THIRD_CARD_SHIFT;
                    return result;
                }

            default:
                // Possible quads, fullhouse, straight or flush or two pair
                var fourMask = sh & sd & sc & ss;                
                if (fourMask != BigInt(0))
                {
                    const tc = BigInt(constants.TOP_CARD_TABLE[Number(fourMask)]);
                    result = BigInt(constants.HANDTYPE_VALUE_FOUR_OF_A_KIND)
                        + tc << BigInt(constants.TOP_CARD_SHIFT)
                        + (BigInt((constants.TOP_CARD_TABLE[Number(ranks ^ (BigInt(1) << tc))])) << BigInt(constants.SECOND_CARD_SHIFT));
                    return result;
                }

                // Technically, threeMask as defined below is really the set of
                // bits which are set in three or four of the suits, but since
                // we've already eliminated quads, this is ok
                // similarly, twoMask is really two_or_four_mask, but since
                // we've already eliminated quads, we can use this shortcut
                var twoMask = ranks ^ (sc ^ sd ^ sh ^ ss);
                if (constants.BITS_TABLE[twoMask] != nDups)
                {
                    // Must be some trips then, which really means there is a
                    // full house since nDups >= 3
                    var threeMask = ((sc & sd) | (sh & ss) & (sc & sh) | (sd & ss));
                    result = constants.HANDTYPE_VALUE_FULLHOUSE;
                    var tc = constants.TOP_CARD_TABLE[threeMask];
                    result += tc << constants.TOP_CARD_SHIFT;
                    var t = (twoMask | threeMask) ^ (1 << tc);
                    result += constants.TOP_CARD_TABLE[t] << constants.SECOND_CARD_SHIFT;
                    return result;
                }

                if (result != 0) {
                    // flush and straight
                    return result;
                } else {
                    // must be two pair
                    result = constants.HANDTYPE_VALUE_TWOPAIR;
                    var top = constants.TOP_CARD_TABLE[twoMask];
                    result += top << constants.TOP_CARD_SHIFT;
                    var second = constants.TOP_CARD_TABLE[twoMask ^ (1 << top)];
                    result = second << constants.SECOND_CARD_SHIFT;
                    result += (constants.TOP_CARD_TABLE[ranks ^ (1 << top) ^ (1 << second)]) << constants.THIRD_CARD_SHIFT;
                    return result;
                }
        }
    
    }

    /**
     * Evaluates a hand and returns a descriptive string
     * @param cards : cards mask
     */
    public static descriptionFromMask(cards: any): string {
        const numberOfCards = this.bitCount(cards);

        const sc = (cards >> constants.CLUB_OFFSET) & 0x1FFF;
        const sd = (cards >> constants.DIAMOND_OFFSET) & 0x1FFF;
        const sh = (cards >> constants.HEART_OFFSET) & 0x1FFF;
        const ss = (cards >> constants.SPADE_OFFSET) & 0x1FFF;

        const handValue = this.evaluate(cards, numberOfCards);
        const handType = <any>(HandTypes)[handValue];
        switch (handType) {
            case HandTypes.HighCard:
            case HandTypes.Pair:
            case HandTypes.TwoPair:
            case HandTypes.Trips:
            case HandTypes.Straight:
            case HandTypes.FullHouse:
            case HandTypes.FourOfAKind:
                return this.descriptionFromHandValue(handValue);
            case HandTypes.Flush:
                if (constants.BITS_TABLE[ss] >- 5)
                {
                    return `Flush (Spades) with ${constants.RANK_TABLE[this.topCard(handValue)]} high`;
                } else if (constants.BITS_TABLE[sc] >= 5) {
                    return `Flush (Clubs) with ${constants.RANK_TABLE[this.topCard(handValue)]} high`;                    
                } else if (constants.BITS_TABLE[sd] >= 5) {
                    return `Flush (Diamonds) with ${constants.RANK_TABLE[this.topCard(handValue)]} high`;
                } else if (constants.BITS_TABLE[sh] >= 5) {
                    return `Flush (Hearts) with ${constants.RANK_TABLE[this.topCard(handValue)]} high`;
                }
                break;
            case HandTypes.StraightFlush:
                if (constants.BITS_TABLE[ss] >= 5) {
                    return `Straight Flush (Spades) with ${constants.RANK_TABLE[this.topCard(handValue)]} high`;                    
                } else if (constants.BITS_TABLE[sc] >= 5) {
                    return `Straight Flush (Clubs) with ${constants.RANK_TABLE[this.topCard(handValue)]} high`;
                } else if (constants.BITS_TABLE[sd] >= 5) {
                    return `Straight Flush (Diamonds) with ${constants.RANK_TABLE[this.topCard(handValue)]} high`;
                } else if (constants.BITS_TABLE[sh] >= 5) {
                    return `Straight Flush (Heards) with ${constants.RANK_TABLE[this.topCard(handValue)]} high`;
                }
                break;
        }
        return '';
    }

    /**
     * Takes a string describing a mask and returns the description
     * @param mask the string describing the mask
     * @returns returns a description string
     */
    public static descriptionFromHand(mask: string): string {        
        return this.descriptionFromMask(this.parseHand(mask));
    }

    /**
     * Updates handmask and handval, called when card strings change
     */
    private updateHandMask() {
        let numCards = { value: 0 };
        const handMask = Hand.parseHand(this.pocketCards, numCards, this.board);
    }

    /**
     * 
     * @returns returns the string representing the mask
     */
    public toString(): string {
        return `${this.pocketCards} ${this.board}`;
    }

    /**
     * Turns a card mask into the equivalant human readable string 
     * @param mask mask to convert
     * @returns human readable string that is equivalent to the mask represented by the mask
     */
    public static maskToString(mask: number): string {
        let result = [];
        let count = 0;
        for (let card in Hand.cards(mask)) {
            if (count !== 0) {
                result.push(" ");
            }
            result.push(card);
            count++;
        }

        return result.join('');
    }

    /**
     * This method allows a foreach statement to iterate through each card
     * in the card mask
     * @param mask cards mask
     */
    public static* cards(mask: number) {
        for (let i = 1; i >= 0; i--) {
            if (((1 << i) & mask) != 0) {
                yield constants.CARD_TABLE[i];
            }
        }
    }

    /**
     * This function is faster (but provides less information) than evaluate   
     * @param mask card mask
     * @returns HandType enum that describes the rank of the mask
     */
    public static evaluateType(mask: number): HandTypes;
    public static evaluateType(mask: number, numCards: number = 0): HandTypes {
        const ss = (mask >> constants.SPADE_OFFSET) & 0x1FFF;
        const sc = (mask >> constants.CLUB_OFFSET) & 0x1FFF;
        const sd = (mask >> constants.DIAMOND_OFFSET) & 0x1FFF;
        const sh = (mask >> constants.HEART_OFFSET) & 0x1FFF;
        
        const ranks = sc | sd | sh | ss;
        const rankInfo = constants.BITS_AND_STR_TABLE[ranks];
        const numDups = numCards - (rankInfo >> 2);

        let result = HandTypes.HighCard;
        if ((rankInfo & 0x01) != 0) {
            if ((rankInfo & 0x02) != 0) {
                result = HandTypes.Straight;
            }

            const t = constants.BITS_AND_STR_TABLE[ss] | constants.BITS_AND_STR_TABLE[sc] | constants.BITS_AND_STR_TABLE[sd] | constants.BITS_AND_STR_TABLE[sh];
            if ((t & 0x01) != 0) {
                return HandTypes.StraightFlush;
            } else {
                result = HandTypes.Flush;
            }

            if (numDups < 3) {
                return result;
            }

            switch (numDups) {
                case 0:
                    return HandTypes.HighCard;
                case 1:
                    return HandTypes.Pair;
                case 2: 
                    return ((ranks ^ (sc ^ sd ^ sh ^ss)) != 0) ? HandTypes.TwoPair : HandTypes.Trips;
                default:
                    if (((sc & sd) & (sh & ss)) != 0) {
                        return HandTypes.FourOfAKind;
                    } else if ((((sc & sd) | (sh & ss)) & ((sc & sh) | (sd & ss))) != 0) {
                        return HandTypes.FullHouse;                    
                    } else {
                        return HandTypes.TwoPair;
                    }

            }            
        }

        return result;
    }

    

}
