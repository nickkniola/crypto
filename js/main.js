var navOpen = false;
var cardFullScreen = false;
var miniCardFullScreen = false;
var favorite = false;
var favoritesView = false;
var navButton = document.querySelector('i.fa-bars');
var navBar = document.querySelector('header.nav-bar');
var navRows = document.querySelectorAll('.nav-row.item');
var expandIcon = null;
var heartIcon = null;
var mainCard = null;
var cryptoCardText = null;
var horizontalRules = null;
var spinningWheel = null;
var fullPrice = null;
var prevDateIncrementer = 0;
var prevPrices = null;
var miniCards = null;
var miniCardsH4 = null;
var navLinks = null;
var form = null;
var cardColumn = null;
var h3NotFound = null;
crypto.pastPrices = {};

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
  h3NotFound = document.querySelector('h3.not-found');
  cryptocurrency = cryptocurrency.replaceAll(' ', '-').toLowerCase();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.coingecko.com/api/v3/simple/price?ids=' + cryptocurrency + '&vs_currencies=usd');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (h3NotFound) {
      cardColumn.removeChild(h3NotFound);
    }

    if (xhr.response[cryptocurrency] === undefined) {
      cardColumn.removeChild(mainCard);
      cardColumn.appendChild(errorTextCreator());
      return;
    }

    fullPrice = xhr.response[cryptocurrency].usd.toFixed(2).toString();
    if (fullPrice.length >= 8) {
      var firstHalf = fullPrice.slice(0, 2);
      var secondHalf = fullPrice.slice(2);
      crypto.price = firstHalf + ',' + secondHalf;
    } else {
      crypto.price = fullPrice;
    }
    findPastPrice(cryptocurrency, dateGenerator(7), 'oneWeek');
    findPastPrice(cryptocurrency, dateGenerator(30.41), 'oneMonth');
    findPastPrice(cryptocurrency, dateGenerator(91.25), 'threeMonths');
    findPastPrice(cryptocurrency, dateGenerator(182.5), 'sixMonths');
    findPastPrice(cryptocurrency, dateGenerator(365), 'oneYear');
    findPastPrice(cryptocurrency, dateGenerator(1825), 'fiveYears');
  });
  xhr.send();
}

cardColumn = document.querySelector('div.col.col-card');

function getName(cryptocurrency, date) {
  cryptocurrency = cryptocurrency.replaceAll(' ', '-').toLowerCase();
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
      spinningWheel.setAttribute('class', 'spinning-wheel hidden');
      cardColumn.appendChild(cardCreator());
    } else {
      spinningWheel.setAttribute('class', 'spinning-wheel hidden');
      cardColumn.appendChild(cardCreator());
    }
    expandIcon = document.querySelector('i.fa-expand');
    heartIcon = document.querySelector('i.fa-heart.main');
    cryptoCardText = document.querySelector('.crypto-card-text');
    horizontalRules = document.querySelectorAll('hr');
    prevPrices = document.querySelectorAll('.past-price');
    eventListenerExpandIcon();
  });
  xhr.send();
}

form = document.querySelector('form');

form.addEventListener('submit', searchCrypto);

