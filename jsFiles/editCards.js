/*
js for editing flashcards
*/

//get elements from screen
const titleIn = document.getElementById("titleInput");
const descIn = "";
const termIns = document.getElementsByClassName("term");
const defIns = document.getElementsByClassName("def");

//runs when save is pressed
async function updateDeck(){
    //to do: check if deck has already been made
    const { error } = await supabase
    .from('Deck')
    .insert(getInput());
}

//retreive info from form
function getInput(){
    var cards = [];
    for(let i=0; i < termIns.length; i++){
        cards.push(new Card(i,termIns[i].value, defIns[i].value));
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