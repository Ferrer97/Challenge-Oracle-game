const init = document.getElementById("btn-play");
const addWord = document.getElementById("btn-add");
const canvas = document.getElementById("canvas");
const usedLettersElement = document.getElementById("usedLetters");
const wordContainer = document.getElementById("wordContainer");

let ctx = canvas.getContext("2d");
ctx.canvas.width = 0;
ctx.canvas.height = 0;

const bodyParts = [
  [4, 2, 1, 1], // Head
  [4, 3, 1, 2], // Back
  [3, 5, 1, 1], // Leg left
  [5, 5, 1, 1], // Leg right
  [3, 3, 1, 1], // Arm left
  [5, 3, 1, 1], // Arm right
];

const words = [
  "css",
  "javascript",
  "div",
  "html",
  "flexbox",
  "grid",
  "margin",
  "padding",
  "array",
  "object",
  "null",
];

let selectdWord;
let usedLetters;
let mistakes;
let hits;

window.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("words", JSON.stringify(words));
});

const drawHangMan = () => {
  ctx.canvas.width = 200;
  ctx.canvas.height = 240;
  ctx.scale(20, 20);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#31087B";
  ctx.fillRect(0, 7, 4, 1);
  ctx.fillRect(1, 0, 1, 8);
  ctx.fillRect(2, 0, 3, 1);
  ctx.fillRect(4, 1, 1, 1);
};

const selectRandonWord = () => {
  const available = JSON.parse(localStorage.getItem("words"));

  let word = available[Math.floor(Math.random() * available.length)].toUpperCase();
  selectdWord = word.split("");
};

const drawLetters = () => {
  selectdWord.forEach((letter) => {
    const letterElement = document.createElement("span");
    letterElement.textContent = letter.toUpperCase();
    letterElement.classList.add("underline");
    letterElement.classList.add("hidden");
    wordContainer.appendChild(letterElement);
  });
};

const gameOver = (msg) => {
  document.removeEventListener("keydown", keyPress);
  const header = document.querySelector("header");

  const paragraph = document.createElement("p");
  paragraph.textContent = msg;
  paragraph.classList.add("msg");

  const message = document.querySelectorAll("msg");

  if (message.length === 0) {
    header.appendChild(paragraph);
    setTimeout(() => {
      paragraph.remove();
    }, 1000);
  }
};

const addLetter = (letter) => {
  const letterElement = document.createElement("span");
  letterElement.innerHTML = letter;
  usedLettersElement.appendChild(letterElement);
};

const addBodyPart = (bodyPart) => {
  ctx.fillStyle = "#FF0012";
  ctx.fillRect(...bodyPart);
};

const wrongLetter = () => {
  addBodyPart(bodyParts[mistakes]);
  mistakes++;
  if (mistakes === bodyParts.length) {
    gameOver("Perdiste");
  }
};

const confirmLetter = (letter) => {
  const { children } = wordContainer;
  for (let i = 0; i < children.length; i++) {
    if (children[i].innerHTML === letter) {
      children[i].classList.toggle("hidden");
      hits++;
    }
  }
  if (hits === selectdWord.length) {
    gameOver("Ganaste");
  }
};

const letterInput = (letter) => {
  if (selectdWord.includes(letter)) {
    confirmLetter(letter);
  } else {
    wrongLetter();
  }
  addLetter(letter);
  usedLetters.push(letter);
};

const keyPress = (evt) => {
  let newLetter = evt.key.toUpperCase();
  if (newLetter.match(/^[a-zñ]$/i) && !usedLetters.includes(newLetter)) {
    letterInput(newLetter);
  }
};