function searchCrypto(event) {
  event.preventDefault();
  mainCard = document.querySelector('div.col.col-card div.card');
  spinningWheel = document.querySelector('img.spinning-wheel');
  if (mainCard === null) {
    spinningWheel.setAttribute('class', 'spinning-wheel');
  } else {
    cardColumn.removeChild(mainCard);
    spinningWheel.setAttribute('class', 'spinning-wheel');
  }
  favorite = false;
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

  var prevWeekElement = document.createElement('p');
  prevWeekElement.setAttribute('class', 'past-price hidden');
  prevWeekElement.textContent = 'Prev. Week: ';
  var spanPrevWeek = document.createElement('span');
  spanPrevWeek.textContent = '$' + crypto.pastPrices.oneWeek;
  prevWeekElement.appendChild(spanPrevWeek);
  cardTextDiv.appendChild(prevWeekElement);

  var prevMonthElement = document.createElement('p');
  prevMonthElement.setAttribute('class', 'past-price hidden');
  prevMonthElement.textContent = 'Prev. Month: ';
  var spanPrevMonth = document.createElement('span');
  spanPrevMonth.textContent = '$' + crypto.pastPrices.oneMonth;
  prevMonthElement.appendChild(spanPrevMonth);
  cardTextDiv.appendChild(prevMonthElement);

  var threeMonthsElement = document.createElement('p');
  threeMonthsElement.setAttribute('class', 'past-price hidden');
  threeMonthsElement.textContent = '3 Months Ago: ';
  var spanThreeMonths = document.createElement('span');
  spanThreeMonths.textContent = '$' + crypto.pastPrices.threeMonths;
  threeMonthsElement.appendChild(spanThreeMonths);
  cardTextDiv.appendChild(threeMonthsElement);

  var sixMonthsElement = document.createElement('p');
  sixMonthsElement.setAttribute('class', 'past-price hidden');
  sixMonthsElement.textContent = '6 Months Ago: ';
  var spanSixMonths = document.createElement('span');
  spanSixMonths.textContent = '$' + crypto.pastPrices.sixMonths;
  sixMonthsElement.appendChild(spanSixMonths);
  cardTextDiv.appendChild(sixMonthsElement);

  var oneYearElement = document.createElement('p');
  oneYearElement.setAttribute('class', 'past-price hidden');
  oneYearElement.textContent = '1 Year Ago: ';
  var spanOneYear = document.createElement('span');
  spanOneYear.textContent = '$' + crypto.pastPrices.oneYear;
  oneYearElement.appendChild(spanOneYear);
  cardTextDiv.appendChild(oneYearElement);

  var fiveYearsElement = document.createElement('p');
  fiveYearsElement.setAttribute('class', 'past-price hidden');
  fiveYearsElement.textContent = '5 Years Ago: ';
  var spanFiveYears = document.createElement('span');
  spanFiveYears.textContent = '$' + crypto.pastPrices.fiveYears;
  fiveYearsElement.appendChild(spanFiveYears);
  cardTextDiv.appendChild(fiveYearsElement);

  var heartIcon = document.createElement('i');
  heartIcon.setAttribute('class', 'fas fa-heart main');
  cardDiv.appendChild(heartIcon);

  return cardDiv;
}

function miniCardCreator(cryptoID) {
  var miniCardDiv = document.createElement('div');
  miniCardDiv.setAttribute('class', 'mini-card');

  var expandIcon = document.createElement('i');
  expandIcon.setAttribute('class', 'fas fa-expand mini');
  miniCardDiv.appendChild(expandIcon);

  var cardTextDiv = document.createElement('div');
  cardTextDiv.setAttribute('class', 'mini-crypto-card-text');
  miniCardDiv.appendChild(cardTextDiv);

  var horizontalRule1 = document.createElement('hr');
  horizontalRule1.setAttribute('class', 'hidden');
  cardTextDiv.appendChild(horizontalRule1);

  var h4Element = document.createElement('h4');
  h4Element.textContent = favorites[cryptoID].name;
  var span = document.createElement('span');
  span.setAttribute('class', 'symbol');
  span.textContent = ' (' + favorites[cryptoID].symbol + ' - USD)';
  h4Element.appendChild(span);
  cardTextDiv.appendChild(h4Element);

  var horizontalRule2 = document.createElement('hr');
  horizontalRule2.setAttribute('class', 'hidden');
  cardTextDiv.appendChild(horizontalRule2);

  var pElement = document.createElement('p');
  pElement.setAttribute('class', 'price');
  pElement.textContent = 'Current Price: ';
  var spanElement = document.createElement('span');
  spanElement.textContent = '$' + favorites[cryptoID].price;
  pElement.appendChild(spanElement);
  cardTextDiv.appendChild(pElement);

  var prevWeekElement = document.createElement('p');
  prevWeekElement.setAttribute('class', 'past-price hidden');
  prevWeekElement.textContent = 'Prev. Week: ';
  var spanPrevWeek = document.createElement('span');
  spanPrevWeek.textContent = '$' + favorites[cryptoID].pastPrices.oneWeek;
  prevWeekElement.appendChild(spanPrevWeek);
  cardTextDiv.appendChild(prevWeekElement);

  var prevMonthElement = document.createElement('p');
  prevMonthElement.setAttribute('class', 'past-price hidden');
  prevMonthElement.textContent = 'Prev. Month: ';
  var spanPrevMonth = document.createElement('span');
  spanPrevMonth.textContent = '$' + favorites[cryptoID].pastPrices.oneMonth;
  prevMonthElement.appendChild(spanPrevMonth);
  cardTextDiv.appendChild(prevMonthElement);

  var threeMonthsElement = document.createElement('p');
  threeMonthsElement.setAttribute('class', 'past-price hidden');
  threeMonthsElement.textContent = '3 Months Ago: ';
  var spanThreeMonths = document.createElement('span');
  spanThreeMonths.textContent = '$' + favorites[cryptoID].pastPrices.threeMonths;
  threeMonthsElement.appendChild(spanThreeMonths);
  cardTextDiv.appendChild(threeMonthsElement);

  var sixMonthsElement = document.createElement('p');
  sixMonthsElement.setAttribute('class', 'past-price hidden');
  sixMonthsElement.textContent = '6 Months Ago: ';
  var spanSixMonths = document.createElement('span');
  spanSixMonths.textContent = '$' + favorites[cryptoID].pastPrices.sixMonths;
  sixMonthsElement.appendChild(spanSixMonths);
  cardTextDiv.appendChild(sixMonthsElement);

  var oneYearElement = document.createElement('p');
  oneYearElement.setAttribute('class', 'past-price hidden');
  oneYearElement.textContent = '1 Year Ago: ';
  var spanOneYear = document.createElement('span');
  spanOneYear.textContent = '$' + favorites[cryptoID].pastPrices.oneYear;
  oneYearElement.appendChild(spanOneYear);
  cardTextDiv.appendChild(oneYearElement);

  var fiveYearsElement = document.createElement('p');
  fiveYearsElement.setAttribute('class', 'past-price hidden');
  fiveYearsElement.textContent = '5 Years Ago: ';
  var spanFiveYears = document.createElement('span');
  spanFiveYears.textContent = '$' + favorites[cryptoID].pastPrices.fiveYears;
  fiveYearsElement.appendChild(spanFiveYears);
  cardTextDiv.appendChild(fiveYearsElement);

  var heartIcon = document.createElement('i');
  heartIcon.setAttribute('class', 'fas fa-heart mini shrunk');
  miniCardDiv.appendChild(heartIcon);

  return miniCardDiv;
}

