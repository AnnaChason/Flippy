/*javascript file for managing flashcard on the home screen */
import {supabase} from '../jsFiles/supabaseClient.js';

const titleTxt = document.getElementById("deckTitleText");
const cardTxt = document.getElementById("cardText");
const rightBtn = document.getElementById("right");
const wrongBtn = document.getElementById("wrong");

/* 
card navigation management
*/
    var currentCard = 0;
    var cards = null;
    const cardIdxText = document.getElementById("cardIdx");
    const deckLength = document.getElementById("deckLength");

    document.getElementById('flipBtn').addEventListener('click', flipCard);
    document.getElementById('forwardBtn').addEventListener('click', forward);
    document.getElementById('backBtn').addEventListener('click', back);
    const card = document.getElementById("idxCard");

    var flipped = false;
    function flipCard(){
        console.log(cards);
        if(flipped){//going to front
            rightBtn.style.display="none";
            wrongBtn.style.display="none";

            card.style.backgroundImage = `url(imgs/cardFrame.png)`;
            if(cards != null)
                cardTxt.innerText=cards[currentCard].term;
        }else{//going to back
            rightBtn.style.display="block";
            wrongBtn.style.display="block";

            card.style.backgroundImage = `url(imgs/cardFrameBack.png)`;
            if(cards != null && currentCard < cards.length)
                cardTxt.innerText=cards[currentCard].definition;
        }
        flipped = !flipped;
    }

    function forward(){
        rightBtn.style.display="none";
        wrongBtn.style.display="none";

        currentCard ++;
        if(currentCard < 0){
            currentCard = cards.length-1;
        }
        if(currentCard >= cards.length){
            currentCard = 0;
        }
        cardIdxText.innerHTML=currentCard+1;

        if(flipped){
            card.style.backgroundImage = `url(imgs/cardFrame.png)`;
            flipped = false;
        }
        if(cards != null)
            cardTxt.innerText=cards[currentCard].term;
    }
    function back(){
        rightBtn.style.display="none";
        wrongBtn.style.display="none";

        currentCard --;
        if(currentCard < 0){
            currentCard = cards.length-1;
        }
        if(currentCard >= cards.length){
            currentCard = 0;
        }
        cardIdxText.innerHTML=currentCard+1;
        
        if(flipped){
            card.style.backgroundImage = `url(imgs/cardFrame.png)`;
            flipped = false;
        }
        if(cards != null && currentCard < cards.length)
            cardTxt.innerText=cards[currentCard].term;
    }

/*
loads card data
*/
    async function loadDeck(id){
        const deck = await supabase
        .from('deck')
        .select('name,cards')
        .eq('id', id)
        .order('created_at');

        titleTxt.innerText=deck.data[0].name;
        cards = deck.data[0].cards;
        cardTxt.innerText = cards[0].term;
        
        currentCard = 0;
        cardIdxText.innerText = 1;
        deckLength.innerText = cards.length;
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
        .select('name,id')
        .order('created_at')

        for(let i = 0; i < titles.data.length; i++){
            var row = document.createElement("div");
            var text = document.createElement("p");
            text.innerText = titles.data[i].name;
            row.appendChild(text);
            row.addEventListener("click", ()=>{ 
                popupdiv.style.display="none"; 
                backShadow.style.display="none"; 
                loadDeck(titles.data[i].id);
            });
            popupdiv.appendChild(row);
        }
    }

/*
tracks correctness
*/
    //to do: put this in db
    const correctness = new Map();

    rightBtn.addEventListener('click',right);
    wrongBtn.addEventListener('click',wrong);

    function right(){
        const currCardId = cards[currentCard].num;
        correctness.set(currCardId,true);
        
        //to do: find a way to keep track of average
        if(correctness.has(currCardId)){
            
        }
    }
    function wrong(){
        const currCardId = cards[currentCard].num;
        correctness.set(currCardId,false);
        console.log(correctness);
    }



