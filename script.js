/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

//Global Variables
var pattern = [];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;

//Global Constants
const clueHoldTime = 1000; // 1000 milliseconds
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const numPatterns = 8;
const patternsToMatch = 6;

function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  initPattern();
  console.log(pattern);
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() { 
  //initialize game variables
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightUp(btnNum) {
  document.getElementById("button" + btnNum).classList.add("lit");
}

function lightDown(btnNum) {
  document.getElementById("button" + btnNum).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying){ 
    lightUp(btn);
    playTone(btn, clueHoldTime);
    setTimeout(lightDown, clueHoldTime, btn);
  }
}


function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) { // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue, delay, pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime  
    delay += cluePauseTime;
  }
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }

  // add game logic here
  if (pattern[guessCounter] !== btn) {
    loseGame();
  } else if (guessCounter !== progress) {
    guessCounter += 1;
  } else if (progress !== patternsToMatch) {
    progress += 1;
    playClueSequence();
  } else {
    winGame();
  }
}

function initPattern() {
  for (let i = 0; i < numPatterns; i++) {
    let randNum = Math.random(); // Returns a float between 0 and 1
    if (randNum < 0.16) {
      pattern.push(1);
    } else if (randNum < 0.32) {
      pattern.push(2);
    } else if (randNum < 0.48) {
      pattern.push(3);
    } else if (randNum < 0.64) {
      pattern.push(4);
    } else if (randNum < 0.80) {
      pattern.push(5);
    } else {
      pattern.push(6)
    }
  }
}

/* FOR PLAYING SOUND */
// Sound Synthesis Functions
const freqMap = {
  1: 250,
  2: 300,
  3: 350,
  4: 400,
  5: 450,
  6: 500
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)