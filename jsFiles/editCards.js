/*
js for editing flashcards
*/
import { supabase } from './supabaseClient.js';

//get elements from screen
const titleIn = document.getElementById("titleInput");
const descIn = "";
var termIns;
var defIns;
const inputHolder = document.getElementById("inputHolder");
addRows(true);

/* saves deck */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveBtn').addEventListener('click', updateDeck);
});
async function updateDeck(){
    //to do: check if deck has already been made
    const { error } = await supabase
    .from('deck')
    .insert(getInput());

    window.location.href = 'index.html';
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

function addRows(creating){
    if(creating){
        var offset = 0;
        if(termIns != null){
            offset = termIns.length;
        }
        for(let i = 1; i<=15; i++){
            let num = i+offset;
            inputHolder.innerHTML += `<div class="center"><h1>`+num+`.</h1>
            <textarea class="term" rows="2" cols="30" placeholder="Term"></textarea>
            <textarea class="def" rows="2" cols="40" placeholder="Definition"></textarea></div>`
        }
    }
    else{
    }

    termIns = document.getElementsByClassName("term");
    defIns = document.getElementsByClassName("def");
}
document.getElementById("addCardsBtn").onclick = () => addRows(true);
//to do: functions to retreive and populate form with data if editing already created deck
async function getDeck(){

    return deck;
}
function populateForm(){

}

