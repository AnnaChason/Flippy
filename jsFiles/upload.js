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
    let deckIn =  await getInput()
    if(deckIn && deckIn.cards != null && deckIn.name != ""){
        const { error } = await supabase
        .from('deck')
        .insert(deckIn);

        window.location.href = 'index.html';
    }
    else{
        console.log("error: missing feilds");
    }

}

//retreive info from form
async function getInput(){
    const {data, error} = await supabase.auth.getUser();

    if (error || !data || !data.user) {
        console.log("Error: not logged in");
        return false;
    }
    else{
        var cards = [];
        var tdArray = uploadTxt.value.split(";");
        for(let i =0; i< tdArray.length; i++){
            tdArray[i] = tdArray[i].split(",");
            if(tdArray[i][0] != "")
                cards.push(new Card(i,tdArray[i][0], tdArray[i][1]));
        }
        if(titleIn.value != "" && cards != null && cards.length > 0){
            const deck = new Deck(titleIn.value, descIn,cards, data.user.id);
            return deck;
        }
        else{
            creationError();
        }

    }
}

const popupdiv = document.getElementById("backShadow");
/*error msg popup */
function creationError(){
    //load popup
    popupdiv.style.display="block"; 
        
    document.getElementById("closePopup").addEventListener('click', ()=>{ 
        popupdiv.style.display="none"; 
    });
}



