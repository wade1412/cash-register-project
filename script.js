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

const toCents = (num) => Math.round(num * 100);
const toDollars = (cents) => (cents / 100).toFixed(2);

const sumCid = (drawer) =>
  drawer.reduce((acc, [, value]) => acc + toCents(value), 0);

const formatChangeString = (status, change) => {
  if (status === "NO_CHANGE") {
    return "No change due - customer paid with exact cash";
  }
  if (status === "INSUFFICIENT_FUNDS") {
    return "Status: INSUFFICIENT_FUNDS";
  }
  let parts = [`Status: ${status}`];
  change.forEach(([name, amt]) => {
    parts.push(`${name}: $${amt}`);
  });
  return parts.join(" ");
};

const computeChange = (price, cash, drawer) => {
  let changeDue = toCents(cash) - toCents(price);
  const sumCashDrawer = sumCid(drawer);

  if (changeDue < 0) return { status: "INSUFFICIENT_FUNDS", change: [] };
  if (changeDue === 0) return { status: "NO_CHANGE", change: [] };
  if (changeDue > sumCashDrawer)
    return { status: "INSUFFICIENT_FUNDS", change: [] };

  if (changeDue === sumCashDrawer) {
    let changeArr = drawer.filter(([_, amt]) => amt > 0);
    return { status: "CLOSED", change: changeArr };
  }

  let changeArr = [];
  let drawerCopy = drawer.map(([n, a]) => [n, toCents(a)]);

  for (let [name, value] of DENOMS) {
    let take = 0;
    let idx = drawerCopy.findIndex((d) => d[0] === name);
    while (changeDue >= value && drawerCopy[idx][1] >= value) {
      changeDue -= value;
      drawerCopy[idx][1] -= value;
      take += value;
    }
    if (take > 0) {
      changeArr.push([name, (take / 100).toFixed(2).replace(/\.00$/, "")]);
    }
  }

  if (changeDue > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }
  return { status: "OPEN", change: changeArr };
};

const updateDrawerView = () => {
  totalDrawer.innerText = `Total: $${(sumCid(cid) / 100).toFixed(2)}`;
  cashInDrawer.innerHTML = cid
    .map(([name, amt]) => `<p>${name}: $${amt}</p>`)
    .join("");
};

const handlePurchase = () => {
  const cash = parseFloat(customerCashInput.value);
  if (isNaN(cash)) {
    alert("Please enter a valid cash amount");
    return;
  }

  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  const result = computeChange(price, cash, cid);

  changeDue.innerText = formatChangeString(result.status, result.change);

  if (result.status === "OPEN") {
    result.change.forEach(([name, amt]) => {
      const idx = cid.findIndex((c) => c[0] === name);
      if (idx > -1) {
        cid[idx][1] = parseFloat((cid[idx][1] - amt).toFixed(2));
      }
    });
    updateDrawerView();
  }
  if (result.status === "CLOSED") {
    cid = cid.map(([n]) => [n, 0]);
    updateDrawerView();
  }
};

window.onload = () => {
  itemPrice.innerText = `Item Price: $${price}`;
  updateDrawerView();
};

purchaseBtn.addEventListener("click", handlePurchase);