const UIInitGame = () => {
  // Scripting
  const main = document.querySelector("main");
  const form = document.querySelector("form");
  const btnAdd = document.getElementById("btn-add");
  const btnPlay = document.getElementById("btn-play");

  // Create elements
  const sectionGame = document.createElement("section");
  const divElemnt = document.createElement("div");
  const btnNewGame = document.createElement("button");
  const btnQuitGame = document.createElement("button");

  divElemnt.classList.add("flex-btns"); //Todo flex btn in 970px
  if (form) {
    form.style.display = "none";
  }

  // Btns styles and atributes
  btnNewGame.setAttribute("id", "btnNext");
  btnQuitGame.setAttribute("id", "btnQuit");
  btnAdd.style.display = "none";
  btnPlay.style.display = "none";

  btnNewGame.textContent = "siguiente Palabra";
  btnQuitGame.textContent = "Rendirse";

  btnNewGame.classList.add("main__btn");
  btnQuitGame.classList.add("main__btn");

  divElemnt.append(btnNewGame, btnQuitGame);
  sectionGame.append(divElemnt);
  main.appendChild(sectionGame);
  startingGame();
};

const startingGame = () => {
  const btnNextWord = document.getElementById("btnNext");
  const btnQuitGame = document.getElementById("btnQuit");
  usedLetters = [];
  mistakes = 0;
  hits = 0;
  wordContainer.textContent = "";
  usedLettersElement.textContent = "";
  drawHangMan();
  selectRandonWord();
  drawLetters();
  document.addEventListener("keydown", keyPress);
  btnNextWord.addEventListener("click", startingGame);
  btnQuitGame.addEventListener("click", quitingGame);
};

const quitingGame = () => {
  gameOver('intenta con otra palabra');
  startingGame();
};

const UIAddNewWord = () => {
  // Scripting
  const main = document.querySelector("main");
  const btnPlay = document.getElementById("btn-play");
  const btnAdd = document.getElementById("btn-add");

  // Create elements
  const form = document.createElement("form");
  const label = document.createElement("label");
  const textarea = document.createElement("textarea");
  const buttonSave = document.createElement("button");
  const buttonCancel = document.createElement("button");

  // Add class and atributes to elements

  // label and section
  label.textContent = "Añade aqui tu palabra al juego del ahoracado";
  label.setAttribute("for", "textarea");
  label.classList.add("main__label");

  // Textarea
  textarea.classList.add("textarea");
  textarea.setAttribute("id", "textarea");
  textarea.placeholder = "Escribe tu nueva palabra";
  textarea.rows = "10";
  textarea.cols = "30";

  // Buttons
  btnAdd.style.display = "none";
  btnPlay.style.display = "none";
  buttonSave.setAttribute("id", "btnAdd");
  buttonSave.type = "submit";
  buttonCancel.setAttribute("id", "btnCancel");

  buttonSave.textContent = "Guardar y Empezar";
  buttonCancel.textContent = "Cancelar";

  buttonSave.classList.add("main__btn", "main__btn-disabled");
  buttonSave.disabled = true;
  buttonCancel.classList.add("main__btn");

  // append elemnts to HTML
  form.append(label, textarea, buttonSave, buttonCancel);
  main.appendChild(form);

  textarea.addEventListener("blur", saveNewWord);
  buttonSave.addEventListener("click", saveNewWord);
};

const saveNewWord = (evt) => {
  evt.preventDefault();
  const regex = /^[A-Za-z]+$/;
  const buttonSave = document.querySelector("#btnAdd");
  const newWord = evt.target.value;

  if (evt.target.type === "textarea") {
    if (!regex.test(newWord) || newWord.length <= 2) {
      errorMsg("palabra no valida");
      buttonSave.classList.add("main__btn-disabled");
    } else {
      const error = document.querySelector(".error");
      buttonSave.disabled = false;
      if (error) {
        error.remove();
      }
      buttonSave.classList.remove("main__btn-disabled");
      words.push(newWord);
    }
  }
  if (evt.target.type === "submit") {
    let listOfWords = localStorage.getItem("words");
    listOfWords = [...words];
    localStorage.setItem("words", JSON.stringify(listOfWords));
    UIInitGame();
  }
};

const errorMsg = (msg) => {
  const textarea = document.querySelector("textarea").nextElementSibling;
  const form = document.querySelector("form");

  const paragraph = document.createElement("p");
  paragraph.textContent = msg;
  paragraph.classList.add("error");

  const error = document.querySelectorAll(".error");

  if (error.length === 0) {
    form.insertBefore(paragraph, textarea);
  }
};

const eventListener = () => {
  init.addEventListener("click", UIInitGame);
  addWord.addEventListener("click", UIAddNewWord);
};

eventListener();
