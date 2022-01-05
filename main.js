//Default game mode will be easy
//Initialize global variables
let seriesN = 1; //number of notes to play in series
let gameMode = "easy"; //game difficulty
let score = 0; //how many series have successfully been completed
const numKeys = 5; //total number of keys
let chosenKeys = [];
let checker = 0;

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
console.log(docKeys);
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
        console.log("yeet");
        resetKeyColor(chosenKeys[i]);
    }
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
    console.log(chosenKeys);
}

//add event listeners to each key
//check if the right key was pressed
//when the key is pressed it plays the associated audio.
for(let i = 0; i < docKeys.length; i++) {
    docKeys[i].addEventListener("click", () => {
        playKey(myKeys[i]);
        if(myKeys[i].name === chosenKeys[checker].name) { //the player picked the right key in the series
            if(checker === chosenKeys.length - 1) { //the player beat that series so update the score and add more keys to the challenge list
                checker = 0;
                score++;
                document.getElementById("score").innerHTML = `Score: ${score}`;
                chooseKey();
                setTimeout(playKeySeries, 1500); //start the key series after 1.5 seconds
            } else { //the player still has more keys in the series to go
                checker++;
            }
        } else { //the player picked the wrong key and the game is over
            console.log("missed");
        }
    });
}

//When the player clicks the start button, the game begins.
let startB = document.querySelector("#start");
startB.addEventListener("click", () => {
    chooseKey();
    playKeySeries();
})
