// window.onload = () => {
//   // while (true) {
//   //   console.log(1);
//   // }
// };
const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

const empty = {
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
  8: null
};

const games = db.collection('games');
let gameId;
let gameA;

const board = new Array(9).fill(null);
let boardDiv = [...document.querySelectorAll('.board')];
let name;
let user = 1;
let turn;
let win;

const startGame = async e => {
  e.preventDefault();
  name = document.getElementById('name').value;
  document.getElementById('player').innerText = name;

  const game = await games.get();

  const queuedGame = [];
  game.forEach(g => {
    if (!g.data().player1 || !g.data().player2) {
      queuedGame.push(g);
    }
  });
  if (queuedGame.length === 0) {
    const newGame = await games.add({
      player1: name
    });
    gameId = newGame.id;
    // use localstorage to save
  } else {
    if (!queuedGame[0].data().player2) {
      await games.doc(queuedGame[0].id).update({
        player2: name
      });

      gameId = queuedGame[0].id;
    } else if (!queuedGame[0].data().player1) {
      await games.doc(queuedGame[0].id).update({
        player1: name
      });

      gameId = queuedGame[0].id;
    }
  }
  gameA = games.doc(gameId);

  boardDiv.forEach(b => {
    b.addEventListener('click', e => placeMove(e));
  });
  await gameA.update({
    ...empty,
    turn: 1
  });

  // console.log(games.doc(gameId).update({ turn: 1 }));
};
const nextMove = async () => {
  turn === 1
    ? await gameA.update({ turn: 2 })
    : await gameA.update({ turn: 1 });
};

const placeMove = async e => {
  let shape;
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
        checkWin();
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
        checkWin();
        nextMove();
      }
    }
  }
  temp = await gameA.get();
  console.log(temp.data());

  // FIX THIS
  for (const key in temp) {
    if (key === boardDiv.id) {
      boardDiv[key].innerText = temp.data()[key];
      console.log(key, boardDiv.id);
    }
  }

  // .forEach(b => {
  //   // console.log(temp.data()[b.id]);
  //   if (b.id === temp.data()[b.id]) {
  //     b.innerText = temp.data()[b.id];
  //     console.log(b);
  //   }
  // });
};

const checkWin = () => {
  const check = board.filter(b => b === null);
  if (check.length === 0) {
    console.log('Draw!');
    alert('Draw!');
  }
};
