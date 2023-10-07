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
    Hears = 2,
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

    private static NextCard(cards: string, index: any): number {
        let rank = 0, suit = 0;

        while (index.value < cards.length && cards[index.value] == ' ') {
            index.value++;
        }

        if (index.value >= cards.length) {
            return -1;
        }

        if (index.value < cards.length)
        {
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
            }
        }

    }
    
    static ValidateHand(hand: string): boolean {
        if (hand === undefined) return false;

        let index = 0;
        let handmask = 0;
        let cards = 0;
        let card = 0;

        try {
            
        } catch (error) {
            
        }
    }
}


module.exports = { HandTypes, Hand }
