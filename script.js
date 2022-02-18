'use strict';

// Selecting Elements
const livesNumEl = document.querySelector('.lives-num');
const livesTextEl = document.querySelector('.lives-text');
const highScoreNumEl = document.querySelector('.highscore-num');
const scoreEl = document.querySelector('.current-score-num');
const levelTextEl = document.querySelector('.level-text');
const levelInfoNumEl = document.querySelector('.level-info--num');
const secretNumberEl = document.querySelector('.secret-number');
const messageTextEl = document.querySelector('.message-text');
const primaryBtnEl = document.querySelector('.primary-btn');
const secondaryBtnEl = document.querySelector('.secondary-btn');
const avatarEl = document.querySelector('.secret-number_avatar');

let guessNum,
    gameLevel, currentScore,
    highScore,score, userLives,
    minusPoints, levelNum,
    levelUp;

let valid = true;
let newGame = true;
let tryAgain = false;
    
// clear input field
const clearInputField = (input) => {
    document.querySelector('.guess-number').value = input;
}

// button color
const btnColor = (clr) => {
    if (clr === 'failed') {
        return 'linear-gradient(90deg, #A01579 0%, #6B0143 100%)';
    } else if (clr === 'success'){
        return  'linear-gradient(90deg, #76DA9E 0%, #55AA83 100%)';
    }else if (clr === 'primary'){
        return 'linear-gradient(90deg, #00ABED 0%, #005EAE 100%)';
    }
}

highScore = 0;

// starting condition
const init = () => {
    guessNum = 0;
    gameLevel = 1;
    currentScore = 1000;
    score = 0;
    userLives = 20;
    minusPoints = 50;
    levelNum = 10;
    levelUp = false;

    livesNumEl.textContent = userLives;
    livesTextEl.textContent = 'Lives Left';
    // highScoreNumEl.textContent = highScore;
    scoreEl.textContent = score;
    domReset();
    restoreHearts();
}

// For resetting hearts images
const restoreHearts = () => {
    for (let i = 0; i <= 19; i++) {
        if (userLives !== 20) {
            document.querySelector(`.heart-${i}`).src="./images/heartWhole.svg";
        }
    }
}

// DOM Reset
const domReset = () => {
    levelTextEl.textContent = `lvl ${gameLevel}`;
    levelInfoNumEl.textContent = levelNum;
    avatarEl.style.visibility = 'visible';
    secretNumberEl.classList.add('hidden');
    messageTextEl.textContent = 'Start Guessing...';
    clearInputField("");
    document.querySelector('.guess-number').disabled = false;
    primaryBtnEl.textContent = 'CHECK';
}

// New Game function when you lose & you want to try again
const tryAgainReset = () => {
    secretNum = Math.trunc(Math.random() * `${levelNum}`) + 1;
    userLives = 20;
    livesNumEl.textContent = userLives;
    primaryBtnEl.style.background = btnColor('primary');
    domReset();
    init();
}

init();

// Generate random
let secretNum = Math.trunc(Math.random() * `${levelNum}`) + 1;
console.log(secretNum);

// Functionality if Guess is Right
const rightGuess = () => {
    highScore = Number(document.querySelector('.highscore-num').textContent);

    const rightGuessFunction = function() {
        score = currentScore;
        scoreEl.textContent = score;
        currentScore += 1000;
        document.querySelector('.guess-number').disabled = true;
        primaryBtnEl.style.background = btnColor('success');
    }

    const highScoreFunction = function() {
        highScore = score;
        highScoreNumEl.textContent = score;
    }

    rightGuessFunction();
    
    if (newGame) {
        highScoreFunction();
    }else if (score > highScore) {
        highScoreFunction();
    }
}

// Functionality if Guess is Wrong
const wrongGuess = () => {
    currentScore -= minusPoints;
    userLives -= 1;
    livesNumEl.textContent = userLives;
    lives()
}

