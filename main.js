//Initialize global variables
let score = 0; //how many series have successfully been completed
let chosenKeys = []; //array of keys that the player will need to choose correctly to beat the game
let checker = 0; //keeps track of where the player is at in the series
let gameStarted = false; //used to allow player to interact with the keyboard
const myStartSpan = document.querySelector("#start-span");
let myScore = document.getElementById("score");
const docKeys = document.getElementsByClassName("keyboard"); //HTML keyboard button elements in an array
const startB = document.querySelector("#start"); //start button
const mSheetDiv = document.getElementById("music-sheet-div"); //sheet music div
let mSheetDivCheck = 2; //this is needed to help specify the correct mSheetDiv child node to change when the player misses.

//Setup array of key objects
//Number of objects will be equal to the game mode selected
//objects will have a key name, audio src, and randomly assigned color.
let keyFirst = {
    name: "c5",
    audioSrc: "audio/c5.mp3",
    color: "red"
}

let keySecond = {
    name: "c-5",
    audioSrc: "audio/c-5.mp3",
    color: "orange"
}

let keyThird = {
    name: "d5",
    audioSrc: "audio/d5.mp3",
    color: "yellow"
}

let keyFourth = {
    name: "d-5",
    audioSrc: "audio/d-5.mp3",
    color: "green"
}

let keyFifth = {
    name: "e5",
    audioSrc: "audio/e5.mp3",
    color: "blue"
}

//Array holding our key objects
let myKeys = [keyFirst, keySecond, keyThird, keyFourth, keyFifth];



//Setup keys as new buttons and add to empty div? Can just start with keys in the div and manipulate those.

//add code to play a series of notes starting with 1 note
//player will have to copy the series each time it is played
//Need code logic to give the player time to press the right keys.
//Once player presses the right keys, next series of notes will be played.
//Is this where async timing comes into play? For giving the player a time limit.
function playKey(key) {
    return new Promise((resolve) => {
        let note = new Audio(key.audioSrc);
        note.volume = 0.50;
        note.play();
        note.onended = resolve; //resolve is a function so this works with onended, resolve passes back nothing to the promise object since we just want to play the audio asynchronously
    })
}

//Play all the keys in the chosenKeys array
//This will need to change the color of the keys too and needs async functionality
async function playKeySeries() {
    for(let i = 0; i < chosenKeys.length; i++) {
        changeKeyColor(chosenKeys[i]);
        await playKey(chosenKeys[i]);
        resetKeyColor(chosenKeys[i]);
    }
    gameStarted = true; //once the computer plays all the keys we allow the player to play again.
}

//Change the color of a specific key document element to the key object's color value
function changeKeyColor(key) {
    for(let i = 0; i < docKeys.length; i++) {
        if(docKeys[i].id == key.name) {
            docKeys[i].style.backgroundColor = key.color;
        }
    }
}

//Clear the key color after the async function rolls through
function resetKeyColor(key) {
    for(let i = 0; i < docKeys.length; i++) {
        if(docKeys[i].id == key.name) {
            if(key.name.charAt(1) === "-") {
                docKeys[i].style.backgroundColor = "black";
            } else {
                docKeys[i].style.backgroundColor = "white";
            }
        }
    }
}

//Add a key to the series challenge
function chooseKey() {
    let rand = Math.floor(Math.random() * 5);
    chosenKeys.push(myKeys[rand]);
    createBars();
    createMusicNote(chosenKeys[chosenKeys.length - 1]);
}

//update the score html and display it
function displayScore() {
    myScore.innerHTML = `Score: ${score}`;
    myScore.style.opacity = 1;
    myScore.style.visibility = "visible";
}

//unhide the keyboard
function displayKeyboard() {
    for (let i = 0; i < docKeys.length; i++) {
        docKeys[i].style.opacity = 1;
        docKeys[i].style.visibility = "visible";
    }
}