var miniCardRow = document.querySelector('div.mini-card-row');
Object.keys(favorites).forEach(key => miniCardRow.appendChild(miniCardCreator(key)));

function eventListenerExpandIcon() {
  mainCard = document.querySelector('div.col-card .card');
  expandIcon.addEventListener('click', toggleFullScreen);
  heartIcon.addEventListener('click', toggleFavorite);
}

function toggleFullScreen() {
  cardFullScreen = !cardFullScreen;
  miniCards = document.querySelectorAll('.mini-card');
  if (cardFullScreen) {
    if (favorite) {
      heartIcon.setAttribute('class', 'fas fa-heart main heart-full-screen favorited');
    } else {
      heartIcon.setAttribute('class', 'fas fa-heart main heart-full-screen');
    }
    mainCard.setAttribute('class', 'col card card-full-screen');
    cryptoCardText.setAttribute('class', 'crypto-card-text text-full-screen');
    horizontalRules[0].setAttribute('class', '');
    horizontalRules[1].setAttribute('class', '');
    prevPrices.forEach(el => el.setAttribute('class', 'past-price'));
    miniCards.forEach(el => el.setAttribute('class', 'mini-card hidden'));
  } else {
    if (favorite) {
      heartIcon.setAttribute('class', 'fas fa-heart main favorited');
    } else {
      heartIcon.setAttribute('class', 'fas fa-heart main');
    }
    mainCard.setAttribute('class', 'col card');
    cryptoCardText.setAttribute('class', 'crypto-card-text');
    horizontalRules[0].setAttribute('class', 'hidden');
    horizontalRules[1].setAttribute('class', 'hidden');
    prevPrices.forEach(el => el.setAttribute('class', 'past-price hidden'));
    miniCards.forEach(el => el.setAttribute('class', 'mini-card'));
  }
}

function dateGenerator(daysAgo) {
  var millisecondsAgo = daysAgo * 86400000;
  var currentMilliseconds = Date.now();
  var resultMilliseconds = currentMilliseconds - millisecondsAgo;
  var date = new Date(resultMilliseconds);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var fullDate = day + '-' + month + '-' + year;
  return fullDate;
}

function findPastPrice(cryptocurrency, date, daysAgo) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.coingecko.com/api/v3/coins/' + cryptocurrency + '/history?date=' + date);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (!xhr.response.market_data) {
      fullPrice = 'N/A';
    } else {
      fullPrice = xhr.response.market_data.current_price.usd.toFixed(2).toString();
    }
    if (fullPrice.length === 7) {
      var firstHalf = fullPrice.slice(0, 1);
      var secondHalf = fullPrice.slice(1);
      fullPrice = firstHalf + ',' + secondHalf;
    } else if (fullPrice.length === 8) {
      firstHalf = fullPrice.slice(0, 2);
      secondHalf = fullPrice.slice(2);
      fullPrice = firstHalf + ',' + secondHalf;
    }
    crypto.pastPrices[daysAgo] = fullPrice;
    if (prevDateIncrementer < 5) {
      prevDateIncrementer++;
    } else if (prevDateIncrementer === 5) {
      prevDateIncrementer = 0;
      getName(cryptocurrency, dateGenerator(0));
    }
  });
  xhr.send();
}

