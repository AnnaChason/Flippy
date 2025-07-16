/*
js for uploading flashcards from quizlet.
*/
import { supabase } from './supabaseClient.js';

//get elements from screen
const titleIn = document.getElementById("titleInput");
const descIn = "";//will add later
const uploadTxt = document.getElementById("uploadBox");

/* saves deck */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveBtn').addEventListener('click', updateDeck);
});
async function updateDeck(){
    const { error } = await supabase
    .from('deck')
    .insert(getInput());
}

//retreive info from form
function getInput(){
    var cards = [];
    var tdArray = uploadTxt.value.split(";");
    for(let i =0; i< tdArray.length; i++){
        tdArray[i] = tdArray[i].split(",");
        if(tdArray[i][0] != "")
            cards.push(new Card(i,tdArray[i][0], tdArray[i][1]));
    }
    
    const deck = new Deck(titleIn.value, descIn,cards);
    return deck;
}