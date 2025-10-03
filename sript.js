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

const currencyUnitValues = [
  { PENNY: 0.01 },
  { NICKEL: 0.05 },
  { DIME: 0.1 },
  { QUARTER: 0.25 },
  { ONE: 1 },
  { FIVE: 5 },
  { TEN: 10 },
  { TWENTY: 20 },
  { "ONE HUNDRED": 100 },
];

const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const change = document.getElementById("change");
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

window.onload = () => {
  totalDrawer.innerText = `Total: $${calculateTotal(cid)}`;
  renderCashAmount(cid, cashInDrawer);
};
