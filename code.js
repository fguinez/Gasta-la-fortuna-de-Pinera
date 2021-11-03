'use strict';
// Elements
let totalMoneyElement = document.querySelector('#totalMoney');
let percentageElement = document.querySelector('#percentageLeft');
let buyButtons = document.querySelectorAll('#buy');
let sellButtons = document.querySelectorAll('#sell');
const appContainer = document.querySelector('.app-container');

// Default data
let initFortune = 2277818000000
let fortune = initFortune;
let totalPercentage = 100;

let elements = [];

// Events
appContainer.addEventListener('click', (e) => {
  let element = e.target.parentElement;

  if (e.target.classList.contains('btn-buy')) {
    buyItem(element);
  } else if (e.target.classList.contains('btn-sell')) {
    sellItem(element);
  }
});

// Buy item
function buyItem(element) {
  // change default data to new data

  if (fortune - Number(element.dataset.price) >= 0) {
    fortune -= Number(element.dataset.price);
    totalPercentage = (fortune * 100) / initFortune;

    // Item name
    let itemName = element.parentElement.querySelector('#name').textContent;

    // get span to increment by one
    let amountOfItems = element.querySelector('#amount');
    amountOfItems.textContent = `${Number(amountOfItems.textContent) + 1}`;

    // get button to enable it when item is more than 0
    let button = element.querySelector('#sell');
    if (Number(amountOfItems.textContent) > 0) {
      button.disabled = false;
    }

    updateTotalAndPercentage();

    // Create (if its new) or update recipt item(if it already exists)
    createReciptItem(
      itemName,
      Number(amountOfItems.textContent),
      formatMoney(
        Number(element.dataset.price) * Number(amountOfItems.textContent)
      )
    );

    updateReceipt();
  } else {
    cantAffordAlert();
  }
}

function cantAffordAlert() {
  totalMoneyElement.innerHTML = `<p class="totalMoney">¡No puedes pagar eso! </p>`;
  percentageElement.innerHTML = `<p class ="percentageLeft">¡Vende algo!</p>`;
}

function createReciptItem(name, amount, total) {
  let receiptItem = new ReceiptItem();
  receiptItem.name = name;
  receiptItem.amount = amount;
  receiptItem.total = total;

  if (!checkReceiptItemExists(receiptItem)) {
    receiptItemsArr.push(receiptItem);
  } else {
    updateReceiptItem(receiptItem);
  }
}

// Sell Item
function sellItem(element) {
  // change default data to new data

  fortune += Number(element.dataset.price);
  totalPercentage = (fortune * 100) / initFortune;

  // Item name
  let itemName = element.parentElement.querySelector('p').textContent;

  // get span to decrement by one
  let amountOfItems = element.querySelector('span');
  amountOfItems.textContent = `${Number(amountOfItems.textContent) - 1}`;

  // get button to disable when item is less than 0
  let button = element.querySelector('#sell');

  if (Number(amountOfItems.textContent) === 0) {
    button.disabled = true;
  }
  updateTotalAndPercentage();

  createReciptItem(
    itemName,
    Number(amountOfItems.textContent),
    formatMoney(
      Number(element.dataset.price) * Number(amountOfItems.textContent)
    )
  );

  updateReceipt();
}

function updateTotalAndPercentage() {
  totalMoneyElement.innerHTML = `<p class="totalMoney">Te quedan: ${formatMoney(
    fortune
  )} pesos</p>`;
  percentageElement.innerHTML = `<p class ="percentageLeft">Solo gastaste ${(
    100 - totalPercentage
  ).toFixed(6)} % del total!</p>`;
}

// Format Money Function
function formatMoney(number) {
  return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
}

// Class to create unique receipt items
class ReceiptItem {
  constructor() {
    this.name;
    this.amount;
    this.total;
  }
}

let receiptItemsArr = [];

// Function that check if that receipt items its already added on the array
function checkReceiptItemExists(receiptItem) {
  let i = 0;
  let exists = false;

  while (!exists && i < receiptItemsArr.length) {
    let itemX = receiptItemsArr[i];
    if (itemX.name === receiptItem.name) {
      exists = true;
    }
    i++;
  }

  return exists;
}

function updateReceiptItem(receiptItem) {
  let i = 0;
  let itemInArr = null;

  while (itemInArr === null && i < receiptItemsArr.length) {
    let itemX = receiptItemsArr[i];

    if (itemX.name === receiptItem.name) {
      itemInArr = itemX;
    }
    i++;
  }

  if (itemInArr) {
    itemInArr.name = receiptItem.name;
    itemInArr.amount = receiptItem.amount;
    itemInArr.total = receiptItem.total;
  }
}

