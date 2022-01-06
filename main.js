//Initialize global variables
let score = 0; //how many series have successfully been completed
let chosenKeys = []; //array of keys that the player will need to choose correctly to beat the game
let checker = 0; //keeps track of where the player is at in the series
let gameStarted = false; //used to allow player to interact with the keyboard
let myStartSpan = document.querySelector("#start-span");
let myScore = document.getElementById("score");
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

//HTML keyboard button elements in an array
let docKeys = document.getElementsByClassName("keyboard");

//Setup keys as new buttons and add to empty div? Can just start with keys in the div and manipulate those.

//add code to play a series of notes starting with 1 note
//player will have to copy the series each time it is played
//Need code logic to give the player time to press the right keys.
//Once player presses the right keys, next series of notes will be played.
//Is this where async timing comes into play? For giving the player a time limit.
function playKey(key) {
    return new Promise((resolve) => {
        let note = new Audio(key.audioSrc);
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
}

//update the score html and display it
function displayScore() {
    console.log(myScore);
    myScore.innerHTML = `Score: ${score}`;
    myScore.style.opacity = 1;
    myScore.style.visibility = "visible";
    console.log(myScore);
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
    checker = 0;
    chosenKeys = [];
    startB.style.opacity = 1;
    startB.style.visibility = "visible";
    myStartSpan.innerHTML = "Retry? ";
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
                    score++;
                    displayScore();
                    chooseKey();
                    setTimeout(playKeySeries, 1500); //start the key series after 1.5 seconds
                } else { //the player still has more keys in the series to go
                    checker++;
                }
            } else { //the player picked the wrong key and the game is over
                gameStarted = false;
                finalResults();
            }
        }
    });
}

//When the player clicks the start button, the game begins.
let startB = document.querySelector("#start");
startB.addEventListener("click", () => {
    startB.style.transition = "0.25s";
    startB.style.opacity = 0;
    startB.style.visibility = "hidden";
    score = 0;
    displayScore();
    displayKeyboard();
    chooseKey();
    setTimeout(playKeySeries, 1000);
})
