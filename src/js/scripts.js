const backspace = "\u27F5";
const division = "\u00f7";
const multiply = "\u00d7";
const minus = "\u2212";
const plus = "\u002b";
const squareRoot = "\u221A";
const degree = "\u2303y";

const btnArr = [
  { name: "totleReset", value: "C" },
  { name: "resetTheLastEntry", value: "CE" },
  { name: "backspace", value: backspace },
  { name: "1/x", value: "1/x" },
  { name: "+/-", value: "+/-" },
  { name: "resetMemmory", value: "MC" },
  { name: "extractMemmory", value: "MR" },
  { name: "loadMemmory", value: "MS" },
  { name: "addToMemmory", value: "M+" },
  { name: "subtractFromMemmory", value: "M-" },
  { name: "seven", value: "7" },
  { name: "eight", value: "8" },
  { name: "nine", value: "9" },
  { name: "division", value: division },
  { name: "squareRoot", value: squareRoot },
  { name: "four", value: "4" },
  { name: "five", value: "5" },
  { name: "six", value: "6" },
  { name: "multiply", value: multiply },
  { name: "degree", value: degree },
  { name: "one", value: "1" },
  { name: "two", value: "2" },
  { name: "three", value: "3" },
  { name: "minus", value: minus },
  { name: "equals", value: "=" },
  { name: "zero", value: "0" },
  { name: "point", value: "." },
  { name: "plus", value: plus },
];

const displayTopRow = document.querySelector(".calculator__display--top-row");
const displayBottomRow = document.querySelector(
  ".calculator__display--show-result"
);

const freeMemory = document.querySelector(".calculator__display--show-memory");
let inputArr = [];
let currentArr = [];
let toDisplayOutput = 0;
let button;
let operand = [];
let flagPoint = false;
let flagEquals = true;
let memory = 0;

const panel = document.querySelector(".calculator__buttons");

btnArr.forEach((el) => {
  panel.innerHTML += `<li data-name = ${el.name}>` + el.value + `</li>`;
});

displayBottomRow.textContent = 0;

panel.onclick = function (event) {
  let target = event.target;
  if (target.tagName != "LI") return;
  handlerSelectButton(target);
};

function handlerSelectButton() {
  btnArr.forEach((el) => {
    if (event.target.dataset.name == el.name) {
      button = el.value;
    }
  });

  if (button != backspace && button != "CE" && button != ".") {
    displayBottomRow.classList.add("smoll-font");
    displayTopRow.classList.remove("smoll-font");
  }
  for (key in btnAction) {
    if (button == [key]) {
      btnAction[key]();
    }
  }

  displayTopRow.textContent = inputArr.join("");

  if (inputArr.length == 0) {
    displayBottomRow.textContent = "0";
    displayBottomRow.classList.remove("smoll-font");
  }

  memory
    ? freeMemory.classList.add("memory-full")
    : freeMemory.classList.remove("memory-full");
}

