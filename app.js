// window.onload = () => {
//   // while (true) {
//   //   console.log(1);
//   // }
// };

const board = new Array(9).fill(null);
let boardDiv = [...document.querySelectorAll('.board')];

const startGame = e => {
  e.preventDefault();
  let user = 1;
  document.getElementById('player').innerText = document.getElementById(
    'name'
  ).value;

  // console.log(boardDiv);
  boardDiv.forEach(b => {
    b.addEventListener('click', e => placeMove(e, user));
  });
};
const placeMove = (e, user) => {
  // console.log(user);
  let shape;
  shape = document.createElement('h1');
  shape.className += 'big';

  if (user === 1) {
    shape.innerText = 'X';
  } else {
    shape.innerText = 'O';
  }
  const divId = e.target.id;
  if (!board[divId]) {
    board[divId] = shape;
    boardDiv[divId].appendChild(board[divId]);
  } else {
    console.log('Invalid move');
  }

  // e.target.appendChild(x);
  // console.log(e.target.id);
  // let div = e.target.id;

  // board[div] = x;
  // console.log(board);
  // board.forEach((el, i) => {
  //   if (el) {
  //     document.getElementById(i).appendChild(el);
  //   } else {
  //     // console.log('invalid');
  //   }
  // });
};

const win = () => true;
