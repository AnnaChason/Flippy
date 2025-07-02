/*javascript file for managing flashcard on the home screen */

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
