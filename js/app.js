/* VARIABLES */

var cardList = ["fas fa-lemon", "fas fa-lemon", 
    "fas fa-hotdog", "fas fa-hotdog",
    "fas fa-beer", "fas fa-beer",
    "fas fa-cocktail", "fas fa-cocktail", 
    "fas fa-hamburger", "fas fa-hamburger",
    "fas fa-cookie-bite", "fas fa-cookie-bite", 
    "fas fa-ice-cream", "fas fa-ice-cream",
    "fas fa-carrot", "fas fa-carrot"]; 

var openCards = [];
var matchedCards = 0;
var moveCounter = 0;

var moveCounterDisplay = document.querySelector('.moves');
var trackedTimeDisplay = document.querySelector('.timer');
var modal = document.querySelector('.modal');
var modalMsg = document.querySelector('.modal-msg');
var availCards = document.querySelectorAll('li.card');

const modalClose = document.querySelector('.close');
const cardIcons = document.querySelectorAll('li.card i');
const restartButton = document.querySelector('.restart'); 
const stars = document.querySelector('.stars'); 
const playAgain = document.querySelector('.play-again');


moveCounterDisplay.innerHTML = moveCounter;

var trackedTime = [0,0];
var activeTimeTracker;

/* EVENT LISTENERS */

restartButton.addEventListener('click', restartGame);

for (var i = 0; i < availCards.length; ++i) {
    availCards[i].addEventListener('click', showCard);
} 

modalClose.addEventListener('click', closeModal);

playAgain.addEventListener('click', restartGame);

/* FUNCTIONS */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function addMove() {
    moveCounter += 1;
    moveCounterDisplay.innerHTML = moveCounter;
}

function showCard(event) {
    if (event.target.classList.contains('card') && !event.target.classList.contains('match')) {
        if (openCards.length < 2) { //show face of card if not already shown
            event.target.classList.add('open'); 
        } 

        if (event.target != openCards[0]) {
            openCards.push(event.target);
        }
    }

    if (openCards.length === 2) { //add to open card list
        const firstIcon = openCards[0].firstElementChild.classList.value;
        const secondIcon = openCards[1].firstElementChild.classList.value;

        if (firstIcon === secondIcon) {
            for (const card of openCards) {
                card.classList.add('match');
                card.classList.remove('open');
            }
            matchedCards += 1;
            openCards = [];
        } else {
            setTimeout(() => {
                for (const card of openCards) {
                    card.classList.remove('open');
                }
                openCards = [];
            }, 500);
        }

    addMove();
    }

    if (moveCounter === 15 || moveCounter === 20) { // when to remove stars
        if (stars.childElementCount > 1) {
            stars.removeChild(stars.lastChild);
        }
    }

    if (trackedTime[0] == 0 && trackedTime[1] == 0 && openCards.length === 1 && moveCounter === 0 && matchedCards === 0) {
        startTime(); // all conditions needed to hold off multiple startTimes upon fast clicks
    }

    if (matchedCards === 8) {
        console.log('You win!');
        winGame();
        matchedCards = 0;
    }
}

function startTime() {
    activeTimeTracker = setInterval(trackTime,1000);
}

function stopTime() {
    clearInterval(activeTimeTracker);
    
    displayTime();
}

function resetTime() {
    trackedTime = [0,0];

    stopTime();
}

function trackTime() {
    trackedTime[1] += 1;

    if (trackedTime[1] === 60) {
        trackedTime[1] = 0;
        trackedTime[0] += 1;
    }

    displayTime();
}

function displayTime(){
    if (trackedTime[1] < 10 && trackedTime[0] < 10) {
        trackedTimeDisplay.innerHTML = 'Time: 0' + trackedTime[0] + ':0' + trackedTime[1];
    } 

    if (trackedTime[1] < 10 && trackedTime[0] >= 10) {
        trackedTimeDisplay.innerHTML = 'Time: ' + trackedTime[0] + ':0' + trackedTime[1];
    }

    if (trackedTime[1] >= 10 && trackedTime[0] < 10) {
        trackedTimeDisplay.innerHTML = 'Time: 0' + trackedTime[0] + ':' + trackedTime[1];
    }

    if (trackedTime[1] >= 10 && trackedTime[0] >= 10) {
        trackedTimeDisplay.innerHTML = 'Time: ' + trackedTime[0] + ':' + trackedTime[1];
    }
}

function winGame() {
    stopTime();
    modal.style.display = 'block';
    
    if (trackedTime[0] === 0) {
        if (moveCounter <= 15) {
            modalMsg.innerHTML = 'Congrats! You are a MONSTER. <br><br> You have earned all 3 stars by completing all matches in only ' + trackedTime[1] + ' seconds.';
        }

        if (moveCounter > 15 && moveCounter <= 20) {
            modalMsg.innerHTML = 'Congrats! That was a great job done. <br><br> You have earned 2 of the 3 stars by completing all matches in ' + trackedTime[1] + ' seconds.';
        } 

        if (moveCounter > 20) {
            modalMsg.innerHTML = 'Nice! <br><br> You have earned 1 of the 3 stars by completing all matches in ' + trackedTime[1] + ' seconds.';
        }
    } else {
        if (moveCounter <= 15) {
            modalMsg.innerHTML = 'Congrats! You are a MONSTER. <br><br> You have earned all 3 stars by completing all matches in ' + trackedTime[0] + ' minute(s) ' + trackedTime[1] + ' seconds.';
        }

        if (moveCounter > 15 && moveCounter <= 20) {
            modalMsg.innerHTML = 'Congrats! That was a great job done. <br><br> You have earned 2 of the 3 stars by completing all matches in ' + trackedTime[0] + ' minute(s) ' + trackedTime[1] + ' seconds.';
        } 

        if (moveCounter > 20) {
            modalMsg.innerHTML = 'Nice! <br><br> You have earned 1 of the 3 stars by completing all matches in ' + trackedTime[0] + ' minute(s) ' + trackedTime[1] + ' seconds.';
        }
    }    

    modalMsg.innerHTML += "<br><br>Play again? <br><br>";
}

function closeModal() {
    modal.style.display = 'none';
}

function restartGame() {
    i = 0;
    cardList = shuffle(cardList);

    for (var i = 0; i < availCards.length; ++i) {
        availCards[i].classList.remove('open', 'match');
    }
    
    for (var i = 0; i < availCards.length; ++i) {
        cardIcons[i].className = cardList[i];
    } 

    moveCounter = 0;
    moveCounterDisplay.innerHTML = moveCounter;

    while (stars.childElementCount < 3) {
        const star = document.createElement('li'); 
        star.innerHTML = '<i class="fa fa-star"></i>';
        stars.appendChild(star);
    }

    matchedCards = 0; 
    openCards = [];
    resetTime();
    closeModal();
}

