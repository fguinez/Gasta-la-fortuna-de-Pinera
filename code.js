'use strict';
// Elements
let totalMoneyElement = document.querySelector('#totalMoney');
let percentageElement = document.querySelector('#percentageLeft');
let buyButtons = document.querySelectorAll('#buy');
let sellButtons = document.querySelectorAll('#sell');
const appContainer = document.querySelector('.app-container');

// Default data
// 2.8B dolares
// https://www.forbes.com/profile/sebastian-pinera/
let initFortune = 2278336500000
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

  // $337.000 por mes
  // https://www.dt.gob.cl/portal/1628/w3-article-60141.html
  createAndSaveElement(
    'Pagar un sueldo mínimo por 80 años',
    323520000,
    'img/sueldo-minimo.jpg'
  );

  // $800 por pasaje x 2 por día x 80 años (800*2*365*80)
  // https://www.metro.cl/tu-viaje/horarios-y-tarifas
  createAndSaveElement(
    'Pasajes Metro de Santiago por 80 años',
    46720000,
    'img/metro.jpg'
  );

  // 37990 x Mes
  // https://www.entel.cl/hogar/internet/
  createAndSaveElement(
    'Internet de alta velocidad (1 Giga) por 80 años',
    36470400,
    'img/internet.jpg'
  );

  // https://www.lider.cl/catalogo/product/sku/1143170?gclid=Cj0KCQjw5oiMBhDtARIsAJi0qk0Hv2eG0cy1Pl3Hof2nLG812wZ68NHg-bjKo5JCRDXVpb6mOCv9Dn8aAiazEALw_wcB
  createAndSaveElement(
    'iPhone 12 Pro Max 256GB',
    1158990,
    'https://i.linio.com/p/684a827e8d998b926524cedd05c9eb15-product.webp'
  );

  // https://simple.ripley.cl/consola-nintendo-switch-neon-color-new-model-sniper-mpm00016486196?gclid=Cj0KCQjw5oiMBhDtARIsAJi0qk0ql-X8S6Jwfya0wXLOk0JUAcWTtj8Qog85IxIcbCbLlTZn_dH_ZfgaAtI5EALw_wcB&s=o
  createAndSaveElement(
    'Nintendo Switch',
    350000,
    'https://i.imgur.com/0FO7MMz.jpg'
  );

  // https://www.linio.cl/p/consola-microsoft-xbox-series-x-1-tb-sniper-ryopon?adjust_t=1zira0_f1h7ws&adjust_google_network=u&adjust_google_placement=&adjust_campaign=LICL-LAB-AO-INSTI-LOC00001-MidROAS-Ago21-GG-Shopping-Conversion-Smart&adjust_adgroup=124100744291&utm_term=videogames&gclid=Cj0KCQjw5oiMBhDtARIsAJi0qk3TiBp-N3lsSKY0Qbe1TIFeE8bNTofX_IhWFH68eK1-6J2YpxTXs2EaAjnQEALw_wcB
  createAndSaveElement('Xbox Series X', 779990, 'https://i.imgur.com/NZ6ySwj.jpg');

  // https://simple.ripley.cl/consola-playstation-5-ps5-version-con-lector-sniper-mpm00020127298?s=o
  createAndSaveElement('PS5', 950900, 'https://i.imgur.com/0KSqKXn.jpg');

  // 2.799,99 dolares
  // https://www.xataka.com/ordenadores/razer-blade-14-2021-caracteristicas-precio-ficha-tecnica
  createAndSaveElement(
    'Razer Blade 14 (2021) (Mejores especificaciones)',
    2277703,
    'https://i.imgur.com/GymbKY5.jpg'
  );


  createAndSaveElement(
    'Super PC Gamer (Ryzen 5950X, RTX 3090, 64GB, 4TB SSD)',
    4080893,
    'https://i.imgur.com/LVouJCx.jpg'
  );

  // https://www.paris.cl/qled-smart-tv-samsung-98-uhd-8k-98q900-967349999.html?utm_source=soicos&utm_medium=referral
  createAndSaveElement(
    "Televisor Samsung 98' QLED 8K",
    31999990,
    'img/televisor.jpg'
  );

  // 61.047,98 euros
  // https://lamanzanamordida.net/noticias/one-more-thing/producto-mas-caro-apple-mac-2021/
  createAndSaveElement(
    'Mac Pro (2021) (Mejores especificaciones: 28 nucleos, 8TB SSD, 1.5TB RAM, 64GB Video)',
    57583567,
    'https://i.imgur.com/3fGEKLh.jpg'
  );

  // 672.417,37 dolares
  // https://steam.seewang.me
  createAndSaveElement(
    'Todos los juegos de Steam (2021 - Sin descuentos)',
    547079770,
    'https://i.imgur.com/W5EmtUf.jpg'
  );

  // $ 4.150 pesos por mes
  // https://www.spotify.com/cl/premium/
  createAndSaveElement(
    'Spotify por 80 años',
    3984000,
    'https://i.imgur.com/iMXaSUF.jpg'
  );

  // 5.940 pesos por mes(Plan Básico)
  // https://help.netflix.com/es/node/24926
  createAndSaveElement(
    'Netflix por 80 años',
    5702400,
    'img/netflix.jpg'
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

  // 21.881 pesos por comida
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
    'Una carrera universitaria en USA',
    140152220,
    'https://i.imgur.com/nX6YLXf.jpg'
  );

  createAndSaveElement(
    'Una semana en TODOS los países del planeta',
    1030531000,
    'https://i.imgur.com/CFjtIjN.jpg'
  );

  // 250K USD
  // https://cnnespanol.cnn.com/video/viajes-espacio-exterior-millonarios-costos-altos-virgin-galactic-blue-origin-clix/
  createAndSaveElement(
    'Viaje al espacio (1 persona)',
    203369690,
    'img/space_travel.jpg'
  );

  // 9.5 millones de dólares por 12 noches
  // https://www.bbc.com/mundo/vert-fut-47729901
  createAndSaveElement(
    '12 noches en el futuro hotel espacial Aurora Station',
    7730572400,
    'img/space_hotel.jpg'
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
