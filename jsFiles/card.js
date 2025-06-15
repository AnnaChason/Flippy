/*javascript file for managing flashcard on the home screen */
var flipped = false;
function flipCard(){
    const card = document.getElementById("idxCard");
    if(flipped){
        card.style.backgroundImage = `url(imgs/cardFrame.png)`;
    }else{
        card.style.backgroundImage = `url(imgs/cardFrameBack.png)`;
    }
    flipped = !flipped;
}

function forward(){
    const card = document.getElementById("idxCard");
    if(flipped){
        card.style.backgroundImage = `url(imgs/cardFrame.png)`;
    }else{
        card.style.backgroundImage = `url(imgs/cardFrameBack.png)`;
    }
    flipped = !flipped;
}
function back(){
    const card = document.getElementById("idxCard");
    if(flipped){
        card.style.backgroundImage = `url(imgs/cardFrame.png)`;
    }else{
        card.style.backgroundImage = `url(imgs/cardFrameBack.png)`;
    }
    flipped = !flipped;
}
