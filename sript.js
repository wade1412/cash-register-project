let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

const currencyUnitValues = {
  PENNY: 0.01,
  NICKEL: 0.05,
  DIME: 0.1,
  QUARTER: 0.25,
  ONE: 1,
  FIVE: 5,
  TEN: 10,
  TWENTY: 20,
  "ONE HUNDRED": 100,
};

const itemPrice = document.getElementById("item-price");
const customerCash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");
const totalDrawer = document.getElementById("total-drawer");
const cashInDrawer = document.getElementById("cash-in-drawer");

const calculateTotal = (arr) => {
  return arr
    .reduce((acc, el) => {
      return acc + el[1];
    }, 0)
    .toFixed(2);
};

const formatName = (str) => {
  str = str.toLowerCase();
  if (str.charAt(str.length - 1) === "y") {
    str = str.replace("y", "ie");
  }
  if (str === "one hundred") {
    str = "hundred";
  }
  str = str + "s";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatCashInDrawer = (arr) => {
  return arr.map(([name, value]) => [formatName(name), value]);
};

const renderCashAmount = (arr, htmlEl) => {
  const formatedArr = formatCashInDrawer(arr);
  htmlEl.innerHTML = formatedArr
    .map(([name, value]) => `<p>${name}: $${value}</p>`)
    .join(``);
};

const showChangeDue = (msg) => {
  changeDue.innerText = `${msg}`;
};

const inputValidation = (input) => {
  if (parseInt(input) < price) {
    alert("Customer does not have enough money to purchase the item");
    return false;
  } else if (parseInt(input) == price) {
    showChangeDue(`No change due - customer paid with exact cash`);
    return false;
  }
  return true;
};

const calculateChangeNeeded = (cashGiven, valuesObj) => {
  let neededChange = (parseInt(cashGiven) - price).toFixed(2);
  let changeObj = {};
  for (let i = Object.values(valuesObj).length - 1; i >= 0; i--) {
    while (neededChange >= Object.values(valuesObj)[i]) {
      neededChange = (neededChange - Object.values(valuesObj)[i]).toFixed(2);
      changeObj[Object.keys(valuesObj)[i]]
        ? changeObj[Object.keys(valuesObj)[i]]++
        : (changeObj[Object.keys(valuesObj)[i]] = 1);
    }
    if (changeObj[Object.keys(valuesObj)[i]]) {
      changeObj[Object.keys(valuesObj)[i]] *= Object.values(valuesObj)[i];
    }
  }
  return Object.entries(changeObj);
};

const calculateRemainingMoney = (moneyNeededArr, currentMoneyArr) => {
  return currentMoneyArr.map(([name, value]) => {
    const match = moneyNeededArr.find(([n]) => n === name);
    if (match) {
      const [, amountToSubtract] = match;
      return [name, value - amountToSubtract];
    }
    return [name, value];
  });
};

const inputToChange = (input) => {
  if (!inputValidation(input)) {
    return;
  }
  const neededChange = calculateChangeNeeded(input, currencyUnitValues);
  const remainingDrawerMoney = calculateRemainingMoney(neededChange, cid);
  return remainingDrawerMoney;
};

window.onload = () => {
  itemPrice.innerText = `Item Price: $${price}`;
  totalDrawer.innerText = `Total: $${calculateTotal(cid)}`;
  renderCashAmount(cid, cashInDrawer);
};