// Function to create recipt (iterara por el array y mostrara los objetos en una lista)
function updateReceipt() {
  let title = `<h1>Boleta</h1>`;
  let receipt = '';
  let total = formatMoney(initFortune - fortune);

  for (let i = 0; i < receiptItemsArr.length; i++) {
    let itemX = receiptItemsArr[i];

    if (itemX.amount !== 0) {
      receipt += `<p>${itemX.name} x <strong> ${itemX.amount}</strong> ......................$ ${itemX.total}</p>`;
    }
  }

  document.querySelector('#receipt-container').innerHTML =
    title + receipt + `<p class="totalRecipt">Monto total: $ ${total}</p>`;
}

// Function to print
function printSection(el) {
  let printsection = document.getElementById(el).innerHTML;
  document.body.innerHTML = printsection;

  window.print();
}

// Element class - preload data - generate html elements

class Element {
  static nro = 1;
  constructor(name, price, image) {
    this.id = Element.nro++;
    this.name = name;
    this.price = price;
    this.amount = 0;
    this.image = image;
  }
}

function createAndSaveElement(elementName, price, image) {
  if (elementName !== '' && price > 0 && image !== '') {
    let newElement = new Element(elementName, price, image);
    elements.push(newElement);
  }
}

preLoad();

function preLoad() {
  createAndSaveElement(
    'Canasta Básica de Alimentos por 80 años',
    46660800,
    'img/canasta.jpg'
  );

  createAndSaveElement(
    'Pagar un sueldo mínimo por 80 años',
    323520000,
    'img/sueldo-minimo.jpg'
  );

  createAndSaveElement(
    'Pasajes Metro de Santiago por 80 años',
    42048000,
    'img/metro.jpg'
  );

  createAndSaveElement(
    'Nintendo Switch',
    350000,
    'https://i.imgur.com/0FO7MMz.jpg'
  );
  createAndSaveElement('PS5', 929900, 'https://i.imgur.com/0KSqKXn.jpg');
  createAndSaveElement('Xbox Series X', 779990, 'https://i.imgur.com/NZ6ySwj.jpg');
  createAndSaveElement(
    'iPhone 12 Pro Max 256GB',
    1138900,
    'https://i.linio.com/p/684a827e8d998b926524cedd05c9eb15-product.webp'
  );

  createAndSaveElement(
    'Super PC Gamer (Ryzen 5950X, RTX 3090, 64GB, 4TB SSD)',
    4080893,
    'https://i.imgur.com/LVouJCx.jpg'
  );
  createAndSaveElement(
    'Razer Blade 14 (2021) (Mejores especificaciones)',
    2307559,
    'https://i.imgur.com/GymbKY5.jpg'
  );
  createAndSaveElement(
    'Mac Pro (2021) (Mejores especificaciones: 28 Cores, 8TB SSD, 1TB RAM, 32GB Video)',
    44353127,
    'https://i.imgur.com/3fGEKLh.jpg'
  );
  createAndSaveElement(
    'Spotify por 80 años',
    3984000,
    'https://i.imgur.com/iMXaSUF.jpg'
  );
  createAndSaveElement(
    'Todos los juegos de Steam (2021 - Sin descuentos)',
    517737570,
    'https://i.imgur.com/W5EmtUf.jpg'
  );
  createAndSaveElement(
    'Netflix por 80 años',
    5702400,
    'https://i.imgur.com/gKxWs5h.jpg'
  );
  createAndSaveElement(
    "LG 88' OLED 8K ThinQ®",
    16480213,
    'https://i.imgur.com/0QQlGOv.jpg'
  );

  createAndSaveElement(
    'Toyota Yaris',
    11790000,
    'img/yaris.jpg'
  );
  createAndSaveElement(
    'Suzuki Baleno',
    11340000,
    'img/baleno.png'
  );
  createAndSaveElement(
    'Tesla Model S Plaid',
    108823980,
    'https://i.imgur.com/qGNbe3T.jpg'
  );

  createAndSaveElement(
    'Cybertruck (Tri Motor)',
    57709685,
    'https://i.imgur.com/VcilGS4.jpg'
  );
  createAndSaveElement('Ferrari F8', 243205100, 'https://i.imgur.com/8LNZBZi.jpg');
  createAndSaveElement(
    'Lamborghini Aventador SVJ',
    422105120,
    'https://i.imgur.com/2zzI1XB.jpg'
  );
  createAndSaveElement(
    'Bugatti La Voiture Noire',
    9068664800,
    'https://i.imgur.com/4TTHYJQ.jpg'
  );
  createAndSaveElement(
    '1000 hectareas en Chiloé',
    5000000000,
    'img/chiloe.gif'
  );
  createAndSaveElement(
    'Isla Privada, Centroamérica (tamaño mediano)',
    4080899200,
    'https://i.imgur.com/1am1OfX.jpg'
  );
  createAndSaveElement(
    'Comer afuera por 80 años (4 comidas por día)',
    2555714600,
    'https://i.imgur.com/sm3cSP5.jpg'
  );

  createAndSaveElement(
    'Anillo de diamante (Tiffany)',
    14015209,
    'https://i.imgur.com/3AkEw9K.jpg'
  );

  createAndSaveElement('Rolex', 9893089, 'https://i.imgur.com/YzLqM8c.jpg');

  createAndSaveElement('Velero', 107196360, 'https://i.imgur.com/iLZmBPD.jpg');

  createAndSaveElement(
    'Helicóptero Bell 206',
    618318050,
    'https://i.imgur.com/3oOLIDc.jpg'
  );
  createAndSaveElement(
    'Jet privado Learjet 75',
    11129725000,
    'img/jet.jpg'
  );

  createAndSaveElement('Tanque M1 Abrams', 7628537500, 'https://i.imgur.com/TZP2OgW.jpg');

  createAndSaveElement(
    '10 cirugías plásticas',
    34499500,
    'https://i.imgur.com/We5W9mt.jpg'
  );

  createAndSaveElement(
    'Una semana en TODOS los países del planeta',
    1030531000,
    'https://i.imgur.com/CFjtIjN.jpg'
  );

  // 50M USD
  createAndSaveElement(
    'Viaje al espacio por 3 días (estimado)',
    40662612000,
    'https://www.focus.it/images/2020/11/16/crew-dragon-resilience_1020x680.jpg'
  );

  createAndSaveElement(
    'Una carrera universitaria en USA',
    140152220,
    'https://i.imgur.com/nX6YLXf.jpg'
  );

  createAndSaveElement(
    'CSD Colo Colo',
    11490485000,
    'img/colocolo.png'
  );

  createAndSaveElement(
    'Todos los jugadores de la selección chilena (2021)',
    94307795000,
    'img/seleccion.jpg'
  );

  createAndSaveElement(
    'Departamento en Las Condes  (3 dor, 3 ba)',
    513049167,
    'https://http2.mlstatic.com/D_NQ_NP_981775-MLC47753582797_102021-UC.webp'
  );

  createAndSaveElement(
    'Casa en Chicureo  (6 dor, 6 ba)',
    512312275,
    'img/chicureo.jpg'
  );

  createAndSaveElement(
    'Departamento de lujo en Paris (3 dor, 4 ba)',
    2473289600,
    'https://i.imgur.com/XpJY8RR.jpg'
  );

  createAndSaveElement(
    'Mega Mansión en Los Ángeles California (8 dor, 20 ba)',
    42878545000,
    'https://i.imgur.com/lH271mS.png'
  );

  createAndSaveElement(
    'Acciones de Piñera en Minera Dominga (2012)',
    125409430000,
    'img/dominga.jpg'
  );

  createAndSaveElement(
    'Edificio Moderno (35 deptos + 10 oficinas)',
    9895048800,
    'https://i.imgur.com/gqBAmHe.jpg'
  );

  createAndSaveElement(
    'Canal 13 (avaluado en 2010)',
    67647779000,
    'img/13.jpg'
  );
}

elements.forEach((element) => {
  let newElement = document.createElement('div');

  newElement.classList.add('element');

  newElement.innerHTML = `<img src="${element.image}" alt="${element.name}" />
  <p id="name">${element.name}</p>
  <span id="price">$${formatMoney(element.price)}</span>
  <div class="buyAndSellContainer" data-price="${element.price}">
    <button class="btn-sell" id="sell" disabled>Vender</button>
    <span id="amount">${element.amount}</span>
    <button class="btn-buy" id="buy" >Comprar</button>
  </div>`;

  appContainer.appendChild(newElement);
});
