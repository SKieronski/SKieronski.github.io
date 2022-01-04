//Default game mode will be easy
//Initialize global variables
let seriesN = 1; //number of notes to play in series
let gameMode = "easy"; //game difficulty
let score = 0; //how many series have successfully been completed
const numKeys = 5; //total number of keys

//Setup array of key objects
//Number of objects will be equal to the game mode selected
//objects will have a key name, audio src, and randomly assigned color.
let keyFirst = {
    name: "c",
    audioSrc: "",
    color: "red"
}

let keySecond = {
    name: "cs",
    audioSrc: "",
    color: "orange"
}

let keyThird = {
    name: "d",
    audioSrc: "",
    color: "yellow"
}

let keyFourth = {
    name: "ds",
    audioSrc: "",
    color: "green"
}

let keyFifth = {
    name: "e",
    audioSrc: "",
    color: "blue"
}

let myKeys = [keyFirst, keySecond, keyThird, keyFourth, keyFifth];

//Setup keys as new buttons and add to empty div? Can just start with keys in the div and manipulate those.

//add code to play a series of notes starting with 1 note
//player will have to copy the series each time it is played
//Need code logic to give the player time to press the right keys.
//Once player presses the right keys, next series of notes will be played.
//Is this where async timing comes into play? For giving the player a time limit.
function playKey(key) {
    let note = new Audio(key.audioSrc);
    note.play();
}

//add event listeners to each key
//check if the right key was pressed
//when the key is pressed it plays the associated audio.

//Need function to do the key checking?
