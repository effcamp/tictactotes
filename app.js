// window.onload = () => {
//   // while (true) {
//   //   console.log(1);
//   // }
// };

const board = new Array(9).fill(null);
let boardDiv = [...document.querySelectorAll('.board')];
let gameCount = 0;
let user = 1;
let win;

const startGame = e => {
  document.getElementById('player').innerText = document.getElementById(
    'name'
  ).value;

  e.preventDefault();
  // console.log(boardDiv);
  boardDiv.forEach(b => {
    b.addEventListener('click', e => placeMove(e));
  });
};
const nextMove = () => {
  user = user === 1 ? 2 : 1;
  console.log(board);
};

const placeMove = async e => {
  // console.log(user);
  let shape;

  if (user === 1) {
    shape = 'X';
  } else {
    shape = 'O';
  }
  const divId = e.target.id;
  if (board[divId] === null) {
    board[divId] = shape;
    boardDiv[divId].innerText = board[divId];
    boardDiv[divId].removeEventListener('click', () => placeMove());
    checkWin();
    nextMove();
  }
};

const checkWin = () => {
  const check = board.filter(b => b === null);
  if (check.length === 0) {
    console.log('Draw!');
    alert('Draw!');
  }
};
