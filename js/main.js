var navOpen = false;
var cardFullScreen = false;
var navButton = document.querySelector('i.fa-bars');
var navBar = document.querySelector('header.nav-bar');
var navRows = document.querySelectorAll('.nav-row.item');
var expandIcon = null;
var heartIcon = null;
var mainCard = null;
var cryptoCardText = null;
var horizontalRules = null;

navButton.addEventListener('click', toggleNav);

function toggleNav() {
  navOpen = !navOpen;

  if (navOpen) {
    navBar.className = 'nav-bar opened';
    navRows[0].className = 'nav-row item';
    navRows[1].className = 'nav-row item';
  } else {
    navBar.className = 'nav-bar';
    navRows[0].className = 'nav-row item hidden';
    navRows[1].className = 'nav-row item hidden';
  }
}

function getPrice(cryptocurrency) {

  cryptocurrency = cryptocurrency.replaceAll(' ', '-').toLowerCase();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.coingecko.com/api/v3/simple/price?ids=' + cryptocurrency + '&vs_currencies=usd');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var fullPrice = xhr.response[cryptocurrency].usd.toFixed(2).toString();
    if (fullPrice.length >= 8) {
      var firstHalf = fullPrice.slice(0, 2);
      var secondHalf = fullPrice.slice(2);
      console.log(fullPrice, firstHalf, secondHalf);
      crypto.price = firstHalf + ',' + secondHalf;
    } else {
      crypto.price = fullPrice;
    }

    getPastPrice(cryptocurrency, '01-11-2020');
  });
  xhr.send();
}

var cardColumn = document.querySelector('div.col.col-card');

function getPastPrice(cryptocurrency, date) {
  cryptocurrency = cryptocurrency.replaceAll(' ', '-').toLowerCase();
  var mainCard = document.querySelector('div.col.col-card div.card');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.coingecko.com/api/v3/coins/' + cryptocurrency + '/history?date=' + date);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {

    if (xhr.response.id === undefined) {
      return;
    }
    crypto.id = xhr.response.id;
    crypto.name = xhr.response.name;
    crypto.symbol = xhr.response.symbol.toUpperCase();

    if (mainCard === null) {
      cardColumn.appendChild(cardCreator());
    } else {
      cardColumn.removeChild(mainCard);
      cardColumn.appendChild(cardCreator());
    }
    expandIcon = document.querySelector('i.fa-expand');
    heartIcon = document.querySelector('i.fa-heart');
    cryptoCardText = document.querySelector('.crypto-card-text');
    horizontalRules = document.querySelectorAll('hr');
    eventListenerExpandIcon();
  });
  xhr.send();
}

var form = document.querySelector('form');

form.addEventListener('submit', searchCrypto);

function searchCrypto(event) {
  event.preventDefault();
  var searchedCrypto = event.target.elements.cryptoName.value;
  getPrice(searchedCrypto);
  form.reset();
}

function cardCreator() {
  var cardDiv = document.createElement('div');
  cardDiv.setAttribute('class', 'card');

  var expandIcon = document.createElement('i');
  expandIcon.setAttribute('class', 'fas fa-expand');
  cardDiv.appendChild(expandIcon);

  var cardTextDiv = document.createElement('div');
  cardTextDiv.setAttribute('class', 'crypto-card-text');
  cardDiv.appendChild(cardTextDiv);

  var horizontalRule1 = document.createElement('hr');
  horizontalRule1.setAttribute('class', 'hidden');
  cardTextDiv.appendChild(horizontalRule1);

  var h3Element = document.createElement('h3');
  h3Element.textContent = crypto.name;
  var span = document.createElement('span');
  span.setAttribute('class', 'symbol');
  span.textContent = ' (' + crypto.symbol + ' - USD)';
  h3Element.appendChild(span);
  cardTextDiv.appendChild(h3Element);

  var horizontalRule2 = document.createElement('hr');
  horizontalRule2.setAttribute('class', 'hidden');
  cardTextDiv.appendChild(horizontalRule2);

  var pElement = document.createElement('p');
  pElement.setAttribute('class', 'price');
  pElement.textContent = 'Current Price: ';
  var spanElement = document.createElement('span');
  spanElement.textContent = '$' + crypto.price;
  pElement.appendChild(spanElement);
  cardTextDiv.appendChild(pElement);

  var heartIcon = document.createElement('i');
  heartIcon.setAttribute('class', 'fas fa-heart');
  cardDiv.appendChild(heartIcon);

  return cardDiv;
}

function eventListenerExpandIcon() {
  mainCard = document.querySelector('div.col-card .card');
  expandIcon.addEventListener('click', toggleFullScreen);
}

function toggleFullScreen() {
  cardFullScreen = !cardFullScreen;
  if (cardFullScreen) {
    mainCard.setAttribute('class', 'col card card-full-screen');
    heartIcon.setAttribute('class', 'fas fa-heart heart-full-screen');
    cryptoCardText.setAttribute('class', 'crypto-card-text text-full-screen');
    horizontalRules[0].setAttribute('class', '');
    horizontalRules[1].setAttribute('class', '');
  } else {
    mainCard.setAttribute('class', 'col card');
    heartIcon.setAttribute('class', 'fas fa-heart');
    cryptoCardText.setAttribute('class', 'crypto-card-text');
    horizontalRules[0].setAttribute('class', 'hidden');
    horizontalRules[1].setAttribute('class', 'hidden');
  }

}
