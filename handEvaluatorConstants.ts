module.exports = Object.freeze({
    NUMBER_OF_CARDS: 52,
    NUMBER_OF_CARDS_WITH_JOKER: 53,
    HANDTYPE_SHIFT: 24,
    TOP_CARD_SHIFT: 16,
    TOP_CARD_MASK: 0x000F0000,
    SECOND_CARD_SHIFT: 12,
    SECOND_CARD_MASK: 0X0000F000,
    THIRD_CARD_SHIFT: 8,
    FOURTH_CARD_SHIFT: 4,
    FIFTH_CARD_SHIFT: 0,
    FIFTH_CARD_MASK: 0x0000000F,
    CARD_WIDTH: 4,
    CARD_MASK: 0x0F,
    RANK_TABLE: [
        "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace",
        "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace",
        "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace",
        "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace"
    ]
})