let btnAction = {
  0() {
    if (flagEquals) {
      PressBtnC();
    }
    if (
      inputArr[inputArr.length - 1] == 0 &&
      isNaN(inputArr[inputArr.length - 2]) &&
      inputArr[inputArr.length - 2] != "."
    ) {
    } else if (
      inputArr[inputArr.length - 1] == "⌃-1" ||
      inputArr[inputArr.length - 1] == "⌃0.5"
    ) {
    } else {
      inputArr.push(button);
    }
    calculate();
    flagEquals = 0;
  },

  1() {
    if (flagEquals) {
      PressBtnC();
    }
    if (
      inputArr[inputArr.length - 1] == 0 &&
      isNaN(inputArr[inputArr.length - 2]) &&
      inputArr[inputArr.length - 2] != "."
    ) {
      inputArr.pop();
      inputArr.push(button);
    } else if (
      inputArr[inputArr.length - 1] == "⌃-1" ||
      inputArr[inputArr.length - 1] == "⌃0.5"
    ) {
    } else {
      inputArr.push(button);
    }
    calculate();
    flagEquals = 0;
  },
  2() {
    this[1]();
  },
  3() {
    this[1]();
  },
  4() {
    this[1]();
  },
  5() {
    this[1]();
  },
  6() {
    this[1]();
  },
  7() {
    this[1]();
  },
  8() {
    this[1]();
  },
  9() {
    this[1]();
  },

  /*--------- point --------------*/
  "."() {
    flagEquals ? (flagPoint = false) : (flagPoint = true);

    if (isNaN(inputArr[inputArr.length - 1])) {
      flagPoint = false;
    }

    for (let i = inputArr.length - 1; i >= 0; i--) {
      if (isNaN(inputArr[i]) && inputArr[i] != ".") {
        break;
      }

      if (inputArr[i] == ".") {
        flagPoint = false;
        break;
      }
    }

    if (flagPoint) {
      inputArr.push(button);
    }
    flagEquals = 0;
  },

  /*--------- backspace ---------------------*/
  "\u27F5"() {
    if (!flagEquals) {
      inputArr.pop();
      if (!isNaN(inputArr[inputArr.length - 1])) {
      }
      calculate();
    }
  },

  /*------------ minus ------------------------*/

  "\u2212"() {
    applyFlagEquals();

    if (
      inputArr.length > 0 &&
      isNaN(inputArr[inputArr.length - 1]) &&
      inputArr[inputArr.length - 1] != "⌃-1" &&
      inputArr[inputArr.length - 1] != "⌃0.5"
    ) {
      inputArr.pop();
      inputArr.push(button);
      calculate();
    } else {
      inputArr.push(button);
    }
  },

  /*----------- plus ---------------*/
  "\u002b"() {
    this["\u2212"]();
    if (inputArr[0] == button) {
      inputArr.pop();
    }
  },

  /*---------- 1/x ---------------------- */
  "1/x"() {
    applyFlagEquals();
    if (isNaN(inputArr[inputArr.length - 1]) && inputArr.length < 2) {
      inputArr.pop();
    } else if (
      isNaN(inputArr[inputArr.length - 1]) &&
      inputArr[inputArr.length - 1] != "⌃-1" &&
      inputArr[inputArr.length - 1] != "⌃0.5" &&
      inputArr.length > 1
    ) {
      inputArr.pop();
      inputArr.push("⌃-1");
    } else {
      inputArr.push("⌃-1");
    }
    calculate();
  },

  /*------- square-root, √ --------  */
  "\u221A"() {
    applyFlagEquals();
    if (isNaN(inputArr[inputArr.length - 1]) && inputArr.length < 2) {
      inputArr.pop();
    } else if (
      isNaN(inputArr[inputArr.length - 1]) &&
      inputArr[inputArr.length - 1] != "⌃0.5" &&
      inputArr[inputArr.length - 1] != "⌃-1" &&
      inputArr.length > 1
    ) {
      inputArr.pop();
      inputArr.push("⌃0.5");
    } else {
      inputArr.push("⌃0.5");
    }
    calculate();
  },

  /*-------------degree, ^y----------- */
  "\u2303y"() {
    applyFlagEquals();

    if (isNaN(inputArr[inputArr.length - 1]) && inputArr.length < 2) {
      inputArr.pop();
    } else if (
      isNaN(inputArr[inputArr.length - 1]) &&
      inputArr.length > 1 &&
      inputArr[inputArr.length - 1] != "⌃0.5" &&
      inputArr[inputArr.length - 1] != "⌃-1"
    ) {
      inputArr.pop();
      inputArr.push("⌃");
    } else {
      inputArr.push("⌃");
    }
  },

  /*--------- multiply ----------*/

  "\u00d7"() {
    this["\u002b"]();
  },

  /*---------division, '/'------------- */
  "\u00f7"() {
    this["\u002b"]();
  },

  /* ---------- equals, "=" ------------------ */
  "="() {
    if (
      !isNaN(inputArr[inputArr.length - 1]) ||
      inputArr[inputArr.length - 1] == "⌃-1" ||
      inputArr[inputArr.length - 1] == "⌃0.5"
    ) {
      displayBottomRow.classList.remove("smoll-font");
      displayTopRow.classList.add("smoll-font");
      flagEquals = 1;
    }
  },

  /* ----------- "+/-" ---------------- */
  "+/-"() {
    if (operand.length == 1) {
      inputArr[0] *= -1;
      calculate();
    } else if (operand.length == 2 && operand[0] == "") {
      inputArr.shift();
      calculate();
    }
  },

  /* ------------------------------- */
  C() {
    PressBtnC();
  },

  /* ------------------------------- */
  CE() {
    PressBtnCE();
  },

  /* ------------------------------- */
  MS() {
    memory = toDisplayOutput;
  },
  /* ------------------------------- */
  "M+"() {
    memory += toDisplayOutput;
  },
  /* ------------------------------- */
  "M-"() {
    memory -= toDisplayOutput;
  },

  /* ------------------------------- */
  MR() {
    if (
      isNaN(inputArr[inputArr.length - 1]) &&
      inputArr[inputArr.length - 1] != "⌃-1" &&
      inputArr[inputArr.length - 1] != "⌃0.5"
    ) {
      inputArr.push(memory);
    } else if (flagEquals) {
      inputArr.length = 0;
      inputArr.push(memory);
    }
    calculate();
  },

  /* ------------------------------- */
  MC() {
    memory = 0;
  },
};

/* ----------- calculate() ---------------- */

