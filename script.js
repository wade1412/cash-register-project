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

const DENOMS = [
  ["ONE HUNDRED", 10000],
  ["TWENTY", 2000],
  ["TEN", 1000],
  ["FIVE", 500],
  ["ONE", 100],
  ["QUARTER", 25],
  ["DIME", 10],
  ["NICKEL", 5],
  ["PENNY", 1],
];

const itemPrice = document.getElementById("item-price");
const drawerStatus = document.getElementById("drawer-status");
const customerCashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");
const totalDrawer = document.getElementById("total-drawer");
const cashInDrawer = document.getElementById("cash-in-drawer");

const toCents = (num) => Math.round(Number(num) * 100);
const centsToDisplay = (cents) =>
  parseFloat((cents / 100).toFixed(2)).toString();

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

const renderMoneyArrToHtml = (arr, htmlEl) => {
  htmlEl.innerHTML = arr
    .map(([name, value]) => `<p>${name}: $${value}</p>`)
    .join(``);
};

const renderDrawerAmount = (arr, htmlEl) => {
  const formatedArr = formatCashInDrawer(arr);
  renderMoneyArrToHtml(formatedArr, htmlEl);
};

const renderChangeDueStatus = (change, drawerCash) => {
  const totalChange = calculateTotal(change);
  const totalDrawerCash = calculateTotal(drawerCash);
  if (totalDrawerCash > totalChange) {
    drawerStatus.innerHTML = `<p>Status: OPEN</p>`;
  } else if (totalDrawerCash === totalChange) {
    drawerStatus.innerHTML = `<p>Status: CLOSED</p>`;
  } else if (totalDrawerCash < totalChange) {
    changeDue.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`;
  }
};

const showChangeDue = (msg) => {
  changeDue.innerHTML = `<p>${msg}</p>`;
};

const inputValidation = (input) => {
  if (parseFloat(input) < price) {
    alert("Customer does not have enough money to purchase the item");
    return false;
  } else if (parseFloat(input) === price) {
    showChangeDue("No change due - customer paid with exact cash");
    return false;
  }
  return true;
};

const calculateChangeNeeded = (cashGiven, valuesObj) => {
  let neededChange = (parseFloat(cashGiven) - price).toFixed(2);
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
  if (!inputValidation(parseFloat(input))) {
    return;
  }
  const neededChange = calculateChangeNeeded(
    parseFloat(input),
    currencyUnitValues
  );
  const remainingDrawerMoney = calculateRemainingMoney(neededChange, cid);
  renderMoneyArrToHtml(neededChange, changeDue);
  renderChangeDueStatus(neededChange, cid);
  renderDrawerAmount(remainingDrawerMoney, cashInDrawer);
  totalDrawer.innerText = `Total: $${calculateTotal(remainingDrawerMoney)}`;
};

window.onload = () => {
  itemPrice.innerText = `Item Price: $${price}`;
  totalDrawer.innerText = `Total: $${calculateTotal(cid)}`;
  renderDrawerAmount(cid, cashInDrawer);
};

purchaseBtn.addEventListener("click", () => {
  let cashInput = customerCashInput.value;
  inputToChange(cashInput);
});
