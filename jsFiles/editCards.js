/*
js for editing flashcards
*/
import { supabase } from './supabaseClient.js';

//get elements from screen
const titleIn = document.getElementById("titleInput");
const descIn = "";
const termIns = document.getElementsByClassName("term");
const defIns = document.getElementsByClassName("def");


/* saves deck */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveBtn').addEventListener('click', updateDeck);
});
async function updateDeck(){
    //to do: check if deck has already been made
    const { error } = await supabase
    .from('deck')
    .insert(getInput());
}

//retreive info from form
function getInput(){
    var cards = [];
    var offset = 0;//to make sure numvers stay correct if there's a gap in the middle of the form
    for(let i=0; i < termIns.length; i++){
        if(termIns[i].value != ""){
            cards.push(new Card(i-offset,termIns[i].value, defIns[i].value));
        }else{
            offset ++;
        }
    }
    const deck = new Deck(titleIn.value, descIn,cards);
    return deck;
}

//to do: functions to retreive and populate form with data if editing already created deck
async function getDeck(){

    return deck;
}
function populateForm(){

}