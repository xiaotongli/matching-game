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

const modalClose = document.querySelector('.close');
const availCards = document.querySelectorAll('li.card');
const cardIcons = document.querySelectorAll('li.card i');
const restartButton = document.querySelector('.restart'); 
const stars = document.querySelector('.stars'); 


moveCounterDisplay.innerHTML = moveCounter;

var trackedTime = [0,0];
var activeTimeTracker;

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/* EVENT LISTENERS */

restartButton.addEventListener('click', restartGame);

// need to redo this for performance -- custom Div? though that killed the design last time
for (var i = 0; i < availCards.length; ++i) {
    availCards[i].addEventListener('click', showCard);
} 

modalClose.addEventListener('click', closeModal);

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

function showCard(event) { //BUG: need to not be able to select the same card twice
    if (openCards.length < 2) { //show face of card
        event.target.classList.add('open', 'show'); 
    } 

    openCards.push(event.target);
    if (openCards.length === 2) { //add to open card list
        const firstIcon = openCards[0].firstElementChild.classList.value;
        const secondIcon = openCards[1].firstElementChild.classList.value;

        if (firstIcon === secondIcon) {
            for (const card of openCards) {
                card.classList.add('match');
                card.classList.remove('open', 'show');
            }
            matchedCards += 1;
            openCards = [];
        } else {
            setTimeout(() => {
                for (const card of openCards) {
                    card.classList.remove('open', 'show');
                }
                openCards = [];
            }, 500);
        }

    addMove();
    }

    if (moveCounter === 15 || moveCounter === 20) { // when to remove stars
        stars.removeChild(stars.lastChild);
    }

    if (trackedTime[0] == 0 && trackedTime[1] == 0 && openCards.length === 1 && moveCounter === 0) {
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

    displayTime();
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
            modalMsg.innerHTML = 'Nice! <br><br> You have earned 1 of the 3 stars by completing all matches in ' + trackedTime[1] + ' seconds. <br><br> Play again and try to get all 3 stars!';
        }
    } else {
        if (moveCounter <= 15) {
            modalMsg.innerHTML = 'Congrats! You are a MONSTER. <br><br> You have earned all 3 stars by completing all matches in ' + trackedTime[0] + ' minute(s) ' + trackedTime[1] + ' seconds.';
        }

        if (moveCounter > 15 && moveCounter <= 20) {
            modalMsg.innerHTML = 'Congrats! That was a great job done. <br><br> You have earned 2 of the 3 stars by completing all matches in ' + trackedTime[0] + ' minute(s) ' + trackedTime[1] + ' seconds.';
        } 

        if (moveCounter > 20) {
            modalMsg.innerHTML = 'Nice! <br><br> You have earned 1 of the 3 stars by completing all matches in ' + trackedTime[0] + ' minute(s) ' + trackedTime[1] + ' seconds. <br><br> Play again and try to get all 3 stars!';
        }
    }    
}

function closeModal() {
    modal.style.display = 'none';
}

function restartGame() {
    i = 0;
    cardList = shuffle(cardList);

    for (var i = 0; i < availCards.length; ++i) {
        availCards[i].classList.remove('open', 'show', 'match');
    }
    
    for (var i = 0; i < availCards.length; ++i) {
        cardIcons[i].className = cardList[i];
    } 

    moveCounter = 0;
    moveCounterDisplay.innerHTML = moveCounter;

    while (stars.childElementCount < 3) {
        const star = document.createElement('li'); 
        star.innerHTML = '<i class="fa fa-star"></i>'; //better way to do this than declare every time?
        stars.appendChild(star);
    }

    resetTime();
}

