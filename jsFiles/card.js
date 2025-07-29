/*
javascript file for managing flashcard on the home screen 
*/
import {supabase} from '../jsFiles/supabaseClient.js';

/*
connect to html
*/
    //progress bar elements
    const titleTxt = document.getElementById("deckTitleText");
    const studyStratTxt = document.getElementById("studyStratTxt")
    const idxTxtHolder = document.getElementById("idxTxtHolder");
    const cardIdxText = document.getElementById("cardIdx");
    const deckLength = document.getElementById("deckLength");
    const dpd = document.getElementById("dpd");

    //flashcard elements
    const card = document.getElementById("idxCard");
    const cardBorder = document.getElementsByClassName("cardBorder")[0];
    const cardTxt = document.getElementById("cardText");
    const forwardBtn = document.getElementById('forwardBtn');
    const backBtn = document.getElementById('backBtn');

    
//set up
var currentCard = 0;
var cards = null;
var currDeckId = 0;
loadRecentDeck();

/*
manages different ways to study the flashcards
*/
const accentLight = getComputedStyle(document.documentElement).getPropertyValue('--accentLight').trim();
const accentDark = getComputedStyle(document.documentElement).getPropertyValue('--accentDark').trim();
// shared
    var flipped = false;
    function flipCard(){
        if(flipped){//going to front
            card.style.backgroundColor= accentLight;
            if(cards != null)
                cardTxt.innerText=cards[currentCard].term;
        }else{//going to back
            card.style.backgroundColor= accentDark;
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
            card.style.backgroundColor= accentLight;
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
            card.style.backgroundImage = accentLight;
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
        currentCard = 0;
        cardTxt.innerText = cards[0].term;
        card.style.backgroundImage = accentLight;
        cardIdxText.innerHTML=currentCard+1;
    }
/*
    strategies: 
*/
    //in order
    class InOrder{
        constructor(){
            this.name = "In the original order";
        }
        onSelect(){
            idxTxtHolder.style.display = "block";
            dpd.style.display = "none";
            forwardBtn.src = "https://c.animaapp.com/mdm6pc2gQkSvUa/img/arrow-right-circle.svg";
            backBtn.src = "https://c.animaapp.com/mdm6pc2gQkSvUa/img/arrow-left-circle.svg";
            studyStratTxt.innerText = "Original";
            cardBorder.style.border = "3px solid #513A2A";
            cardBorder.style.boxShadow = "inset 0px 4px 4px #00000040";

            if(currDeckId == 'recent' && cards[0].num != 0){
                loadRecentDeck();
            }
            else if(cards != null && cards[0].num != 0){
                loadDeck(currDeckId);
            }
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
        constructor(){
            this.name = "In a random order";
        }
        onSelect(){
            randomizeOrder();
            idxTxtHolder.style.display = "block";
            dpd.style.display = "none";
            forwardBtn.src = "https://c.animaapp.com/mdm6pc2gQkSvUa/img/arrow-right-circle.svg";
            backBtn.src = "https://c.animaapp.com/mdm6pc2gQkSvUa/img/arrow-left-circle.svg";
            studyStratTxt.innerText = "In random order"
            cardBorder.style.border = "3px solid #513A2A";
            cardBorder.style.boxShadow = "inset 0px 4px 4px #00000040";
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
        constructor(){
            this.name = "With dynamic study";
            //mastery groups: (to be treated as queues)
            this.struggle = [];
            this.main = [];
            this.knowCount = 0;
            this.front = true;
            this.cycleIdx = 0;//how many cards from the main group have gone by, after 3 resets to 0 and a struggle card is shown
        }
        /*
            helper methods
        */ 
        showProgress(){
            document.getElementById("struggleCountTxt").innerText = this.struggle.length;
            document.getElementById("mainCountTxt").innerText = this.main.length;
            document.getElementById("knowCountTxt").innerText = this.knowCount;
        }

        /*updates the score of card car based on if it is correct or not 
        (none is alternate option to help with getting to the end of the main list)
        then places car in correct bucket based on score*/
        updatePlacement(correct, car){
            if(correct && correct != "none"){
                car.score += 1;
            }
            else if (car.score > 0 && correct != "none"){
                car.score -= 1;
            }
            if(car.score < 5){
                this.struggle.push(car);
            }
            else if(car.score < 10){
                this.main.push(car);
            }
            else{
                this.knowCount ++;
            }

            this.showProgress();
        }
        /*
        displays the current card
        param strictFront - if false it flips the card, if true, it puts the card on the front side
        */
        showCard(strictFront){
            if(!this.front || strictFront){
                card.style.backgroundColor = accentLight;
                cardTxt.innerText=this.currCar.term;
                this.front = true;
            }
            else{
                card.style.backgroundColor = accentDark;

                cardTxt.innerText=this.currCar.definition;
                this.front = false;
            }
        }

        forward(){
            //if run out of cards in main and have some left in struggle, add to the score of struggle until half of them are in main.
            //should probably come up with a better way to handle this later.
            if(this.main.length == 0){
                //should do some message
                if(this.struggle.length > 0){
                    while(this.main.length < Math.floor(this.struggle.length/2)){
                        for(let i = 0; i< this.struggle.length; i ++){
                            this.updatePlacement(true,this.struggle[i]);
                        }
                    }
                }
                else{
                    //restart?
                    for(let i = 0; i<cards.length; i++){
                        cards[i].score = 5;
                        this.main.push(cards[i]);
                    }
                }
            }
            if(this.cycleIdx < 3 || this.struggle.length <= 0){
                this.currCar = this.main.shift();
                this.showCard(true); 
                this.cycleIdx++;

                if(this.currCar.score >= 8){
                    cardBorder.style.border = "3px solid #5C9B77";
                    cardBorder.style.boxShadow = "inset 0px 4px 4px #0bf73240";
                }
                else{
                    cardBorder.style.border = "3px solid #513A2A";
                    cardBorder.style.boxShadow = "inset 0px 4px 4px #00000040";
                }
            }
            else{
                this.currCar = this.struggle.shift();
                this.showCard(true); 
                this.cycleIdx = 0;

                cardBorder.style.border = "3px solid #B85656";
                cardBorder.style.boxShadow = "inset 0px 4px 4px #ff030340";
            }
            
        }


        /*
            public methods
        */
        onSelect(){
            idxTxtHolder.style.display = "none";
            dpd.style.display = "block";
            forwardBtn.src = "https://c.animaapp.com/mdmdvct2pyJyE5/img/check.svg";
            backBtn.src = "https://c.animaapp.com/mdmdvct2pyJyE5/img/x.svg";
            studyStratTxt.innerText = "Dynamic";

            randomizeOrder();

            this.knowCount = 0;
            this.struggle = [];
            this.main = [];
            for(let i = 0; i < cards.length; i++){
                if(cards[i].score == undefined){
                    cards[i].score = 5;
                    this.main.push(cards[i]);
                }
                else
                    this.updatePlacement("none", cards[i]);
            }
            this.currCar = this.main.shift();
            this.showCard(true);
        }
        flip(){
          this.showCard(false);
        }
        
        next(){//right
            this.updatePlacement(true, this.currCar);
            this.forward();
        }
        prev(){//wrong
            this.updatePlacement(false, this.currCar);
            this.forward();
        }
    }

    const stratList = [new InOrder(), new RandOrder(), new Dynamic()];
    var strat; 
    
    function selectStrat(idx){
        strat = stratList[idx]
        console.log(strat.name);
        document.getElementById('flipBtn').onclick = strat.flip.bind(strat);
        forwardBtn.onclick = strat.next.bind(strat);
        backBtn.onclick = strat.prev.bind(strat);
        strat.onSelect();
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
        currDeckId = id;
        console.log(currDeckId);
        titleTxt.innerText=deck.data[0].name;
        cards = deck.data[0].cards;
        cardTxt.innerText = cards[0].term;
        
        currentCard = 0;
        cardIdxText.innerText = 1;
        deckLength.innerText = cards.length;
        if(strat != null && strat.name != "In the original order")
            selectStrat(0);
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
        currDeckId = 'recent';
        

        titleTxt.innerText=deck.data[0].name;
        cards = deck.data[0].cards;
        cardTxt.innerText = cards[0].term;
        
        currentCard = 0;
        cardIdxText.innerText = 1;
        deckLength.innerText = cards.length;
        selectStrat(0);
    }

/*
manages the deck selection popup
*/
    const popupdiv = document.getElementById("deckSelectDiv");
    const backShadow = document.getElementById("backShadow");
    const popupHead = document.getElementById("popupHead");

    //remove rows so it decks don't end up loaded twice later
    function removeRows(){
        let rows = popupdiv.querySelectorAll("div");
        rows.forEach(div => {
            div.remove();
        });
    }

    //load popup
    document.getElementById("deckSelectBtn").addEventListener('click', ()=>{ 
        popupdiv.style.display="block"; 
        backShadow.style.display="block"; 
        popupHead.innerText="Select A Deck:";
        loadTitles();
    });
    document.getElementById("closePopup").addEventListener('click', ()=>{ 
        popupdiv.style.display="none"; 
        backShadow.style.display="none"; 
        
        removeRows();
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
                removeRows();
                loadDeck(titles.data[i].id);
            });
            popupdiv.appendChild(row);
        }
    }

/*
study strategy selection popup
*/
    document.getElementById("settingsBtn").addEventListener('click', ()=>{ 
        popupdiv.style.display="block"; 
        backShadow.style.display="block"; 
        popupHead.innerText="How would you like to study?";
        loadStrats();
        
    });

    //populates popup with strategy options
    function loadStrats(){
        for(let i = 0; i < stratList.length; i++){
            var row = document.createElement("div");
            var text = document.createElement("p");
            text.innerText = stratList[i].name;
            row.appendChild(text);

            row.addEventListener("click", ()=>{ 
                
                popupdiv.style.display="none"; 
                backShadow.style.display="none"; 
                removeRows();
                selectStrat(i);
            });
            popupdiv.appendChild(row);
        }
    }


