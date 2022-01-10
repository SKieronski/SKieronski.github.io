//Setup global variables
let score = 0; //how many series have successfully been completed
let chosenKeys = []; //array of keys that the player will need to choose correctly to beat the game
let checker = 0; //keeps track of where the player is at in the series
let gameStarted = false; //used to allow player to interact with the keyboard
let mSheetDivCheck = 2; //this is needed to help specify the correct mSheetDiv child node to change when the player misses.
const myStartSpan = document.querySelector("#start-span"); 
const myScore = document.getElementById("score"); 
const docKeys = document.getElementsByClassName("keyboard"); 
const startB = document.querySelector("#start"); 
const mSheetDiv = document.getElementById("music-sheet-div"); 

//All of our keyboard key objects.
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
let myKeys = [keyFirst, keySecond, keyThird, keyFourth, keyFifth]; //array of our key objects

//Play the audio for a note
function playKey(key) {
    return new Promise((resolve) => {
        let note = new Audio(key.audioSrc);
        note.volume = 0.50;
        note.play();
        note.onended = resolve; 
    })
}

//Asynchronous function that plays the audio and changes the key color for 
//all the notes in a pattern
async function playKeySeries() {
    for(let i = 0; i < chosenKeys.length; i++) {
        changeKeyColor(chosenKeys[i]);
        await playKey(chosenKeys[i]);
        resetKeyColor(chosenKeys[i]);
    }
    gameStarted = true; //once the computer plays all the keys we allow the player to play again.
}

//Change the color of a specific key HTML element to the key object's color value
function changeKeyColor(key) {
    for(let i = 0; i < docKeys.length; i++) {
        if(docKeys[i].id == key.name) {
            docKeys[i].style.backgroundColor = key.color;
        }
    }
}

//Reset the color of a key once it plays its audio.
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

//Push a random key to the computer picked pattern and also add it to the hidden sheet music
function chooseKey() {
    let rand = Math.floor(Math.random() * 5);
    chosenKeys.push(myKeys[rand]);
    createBars();
    createMusicNote(chosenKeys[chosenKeys.length - 1]);
}

//Update the score HTML element and display it
function displayScore() {
    myScore.innerHTML = `Score: ${score}`;
    myScore.style.opacity = 1;
    myScore.style.visibility = "visible";
}

//Display the keyboard HTML element
function displayKeyboard() {
    for (let i = 0; i < docKeys.length; i++) {
        docKeys[i].style.opacity = 1;
        docKeys[i].style.visibility = "visible";
    }
}

//Add game over screen
function finalResults() {
    //Modify the score header and start button html elements
    document.getElementById("score").innerHTML = `GAME OVER. Final Score: ${score}`;
    startB.style.opacity = 1;
    startB.style.visibility = "visible";
    myStartSpan.innerHTML = "Retry? ";

    //Display sheet music
    if(chosenKeys[checker].name.charAt(1) === "-"){
        mSheetDiv.childNodes[checker + mSheetDivCheck].src = "images/music_sharp_note_green.png";
    } else {
        mSheetDiv.childNodes[checker + mSheetDivCheck].src = "images/music_note_2_green.png";
    }
    mSheetDiv.style.transition = "all 0.5s";
    mSheetDiv.style.opacity = 1;
    mSheetDiv.style.visibility = "visible";
}

//Add event listeners to each key in the keyboard
for(let i = 0; i < docKeys.length; i++) {
    docKeys[i].addEventListener("click", () => {
        if(gameStarted) {
            changeKeyColor(myKeys[i]);
            playKey(myKeys[i]);
            setTimeout(resetKeyColor, 500, myKeys[i]); 

            //Game logic. 1, check if the player chose the right key
            //If 1 is false, the player picked the wrong key and the game is over
            //2a, check if the player picked all the keys in the current series
            //2b, if 2a is false, let the player keep picking keys
            if(myKeys[i].name === chosenKeys[checker].name) { 
                if(checker === chosenKeys.length - 1) { 
                    gameStarted = false;
                    checker = 0;
                    mSheetDivCheck = 2;
                    score++;
                    displayScore();
                    chooseKey();
                    setTimeout(playKeySeries, 1500); 
                } else {
                    checker++;
                    mSheetDivCheck++;
                }
            } else {
                gameStarted = false;
                finalResults();
            }
        }
    });
}

//When the player clicks the start button, the game begins
startB.addEventListener("click", () => {
    //Reset the sheet music
    mSheetDiv.style.transition = "none";
    mSheetDiv.style.opacity = 0;
    mSheetDiv.style.visibility = "hidden";
    while(mSheetDiv.firstChild) {
        mSheetDiv.removeChild(mSheetDiv.lastChild);
    }

    //Hide the start button
    startB.style.transition = "0.25s";
    startB.style.opacity = 0;
    startB.style.visibility = "hidden";

    //Reset vars
    checker = 0;
    mSheetDivCheck = 2;
    chosenKeys = [];
    score = 0;

    displayScore();
    displayKeyboard();
    createStartSheet();

    chooseKey();
    setTimeout(playKeySeries, 1000);
});

//Create the first element in the sheet music 
function createStartSheet() {
    let startSheet = document.createElement("img");
    startSheet.src = "images/sheet_start.png";
    startSheet.style.zIndex = 1;
    startSheet.style.paddingBottom = "10px";
    mSheetDiv.appendChild(startSheet);
}

//Create the bars in sheet music and add it to the sheet music div
function createBars(){
    let bars = document.createElement("img");
    bars.src = "images/music_bars.png";
    bars.style.zIndex = 1;
    bars.style.paddingBottom = "10px";
    mSheetDiv.appendChild(bars);
}

//Create music notes and add them to the sheet music in the appropriate position
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