//Add game over screen and reset vars if the player wants to try again
function finalResults() {
    document.getElementById("score").innerHTML = `GAME OVER. Final Score: ${score}`;
    startB.style.opacity = 1;
    startB.style.visibility = "visible";
    myStartSpan.innerHTML = "Retry? ";
    if(chosenKeys[checker].name.charAt(1) === "-"){
        mSheetDiv.childNodes[checker + mSheetDivCheck].src = "images/music_sharp_note_green.png";
    } else {
        mSheetDiv.childNodes[checker + mSheetDivCheck].src = "images/music_note_2_green.png";
    }
    mSheetDiv.style.transition = "all 0.5s";
    mSheetDiv.style.opacity = 1;
    mSheetDiv.style.visibility = "visible";
    checker = 0;
    mSheetDivCheck = 2;
    chosenKeys = [];
}

//add event listeners to each key
//check if the right key was pressed
//when the key is pressed it plays the associated audio.
for(let i = 0; i < docKeys.length; i++) {
    docKeys[i].addEventListener("click", () => {
        if(gameStarted) {
            changeKeyColor(myKeys[i]);
            playKey(myKeys[i]);
            setTimeout(resetKeyColor, 500, myKeys[i]);
            if(myKeys[i].name === chosenKeys[checker].name) { //the player picked the right key in the series
                if(checker === chosenKeys.length - 1) { //the player beat that series so update the score and add more keys to the challenge list
                    gameStarted = false;
                    checker = 0;
                    mSheetDivCheck = 2;
                    score++;
                    displayScore();
                    chooseKey();
                    setTimeout(playKeySeries, 1500); //start the key series after 1.5 seconds
                } else { //the player still has more keys in the series to go
                    checker++;
                    mSheetDivCheck++;
                }
            } else { //the player picked the wrong key and the game is over
                gameStarted = false;
                finalResults();
            }
        }
    });
}

//When the player clicks the start button, the game begins.
startB.addEventListener("click", () => {
    mSheetDiv.style.transition = "none";
    mSheetDiv.style.opacity = 0;
    mSheetDiv.style.visibility = "hidden";
    while(mSheetDiv.firstChild) {
        mSheetDiv.removeChild(mSheetDiv.lastChild);
    }
    startB.style.transition = "0.25s";
    startB.style.opacity = 0;
    startB.style.visibility = "hidden";
    score = 0;
    displayScore();
    displayKeyboard();
    createStartSheet();
    chooseKey();
    setTimeout(playKeySeries, 1000);
});

function createBars(){
    let bars = document.createElement("img");
    bars.src = "images/music_bars.png";
    bars.style.zIndex = 1;
    bars.style.paddingBottom = "10px";
    mSheetDiv.appendChild(bars);
}

function createStartSheet() {
    let startSheet = document.createElement("img");
    startSheet.src = "images/sheet_start.png";
    startSheet.style.zIndex = 1;
    startSheet.style.paddingBottom = "10px";
    mSheetDiv.appendChild(startSheet);
}

function createMusicNote(key) {
    let mNote = document.createElement("img");
    mNote.style.position = "absolute";
    mNote.style.zIndex = 2;
    if(key.name === "c5") {
        mNote.src = "images/music_note_2.png";
        mNote.style.transform = "translate(-20px, -10px)";
    } else if(key.name === "c-5") {
        mNote.src = "images/music_sharp_note.png";
        mNote.style.transform = "translate(-30px, -9px)";
    } else if(key.name === "d5") {
        mNote.src = "images/music_note_2.png";
        mNote.style.transform = "translate(-20px, -14px)";
    } else if(key.name === "d-5") {
        mNote.src = "images/music_sharp_note.png";
        mNote.style.transform = "translate(-30px, -13px)";
    } else if(key.name === "e5") {
        mNote.src = "images/music_note_2.png";
        mNote.style.transform = "translate(-20px, -18px)";
    }
    mSheetDiv.appendChild(mNote);
}