function calculate() {
  currentArr = inputArr.slice();
  let result = "";
  if (
    isNaN(inputArr[inputArr.length - 1]) &&
    inputArr[inputArr.length - 1] != "⌃-1" &&
    inputArr[inputArr.length - 1] != "⌃0.5"
  ) {
    currentArr.pop();
  }

  operand.length = 0;
  currentArr.forEach((el, i) => {
    if (!isNaN(el) || el == ".") {
      result += el;

      if (i == currentArr.length - 1) {
        operand.push(result);
      }
    } else {
      if (result) {
        operand.push(result);
      }
      result = "";
      operand.push(el);
    }
  });

  for (let i = 0; i < operand.length; i++) {
    let x = operand[i];
    switch (x) {
      /*  square-root, √ */
      case "⌃0.5":
        operand[i - 1] **= 0.5;
        operand.splice(i, 1);
        i--;
        continue;

      /*  1/x */
      case "⌃-1":
        operand[i - 1] **= -1;
        operand.splice(i, 1);
        i--;
        continue;

      /*  degree, ^y */
      case "⌃":
        operand[i - 1] **= operand[i + 1];
        operand.splice(i, 2);
        i--;
        continue;
    }
  }
  console.log(operand);
  for (let i = 0; i < operand.length; i++) {
    x = operand[i];
    switch (x) {
      /*  multiply */
      case "\u00d7":
        operand[i - 1] *= operand[i + 1];
        operand.splice(i, 2);
        i--;
        continue;

      /*  division */
      case "\u00f7":
        operand[i - 1] /= operand[i + 1];
        operand.splice(i, 2);
        i--;
        continue;

      /*  plus */
      case "\u002b":
        operand.splice(i, 1);
    }
  }

  /* minus */
  for (let i = 1; i < operand.length; i++) {
    if (isNaN(operand[i])) {
      operand.splice(i, 1);
      operand[i] *= -1;
    }
  }

  let n = 6;
  toDisplayOutput = operand.reduce((sum, current) => sum + +current, 0);

  toDisplayOutput = Math.round(toDisplayOutput * 10 ** n) / 10 ** n;

  if (toDisplayOutput > 1000000 || toDisplayOutput < -1000000) {
    toDisplayOutput = toDisplayOutput.toExponential(6);
  }

  displayBottomRow.textContent = "=" + toDisplayOutput;
}
/* ------------------------------- */
function PressBtnC() {
  inputArr.length = 0;
  toDisplayOutput = 0;
  result = [];
  operand.length = 0;
}

/* ------------------------------- */
function PressBtnCE() {
  if (!flagEquals) {
    for (let i = inputArr.length - 1; i >= 0; i--) {
      if (
        !isNaN(inputArr[inputArr.length - 1]) ||
        (isNaN(inputArr[inputArr.length - 1]) && inputArr.length == 1) ||
        inputArr[inputArr.length - 1] == "."
      ) {
        inputArr.pop();
      }
    }
    calculate();
  }
}

/* ------------------------------- */
function applyFlagEquals() {
  if (flagEquals) {
    inputArr.length = 0;
    if (toDisplayOutput) {
      inputArr.push(toDisplayOutput);
    }
    flagEquals = 0;
  }
}

const start = new Date().getTime();

function getSimpleNumber(n) {
  let arr = [1, 2];
  on: for (let i = 3; i < n; i++) {
    for (let j = 1; arr[j] <= i ** 0.5; j++) {
      if (i % arr[j] == 0) {
        continue on;
      }
    }

    arr.push(i);
  }
  console.log(arr.length);
  console.log(arr[arr.length - 1]);
  console.log(arr);
}
getSimpleNumber(10 ** 4);

const end = new Date().getTime();
console.log(`SecondWay: ${end - start}ms`); //~75ms - 10^6

let test = 701408733;
let result;
for (let i = 2; i <= test ** 0.5; i++) {
  if (test % i == 0) {
    !result ? console.log(test + ": ?") : "";
    result = test / i;
    console.log(i + " x" + result);
  }
}
result ? "" : console.log(test + ": pime number");

//================================
function getFbRow(n) {
let a = 0;
let b = 1;
let c = 0;
let arrFb = [];
while (arrFb.length < n){
  a = b;
  b = c;
  c = a + b;
  arrFb.push(c);
} 
//console.log(arrFb);
return arrFb;
}
console.log( getFbRow(20));
/* //==============================

const myCity = {
    city: 'New York', 
 people : {
        menNumber:700000,
        'womenNumber':900000,

    } ,    
};
myCity['popular'] = true;

const countryPropertyName = 'country';
myCity[countryPropertyName] = 'USA'
for(let key in myCity){
    console.log(key + ': ' + myCity[key] )
}
const myCity2 = {...myCity};
myCity2.city = 'Novosibirsk'
myCity2.people.menNumber = '500000'
console.log(myCity2.city);
console.log(myCity2.country);
console.log(myCity.city);
console.log(myCity2.people.menNumber);
console.log(myCity.people.menNumber); */