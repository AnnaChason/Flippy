//classes need for managing cards and decks
class Deck{ 
    constructor(name,description,cards,user_id){
        this.name = name;
        this.description = description;
        this.cards = cards;
        this.user_id = user_id;
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