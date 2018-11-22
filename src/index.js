const firebase = require('firebase/app');
require('firebase/firestore');
require('dotenv').config();

// Initialize Firebase
const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: 'tictactotes-7527a',
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
};
firebase.initializeApp(config);

const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

const gamesList = db.collection('games');
let gameA;

const board = [null, null, null, null, null, null, null, null, null];
let boardDiv = [...document.querySelectorAll('.board')];
let player1 = null;
let name;
let turn;
let shape;

document.getElementById('start').addEventListener('click', e => startGame(e));

const startGame = async e => {
  e.preventDefault();
  name = document.getElementById('name').value;
  document.getElementById('player').innerText = name;
  document.getElementById('name').remove();
  document.getElementById('start').remove();
  const games = await gamesList.get();

  const queuedGame = [];
  // TODO: delete any leftover games
  games.forEach(g => {
    if (!g.data().player1 || !g.data().player2) {
      queuedGame.push(g);
    }
  });
  if (queuedGame.length === 0) {
    const newGame = await gamesList.add({
      player1: name
    });
    gameA = gamesList.doc(newGame.id);
    player1 = true;
    // use localstorage to save
  } else {
    if (!queuedGame[0].data().player2) {
      await gamesList.doc(queuedGame[0].id).update({
        player2: name
      });
      gameA = gamesList.doc(queuedGame[0].id);
      player1 = false;
    } else if (!queuedGame[0].data().player1) {
      await gamesList.doc(queuedGame[0].id).update({
        player1: name
      });

      gameA = gamesList.doc(queuedGame[0].id);
      player1 = true;
    }
  }

  boardDiv.forEach(b => {
    b.addEventListener('click', e => placeMove(e));
  });
  await gameA.update({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    turn: 1,
    winner: null
  });

  const unsubscribe = gameA.onSnapshot(snapshot => {
    for (const key in snapshot.data()) {
      if (key >= 0 && key <= 8) {
        boardDiv[key].innerText = snapshot.data()[key];
        board[key] = snapshot.data()[key];
      }
    }
    if (snapshot.data().winner) {
      showModal(snapshot.data().winner);
    } else if (
      snapshot.data().player1 === null ||
      snapshot.data().player2 === null
    ) {
      const msg = 'The other player has quit';
      showModal(msg);
      gameA.delete();
    }
  });
  if (!gameA) {
    unsubscribe();
    // console.log(unsubscribe);
  }
};
const nextMove = async () => {
  turn === 1
    ? await gameA.update({ turn: 2 })
    : await gameA.update({ turn: 1 });
};

const placeMove = async e => {
  let temp = await gameA.get();
  turn = temp.data().turn;

  if (turn === 1) {
    shape = 'X';
    if (temp.data().player1 === name) {
      // console.log(temp.data().player1);
      const divId = e.target.id;
      if (temp.data()[divId] === null) {
        const update = { [divId]: shape };
        await gameA.update(update);
        checkWin(shape);
        nextMove();
      }
    }
  } else {
    shape = 'O';
    if (temp.data().player2 === name) {
      const divId = e.target.id;
      if (temp.data()[divId] === null) {
        const update = { [divId]: shape };
        await gameA.update(update);
        checkWin(shape);
        nextMove();
      }
    }
  }
};

const checkWin = shape => {
  if (
    (board[0] === shape && board[1] === shape && board[2] === shape) ||
    (board[3] === shape && board[4] === shape && board[5] === shape) ||
    (board[6] === shape && board[7] === shape && board[8] === shape) ||
    (board[0] === shape && board[4] === shape && board[8] === shape) ||
    (board[2] === shape && board[4] === shape && board[6] === shape) ||
    (board[0] === shape && board[3] === shape && board[6] === shape) ||
    (board[1] === shape && board[4] === shape && board[7] === shape) ||
    (board[2] === shape && board[5] === shape && board[8] === shape)
  ) {
    // boardDiv.forEach(b => b.removeEventListener('click', () => placeMove()));
    gameA.update({ winner: shape });
  } else {
    const check = board.filter(i => i === null);
    if (check.length === 0) {
      gameA.update({ winner: 'Draw!' });
    }
  }
};

const showModal = txt => {
  document.querySelector('.modal').classList.remove('modal-hidden');
  document.querySelector('#winner').innerHTML = txt;
  document.querySelector('#exit').addEventListener('click', () => newGame());
};

const newGame = () => {
  document.querySelector('.modal').classList.add('modal-hidden');
  gameA.delete();
  location.reload();
};

window.addEventListener('beforeunload', async () => {
  if (gameA) {
    if (player1) {
      await gameA.update({ player1: null });
    } else {
      await gameA.update({ player2: null });
    }
  }
});