function toggleFavorite() {
  favorite = !favorite;
  heartIcon = document.querySelector('i.fa-heart.main');
  if (favorite) {
    heartIcon.setAttribute('class', heartIcon.className + ' favorited');
    if (!favorites || !Object.keys(favorites).includes(crypto.id)) {
      favorites[crypto.id] = {
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        price: crypto.price,
        pastPrices: {
          oneWeek: crypto.pastPrices.oneWeek,
          oneMonth: crypto.pastPrices.oneMonth,
          threeMonths: crypto.pastPrices.threeMonths,
          sixMonths: crypto.pastPrices.sixMonths,
          oneYear: crypto.pastPrices.oneYear,
          fiveYears: crypto.pastPrices.fiveYears
        }
      };
      miniCardRow.appendChild(miniCardCreator(crypto.id));
    }
  } else {
    if (heartIcon.className.includes('heart-full-screen')) {
      heartIcon.setAttribute('class', 'fas fa-heart main heart-full-screen');
    } else {
      heartIcon.setAttribute('class', 'fas fa-heart main');
    }
    delete favorites[crypto.id];
    miniCards = document.querySelectorAll('.mini-card');
    miniCardsH4 = document.querySelectorAll('.mini-crypto-card-text > h4');
    if (miniCardsH4[miniCardsH4.length - 1].textContent.split(' (')[0] === crypto.name) {
      miniCards[miniCards.length - 1].remove();
    }
  }
}

miniCardRow.addEventListener('click', toggleMiniFullScreen);

function toggleMiniFullScreen(event) {
  var miniExpandIcons = document.querySelectorAll('.fa-expand.mini');
  miniCards = document.querySelectorAll('.mini-card');
  miniCardFullScreen = !miniCardFullScreen;
  if (miniCardFullScreen) {
    if (event.target.className.includes(miniExpandIcons[0].className)) {
      miniCards.forEach(el => el.setAttribute('class', 'mini-card hidden'));
      event.target.closest('.mini-card').setAttribute('class', 'mini-card-full-screen');
      prevPrices = document.querySelectorAll('.mini-card-full-screen .past-price');
      prevPrices.forEach(el => el.setAttribute('class', 'past-price'));
      event.target.nextElementSibling.nextElementSibling.setAttribute('class', 'fas fa-heart mini heart-full-screen');
      event.target.nextElementSibling.children[0].setAttribute('class', '');
      event.target.nextElementSibling.children[2].setAttribute('class', '');
    }
  } else {
    if (event.target.className.includes(miniExpandIcons[0].className)) {
      if (favoritesView) {
        miniCards.forEach(miniCard => miniCard.setAttribute('class', 'mini-card favorites-view'));
        event.target.closest('.mini-card-full-screen').setAttribute('class', 'mini-card favorites-view');
      } else {
        miniCards.forEach(el => el.setAttribute('class', 'mini-card'));
        event.target.closest('.mini-card-full-screen').setAttribute('class', 'mini-card');
      }
      prevPrices = document.querySelectorAll('.mini-card .past-price');
      prevPrices.forEach(el => el.setAttribute('class', 'past-price hidden'));
      event.target.nextElementSibling.nextElementSibling.setAttribute('class', 'fas fa-heart mini shrunk');
      event.target.nextElementSibling.children[0].setAttribute('class', 'hidden');
      event.target.nextElementSibling.children[2].setAttribute('class', 'hidden');
    }
  }
  if (event.target.className.includes('fas fa-heart mini')) {
    delete favorites[event.target.previousSibling.children[1].textContent.split(' (')[0].toLowerCase()];
    event.target.closest('.mini-card').remove();
  }
}

navLinks = document.querySelector('div.nav-links');
navLinks.addEventListener('click', viewSwapper);

function viewSwapper(event) {
  var searchedItem = document.querySelector('.container.searched-item');
  var homeLink = document.querySelector('.nav-item.home');
  var favoritesLink = document.querySelector('.nav-item.favorites');
  miniCards = document.querySelectorAll('.mini-card');
  if (event.target === favoritesLink) {
    favoritesView = true;
    form.setAttribute('class', 'hidden');
    searchedItem.setAttribute('class', 'container searched-item hidden');
    miniCards.forEach(miniCard => miniCard.setAttribute('class', 'mini-card favorites-view'));
  } else if (event.target === homeLink) {
    favoritesView = false;
    form.setAttribute('class', '');
    searchedItem.setAttribute('class', 'container searched-item');
    miniCards.forEach(miniCard => miniCard.setAttribute('class', 'mini-card'));
  }
}

function errorTextCreator() {
  var h3Element = document.createElement('h3');
  h3Element.setAttribute('class', 'not-found');
  h3Element.textContent = 'Cryptocurrency not found.';

  return h3Element;
}
