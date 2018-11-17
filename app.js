const x = document.createElement('h1');
x.innerText = 'X';
const o = document.createElement('h1');
o.innerText = 'O';
x.className += 'big';
o.className += 'big';
const placeMove = e => {
  e.appendChild(x);
  // console.log(e.target);
};
