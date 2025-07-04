/*javascript file for managing flashcard on the home screen */
import {supabase} from '../jsFiles/supabaseClient.js';


/* 
card navigation management
*/
    document.getElementById('flipBtn').addEventListener('click', flipCard);
    document.getElementById('forwardBtn').addEventListener('click', forward);
    document.getElementById('backBtn').addEventListener('click', back);

    var flipped = false;
    function flipCard(){
        console.log("flip");
        const card = document.getElementById("idxCard");
        if(flipped){
            card.style.backgroundImage = `url(imgs/cardFrame.png)`;
        }else{
            card.style.backgroundImage = `url(imgs/cardFrameBack.png)`;
        }
        flipped = !flipped;
    }

    function forward(){
        console.log("forward");
        const card = document.getElementById("idxCard");
        if(flipped){
            card.style.backgroundImage = `url(imgs/cardFrame.png)`;
        }else{
            card.style.backgroundImage = `url(imgs/cardFrameBack.png)`;
        }
        flipped = !flipped;
    }
    function back(){
        console.log("back");
        const card = document.getElementById("idxCard");
        if(flipped){
            card.style.backgroundImage = `url(imgs/cardFrame.png)`;
        }else{
            card.style.backgroundImage = `url(imgs/cardFrameBack.png)`;
        }
        flipped = !flipped;
    }

/*
manages the deck selection popup
*/
    const popupdiv = document.getElementById("deckSelectDiv");
    const backShadow = document.getElementById("backShadow");

    //load popup
    document.getElementById("deckSelectBtn").addEventListener('click', ()=>{ 
        popupdiv.style.display="block"; 
        backShadow.style.display="block"; 
        loadTitles()
    });

    //load deck option titles
    async function loadTitles(){
        const titles = await supabase
    .from('deck')
    .select('name')
    .order('created_at')

    for(let i = 0; i < titles.data.length; i++){
        var row = document.createElement("div");
        var text = document.createElement("p");
        text.innerText = titles.data[i].name;
        row.appendChild(text);
        row.addEventListener("click", ()=>{ popupdiv.style.display="none"; backShadow.style.display="none";})
        popupdiv.appendChild(row);
    }
    }




