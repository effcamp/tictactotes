// window.onload = () => {
//   // while (true) {
//   //   console.log(1);
//   // }
// };

const board = new Array(9).fill(null);
let boardDiv = [...document.querySelectorAll('.board')];
let gameCount = 0;

const startGame = e => {
  document.getElementById('player').innerText = document.getElementById(
    'name'
  ).value;
  let user = 1;

  e.preventDefault();
  // console.log(boardDiv);
  boardDiv.forEach(b => {
    b.addEventListener('click', e => placeMove(e, user));
  });
  while (gameCount < 5) {
    user = user === 1 ? 2 : 1;
    console.log('user ' + user);
    console.log('game ' + gameCount);
    console.log(board);
    gameCount++;
  }
};

const placeMove = async (e, user) => {
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
  }
  console.log('test');
};

const win = () => true;
