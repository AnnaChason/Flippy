//connect to supabase
const supabaseUrl = 'https://cjhlknvlwumeamuljfps.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqaGxrbnZsd3VtZWFtdWxqZnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTM3MDcsImV4cCI6MjA2NTU4OTcwN30.uNzU4uEDb9MJDfBoFMITL4socos5WA82BDwPCFfMIQw';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(supabaseUrl, supabaseKey);

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