// Next level functionality
const nextLevel = () => {
    secretNum = Math.trunc(Math.random() * `${levelNum}`) + 1;
    gameLevel += 1;
    levelNum += 10;

    levelTextEl.textContent = `lvl ${gameLevel}`;
    levelInfoNumEl.textContent = levelNum;
    domReset()
}

// check if odd or even number
const even = num => {
    return num % 2 === 0;
}

// Functionality for hearts images
const lives = () => {
    for (let i = 0; i <= userLives; i++) {
        if (even(userLives) && userLives !== 20) {
            document.querySelector(`.heart-${userLives}`).src="./images/heartEmpty.svg";
        } else {
            document.querySelector(`.heart-${userLives}`).src="./images/heartHalf.svg";
        }
    }
}

// for displaying message
const displayMessage = message => {
    messageTextEl.textContent = message;
}

// display Secret number
const displaySecretNum = () => {
    secretNumberEl.textContent = secretNum;
    secretNumberEl.classList.remove('hidden');
    avatarEl.style.visibility = 'hidden';
}

const errorBorder = document.querySelector('.guess-number');

// input field validation
const inputValidation = () => {
    const iChars = "!`@#$ %^&*()+=-[]\\\';,./{}|\":<>?~_ ";
    const letterChar = /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]+$/i;
    const data = document.querySelector('.guess-number').value;
    let newData = data.replace(/\s/g, "");
    
    if (data == "") {
        valid = false;
    } else {
        for (let i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                valid = false;
                break;
            } else if (!iChars.indexOf(data.charAt(i)) != -1 && (newData[i].match(letterChar))) {
                valid = false;
            } else {
                valid = true;
            }
        }
    }

}

let animate = true;

// Validate if Guess Number = Secret Number
primaryBtnEl.addEventListener('click', () => {
    guessNum = Number(document.querySelector('.guess-number').value);
    primaryBtnEl.style.background = btnColor('primary');

    inputValidation();

    if (!valid) {
        errorBorder.classList.add('border-red');
        clearInputField("");
    } else {
        errorBorder.classList.remove('border-red');
        if (levelUp) {
            nextLevel();
            levelUp = false;
        } else {
            if (guessNum <= levelNum) {
                if (guessNum === secretNum) {
                    displayMessage('Your guess is Correct');
                    displaySecretNum();
                    rightGuess();
                    levelUp = true;
                    primaryBtnEl.textContent = 'Next';
                } else {
                    if (userLives > 1) {
                        displayMessage(guessNum > secretNum ? 'Your guess is too high' : 'Your guess is too low');
                        wrongGuess();
                        userLives === 1 ? livesTextEl.textContent = 'Life left' : livesTextEl.textContent = 'Lives left';
                    } else if (userLives === 0){
                        restoreHearts();
                        tryAgainReset();
                        document.querySelector('.guess-number').disabled = false;
                    }else {
                        wrongGuess();
                        primaryBtnEl.textContent = 'Try again';
                        displayMessage('You lose!');
                        newGame = false;
                        document.querySelector('.guess-number').disabled = true;
                        primaryBtnEl.style.background = btnColor('failed');
                    }
                }
            } else {
                displayMessage('Guess is out of range');
                errorBorder.classList.add('border-red');
            }
        }
    }

    // switch (animate) {
    //     case true:
    //         messageTextEl.classList.add('pulsate-true')
    //         messageTextEl.classList.remove('pulsate-false') 
    //         animate = false;
    //         break;
    //     case false:
    //         messageTextEl.classList.add('pulsate-false') 
    //         messageTextEl.classList.remove('pulsate-true')
    //         animate = true;
    //         break;
    // }
    // console.log(animate);
    // console.log(messageTextEl.classList);
})


// Reset the Game
secondaryBtnEl.addEventListener('click', () => {
    restoreHearts();
    init();
    domReset()
    newGame = false;
    secretNum = Math.trunc(Math.random() * `${levelNum}`) + 1;
    primaryBtnEl.style.background = btnColor('primary');
});
