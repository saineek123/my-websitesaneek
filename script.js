// Timer countdown (60 seconds)
let timeLeft = 60;
const timerEl = document.getElementById('timer');
const periodValueEl = document.getElementById('period-value');
let period = 1; // Start from 1

// Elements
const colorButtons = document.querySelectorAll('.color-buttons button');
const numberButtons = document.querySelectorAll('.numbers button');
const multiplierButtons = document.querySelectorAll('.multiplier button');
const bigSmallButtons = document.querySelectorAll('.bigsmall button');
const betInput = document.getElementById('bet-input');
const placeBetBtn = document.getElementById('place-bet-btn');
const betHistoryDiv = document.getElementById('bet-history');

// Store current selections
let selectedColor = null;
let selectedNumber = null;
let selectedMultiplier = 1;
let selectedBigSmall = null;

// Bet history array
let betHistory = [];

// Update timer every second
function updateTimer() {
  if (timeLeft <= 0) {
    timeLeft = 60;
    period++;
    periodValueEl.textContent = period;
    clearSelections();
  } else {
    timeLeft--;
  }
  timerEl.textContent = `00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;
}

setInterval(updateTimer, 1000);

// Clear all selections and input
function clearSelections() {
  selectedColor = null;
  selectedNumber = null;
  selectedMultiplier = 1;
  selectedBigSmall = null;

  colorButtons.forEach(b => b.classList.remove('active'));
  numberButtons.forEach(b => b.classList.remove('active'));
  multiplierButtons.forEach(b => b.classList.remove('active'));
  bigSmallButtons.forEach(b => b.classList.remove('active'));
  
  // Reset multiplier to x1 by default
  multiplierButtons.forEach(btn => {
    if(btn.textContent === 'x1'){
      btn.classList.add('active');
    }
  });

  betInput.value = '';
}

// Helper function to update bet history UI
function renderBetHistory() {
  if(betHistory.length === 0){
    betHistoryDiv.innerHTML = '<p>No bets placed yet.</p>';
    return;
  }
  betHistoryDiv.innerHTML = '';
  betHistory.slice().reverse().forEach((bet) => {
    const div = document.createElement('div');
    div.classList.add('bet-item');
    div.textContent = `Period: ${bet.period} | Color: ${bet.color || '-'} | Number: ${bet.number || '-'} | Big/Small: ${bet.bigSmall || '-'} | Multiplier: x${bet.multiplier} | Amount: ₹${bet.amount}`;
    betHistoryDiv.appendChild(div);
  });
}

// Handle color buttons click
colorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    colorButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedColor = btn.textContent;
  });
});

// Handle number buttons click
numberButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    numberButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedNumber = btn.getAttribute('data-number');
  });
});

// Handle multiplier buttons click
multiplierButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    multiplierButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if(btn.textContent.toLowerCase() === 'random'){
      // Random multiplier between 1 and 100
      selectedMultiplier = Math.floor(Math.random() * 100) + 1;
      btn.textContent = 'x' + selectedMultiplier;
    } else {
      selectedMultiplier = parseInt(btn.textContent.replace('x', ''));
      // Reset random button text if needed
      multiplierButtons.forEach(b=>{
        if(b.textContent !== 'random' && !b.classList.contains('active') && b.textContent.startsWith('x')){
          // do nothing
        } else if(b.textContent.toLowerCase() === 'random' && !b.classList.contains('active')){
          b.textContent = 'Random';
        }
      });
    }
  });
});

// Handle Big/Small buttons click
bigSmallButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    bigSmallButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedBigSmall = btn.textContent;
  });
});

// Place bet button
placeBetBtn.addEventListener('click', () => {
  const amount = parseInt(betInput.value);
  if(!amount || amount < 1){
    alert('Please enter a valid bet amount!');
    return;
  }

  // At least one bet criteria must be selected: color, number, or big/small
  if(!selectedColor && !selectedNumber && !selectedBigSmall){
    alert('Please select at least one bet option: Color, Number or Big/Small.');
    return;
  }

  // Save bet
  const bet = {
    period: period,
    color: selectedColor,
    number: selectedNumber,
    bigSmall: selectedBigSmall,
    multiplier: selectedMultiplier,
    amount: amount
  };
  betHistory.push(bet);

  renderBetHistory();
  clearSelections();
  alert('Bet placed successfully for Period ' + period);
});

// On page load, set default multiplier x1 active
window.onload = () => {
  multiplierButtons.forEach(btn => {
    if(btn.textContent === 'x1'){
      btn.classList.add('active');
    }
  });
  renderBetHistory();
};


import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const db = getDatabase();

export function fetchUserBalance(userId, callback) {
  const userRef = ref(db, "users/" + userId + "/wallet");

  onValue(userRef, (snapshot) => {
    const balance = snapshot.val();
    callback(balance);
  });
}
