//classes need for managing cards and decks
class Deck{ 
    constructor(name,description,cards){
        this.name = name;
        this.description = description;
        this.cards = cards;
        this.id =0; /*figure out how to get id from supabase */
    }
}
class Card{
    constructor(num,term,definition){
        this.num = num;
        this.term = term;
        this.definition = definition;
    }
}