/*
javascript file for managing flashcard on the home screen 
*/
import {supabase} from '../jsFiles/supabaseClient.js';

/*
connect to html
*/
    const titleTxt = document.getElementById("deckTitleText");
    const cardTxt = document.getElementById("cardText");
    const rightBtn = document.getElementById("right");
    const wrongBtn = document.getElementById("wrong");
    const cardIdxText = document.getElementById("cardIdx");
    const deckLength = document.getElementById("deckLength");
    const card = document.getElementById("idxCard");

//set up
var currentCard = 0;
var cards = null;
loadRecentDeck();

/*
manages different ways to study the flashcards
*/
// shared
    var flipped = false;
    function flipCard(){
        if(flipped){//going to front
            card.style.backgroundImage = `url(imgs/cardFrame.png)`;
            if(cards != null)
                cardTxt.innerText=cards[currentCard].term;
        }else{//going to back
            card.style.backgroundImage = `url(imgs/cardFrameBack.png)`;
            if(cards != null && currentCard < cards.length)
                cardTxt.innerText=cards[currentCard].definition;
        }
        flipped = !flipped;
        return !flipped;
    }

    function forward(){
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

    function randomizeOrder(){  
        var randomized = [];
        while(cards.length > 0){
            const rmIdx = Math.floor(Math.random()*cards.length-1);
            randomized.push(cards.splice(rmIdx,1)[0]);
        }
        cards = [...randomized];
        console.log(cards);
    }
/*
    strategies: 
*/
    //in order
    class InOrder{
        onSelect(){
            //to do: return cards to og order
        }
        flip(){
          flipCard();  
        }
        next(){
            forward();
        }
        prev(){
            back();
        }
    }
    //random order
    class RandOrder{
        onSelect(){
            randomizeOrder();
        }
        flip(){
          flipCard();  
        }
        next(){
            forward();
        }
        prev(){
             randomizeOrder();
            back();
        }
    }
    //dynamic study
    class Dynamic{
        onSelect(){
            randomizeOrder();
        }
        flip(){
          const front = flipCard();  
          if(front){
            rightBtn.style.display="none";
            wrongBtn.style.display="none";
          }
          else{
            rightBtn.style.display="block";
            wrongBtn.style.display="block";
          }
        }
        next(){//correct
            rightBtn.style.display="none";
            wrongBtn.style.display="none";
            forward();
        }
        prev(){//incorrect
            rightBtn.style.display="none";
            wrongBtn.style.display="none";
            back();
        }
    }

    var strat = new RandOrder();

    document.getElementById('flipBtn').addEventListener('click', strat.flip);
    document.getElementById('forwardBtn').addEventListener('click', strat.next);
    document.getElementById('backBtn').addEventListener('click', strat.prev);
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
load most recently created deck
*/
    async function loadRecentDeck(){
        const deck = await supabase
        .from('deck')
        .select('name,cards')
        .order('created_at', {ascending: false})
        .limit(1);

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
        loadTitles();
    });
    document.getElementById("closePopup").addEventListener('click', ()=>{ 
        popupdiv.style.display="none"; 
        backShadow.style.display="none"; 
        
        //remove rows so it decks don't end up loaded twice later
        let rows = popupdiv.querySelectorAll("div");
        rows.forEach(div => {
            div.remove();
        });
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
                //remove rows so it decks don't end up loaded twice later
                let rows = popupdiv.querySelectorAll("div");
                rows.forEach(div => {
                    div.remove();
                });
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



