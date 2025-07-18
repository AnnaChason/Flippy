//classes need for managing cards and decks
class Deck{ 
    constructor(name,description,cards){
        this.name = name;
        this.description = description;
        this.cards = cards;
    }
}
class Card{
    constructor(num,term,definition){
        this.num = num;
        this.term = term;
        this.definition = definition;
        this.score = 5;
    }
}