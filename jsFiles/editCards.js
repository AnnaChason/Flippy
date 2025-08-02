/*
js for editing flashcards
*/
import { supabase } from './supabaseClient.js';

async function getUID() {
    const {data, error} = await supabase.auth.getUser();
    if (error || !data || !data.user) {
        console.log("Error: not logged in");
        return false;
    }
    else{
        return data.user.id;
    }
}

//get elements from screen
const titleIn = document.getElementById("titleInput");
const descIn = "";
var termIns;
var defIns;
const inputHolder = document.getElementById("inputHolder");
var currDeck = null;
addRows();

/* saves deck */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveBtn').addEventListener('click', updateDeck);
});

async function updateDeck(){
    let newDeck = await getInput();
    if(currDeck != null){
        const response = await supabase
            .from('deck')
            .delete()
            .eq('id', currDeck.id);
    }
    if(newDeck){
        const { data,error } = await supabase
        .from('deck')
        .insert(newDeck);

        console.log("runningg");
        window.location.href = 'index.html';
    }
    else{
        creationError();
    }
}

//retreive info from form
async function getInput(){
    var cards = [];
    var offset = 0;//to make sure numvers stay correct if there's a gap in the middle of the form
    for(let i=0; i < termIns.length; i++){
        if(termIns[i].value != ""){
            cards.push(new Card(i-offset,termIns[i].value, defIns[i].value));
        }else{
            offset ++;
        }
    }
    if(cards.length > 0 && titleIn.value != ""){
        const deck = new Deck(titleIn.value, descIn,cards, await getUID());
        return deck;
    }
    else
        return false;
}

//puts rows in the form
function addRows(){
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
    termIns = document.getElementsByClassName("term");
    defIns = document.getElementsByClassName("def");
}
document.getElementById("addCardsBtn").onclick = () => addRows();


/*
manages the deck selection popup
*/
const selectionPopup = document.getElementById("backShadow");
const popupHead = document.getElementById("popupHead");

const editBtn = document.getElementById("editBtn");
editBtn.onclick = ()=>{
    selectionPopup.style.display = "block";
    popupHead.innerText = "Which deck would you like to edit?";

    loadTitles();
    document.getElementById("closePopup").onclick = () => {
        selectionPopup.style.display = "none";
        removeRows();
    }
}


/*
    deck editing functions
*/
    const holderdiv = document.getElementById("deckSelectDiv");

    //load deck option titles
    async function loadTitles(){
        const titles = await supabase
        .from('deck')
        .select('name,id')
        .eq('user_id', await getUID())
        .order('created_at');


        for(let i = 0; i < titles.data.length; i++){
            var row = document.createElement("div");
            var text = document.createElement("p");
            text.innerText = titles.data[i].name;
            row.appendChild(text);
            row.addEventListener("click", ()=>{ 
                backShadow.style.display="none"; 
                removeRows();
                loadDeck(titles.data[i].id);
            });
            holderdiv.appendChild(row);
        }
    }

    function removeRows(){
        let rows = holderdiv.querySelectorAll("div");
        rows.forEach(div => {
            div.remove();
        });
    }


//to do: functions to retreive and populate form with data if editing already created deck
async function loadDeck(id){
    let {data,error} = await supabase
        .from('deck')
        .select('name,cards,id')
        .eq('id', id)
        .limit(1);

    currDeck = data[0];
    if(currDeck != null && currDeck.cards != null){
        titleIn.value = currDeck.name;
        inputHolder.innerHTML = "";
        for(let i = 0; i < currDeck.cards.length; i++){
            inputHolder.innerHTML += `<div class="center"><h1>`+i+`.</h1>
            <textarea class="term" rows="2" cols="30" placeholder="Term">`+currDeck.cards[i].term+`</textarea>
            <textarea class="def" rows="2" cols="40" placeholder="Definition">`+currDeck.cards[i].definition+`</textarea></div>`

        }
    }
}

/*error msg popup */
function creationError(){
    //load popup
    selectionPopup.style.display="block"; 

    //set up row
    let row = document.createElement("div");
    row.style.height = "fit-content";
    row.style.backgroundColor = "transparent";
    row.style.textAlign = "center";
    let text = document.createElement("p");
    text.innerText = "There's been a problem saving your deck. Make sure you have both a title and cards!";
    row.appendChild(text);

    popupHead.innerText="Not so fast!";
    holderdiv.append(row);
        
    document.getElementById("closePopup").addEventListener('click', ()=>{ 
        backShadow.style.display="none"; 
        removeRows();
    });
}

