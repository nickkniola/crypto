let navOpen = false;
let cardFullScreen = false;
let miniCardFullScreen = false;
let favorite = false;
let favoritesView = false;
let appendCard = false;
const navToggler = document.querySelector('i.fa-bars');
const navBar = document.querySelector('header.nav-bar');
const navContent = document.querySelectorAll('.nav-row.item');
const navLinks = document.querySelector('div.nav-links');
const form = document.querySelector('form');
const miniCardRow = document.querySelector('div.mini-card-row');
let mainCard = null;
let cardColumn = null;
let cryptoCardText = null;
let horizontalRules = null;
let spinningWheel = null;
let fullPrice = null;
let prevPrices = null;
let miniCards = null;
let miniCardsH4 = null;
let expandIcon = null;
let miniExpandIcons = null;
let heartIcon = null;
let errorText = null;
let h3ErrorElement = null;
let prevDateIncrementer = 0;

window.addEventListener('load', function () {
  if (Object.keys(favorites).length === 0) {
    miniCardRow.appendChild(noFavoritesTextCreator());
  }
});

Object.keys(favorites).forEach(key => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.coingecko.com/api/v3/simple/price?ids=' + key + '&vs_currencies=usd');
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    if (!xhr.response[key]) {
      return;
    }
    const fullPrice = xhr.response[key].usd.toFixed(2).toString();
    if (fullPrice.length >= 8) {
      const firstHalf = fullPrice.slice(0, 2);
      const secondHalf = fullPrice.slice(2);
      favorites[key].price = firstHalf + ',' + secondHalf;
    } else {
      favorites[key].price = fullPrice;
    }
    favorite = false;
    findPastPrice(key, dateGenerator(7), 'oneWeek');
    findPastPrice(key, dateGenerator(30.41), 'oneMonth');
    findPastPrice(key, dateGenerator(91.25), 'threeMonths');
    findPastPrice(key, dateGenerator(182.5), 'sixMonths');
    findPastPrice(key, dateGenerator(365), 'oneYear');
    findPastPrice(key, dateGenerator(1825), 'fiveYears');

    miniCardRow.appendChild(miniCardCreator(key));
  });
  xhr.send();
});

navToggler.addEventListener('click', toggleNav);
navLinks.addEventListener('click', viewSwapper);
form.addEventListener('submit', searchCrypto);
miniCardRow.addEventListener('click', toggleMiniFullScreen);
navLinks.addEventListener('click', toggleMiniFullScreen);

function mainCardEventListeners() {
  mainCard = document.querySelector('div.col-card .card');
  expandIcon.addEventListener('click', toggleFullScreen);
  heartIcon.addEventListener('click', toggleFavorite);
}

function searchCrypto(event) {
  event.preventDefault();
  mainCard = document.querySelector('div.col.col-card div.card');
  spinningWheel = document.querySelector('img.spinning-wheel');
  cardColumn = document.querySelector('div.col.col-card');
  if (mainCard === null) {
    spinningWheel.setAttribute('class', 'spinning-wheel');
  } else {
    cardColumn.removeChild(mainCard);
    spinningWheel.setAttribute('class', 'spinning-wheel');
  }
  favorite = false;
  const searchedCrypto = event.target.elements.cryptoName.value;
  getPrice(searchedCrypto);
  form.reset();
}

function getPrice(cryptocurrency) {
  fetch('https://api.coingecko.com/api/v3/coins/list')
    .then(response => response.json())
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].symbol === cryptocurrency || data[i].name === cryptocurrency) {
          cryptocurrency = data[i].id;
          break;
        }
      }

      h3ErrorElement = document.querySelector('h3.not-found');
      cardColumn = document.querySelector('div.col.col-card');
      mainCard = document.querySelector('div.col.col-card div.card');
      cryptocurrency = cryptocurrency.replaceAll(' ', '-').toLowerCase();
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.coingecko.com/api/v3/simple/price?ids=' + cryptocurrency + '&vs_currencies=usd');
      xhr.responseType = 'json';
      if (h3ErrorElement) {
        cardColumn.removeChild(h3ErrorElement);
      }

      xhr.addEventListener('load', function () {
        if (xhr.response[cryptocurrency] === undefined) {
          if (mainCard) {
            cardColumn.removeChild(mainCard);
          }
          cardColumn.appendChild(errorTextCreator());
          spinningWheel.setAttribute('class', 'spinning-wheel hidden');

          return;
        }
        fullPrice = xhr.response[cryptocurrency].usd.toFixed(2).toString();
        if (fullPrice.length >= 8) {
          const firstHalf = fullPrice.slice(0, 2);
          const secondHalf = fullPrice.slice(2);
          crypto.price = firstHalf + ',' + secondHalf;
        } else {
          crypto.price = fullPrice;
        }
        appendCard = true;
        findPastPrice(cryptocurrency, dateGenerator(7), 'oneWeek');
        findPastPrice(cryptocurrency, dateGenerator(30.41), 'oneMonth');
        findPastPrice(cryptocurrency, dateGenerator(91.25), 'threeMonths');
        findPastPrice(cryptocurrency, dateGenerator(182.5), 'sixMonths');
        findPastPrice(cryptocurrency, dateGenerator(365), 'oneYear');
        findPastPrice(cryptocurrency, dateGenerator(1825), 'fiveYears');
      });

      xhr.addEventListener('error', function () {
        cardColumn.appendChild(networkErrorTextCreator());
        spinningWheel.setAttribute('class', 'spinning-wheel hidden');
      });

      xhr.send();
    });
}

function getName(cryptocurrency, date) {
  cryptocurrency = cryptocurrency.replaceAll(' ', '-').toLowerCase();
  mainCard = document.querySelector('div.col.col-card div.card');
  spinningWheel = document.querySelector('img.spinning-wheel');
  cardColumn = document.querySelector('div.col.col-card');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.coingecko.com/api/v3/coins/' + cryptocurrency + '/history?date=' + date);
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    if (xhr.response.id === undefined) {

      return;
    }
    crypto.image = xhr.response.image.small;
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
    mainCardEventListeners();
  });

  xhr.addEventListener('error', function () {
    cardColumn.appendChild(networkErrorTextCreator());
  });

  xhr.send();
}

function findPastPrice(cryptocurrency, date, daysAgo) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.coingecko.com/api/v3/coins/' + cryptocurrency + '/history?date=' + date);
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    if (!xhr.response.market_data) {
      fullPrice = 'N/A';
    } else {
      fullPrice = xhr.response.market_data.current_price.usd.toFixed(2).toString();
    }
    if (fullPrice.length === 7) {
      const firstHalf = fullPrice.slice(0, 1);
      const secondHalf = fullPrice.slice(1);
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
      if (appendCard) {
        getName(cryptocurrency, dateGenerator(0));
      }
    }
  });

  xhr.addEventListener('error', function () {
    cardColumn.appendChild(networkErrorTextCreator());
  });

  xhr.send();
}

function cardCreator() {
  const cardDiv = document.createElement('div');
  cardDiv.setAttribute('class', 'card');

  const expandIcon = document.createElement('i');
  expandIcon.setAttribute('class', 'fas fa-expand');
  cardDiv.appendChild(expandIcon);

  const cardTextDiv = document.createElement('div');
  cardTextDiv.setAttribute('class', 'crypto-card-text');
  cardDiv.appendChild(cardTextDiv);

  const horizontalRule1 = document.createElement('hr');
  horizontalRule1.setAttribute('class', 'hidden');
  cardTextDiv.appendChild(horizontalRule1);

  const coinImage = document.createElement('img');
  coinImage.setAttribute('src', crypto.image);

  const h3Element = document.createElement('h3');
  h3Element.textContent = crypto.name;
  const span = document.createElement('span');
  span.setAttribute('class', 'symbol');
  span.textContent = ' (' + crypto.symbol + ' - USD)';
  span.append(coinImage);
  h3Element.appendChild(span);
  cardTextDiv.appendChild(h3Element);

  const horizontalRule2 = document.createElement('hr');
  horizontalRule2.setAttribute('class', 'hidden');
  cardTextDiv.appendChild(horizontalRule2);

  const pElement = document.createElement('p');
  pElement.setAttribute('class', 'price');
  pElement.textContent = 'Current Price: ';
  const spanElement = document.createElement('span');
  spanElement.textContent = '$' + crypto.price;
  pElement.appendChild(spanElement);
  cardTextDiv.appendChild(pElement);

  const prevWeekElement = document.createElement('p');
  prevWeekElement.setAttribute('class', 'past-price hidden');
  prevWeekElement.textContent = 'Prev. Week: ';
  const spanPrevWeek = document.createElement('span');
  spanPrevWeek.textContent = '$' + crypto.pastPrices.oneWeek;
  prevWeekElement.appendChild(spanPrevWeek);
  cardTextDiv.appendChild(prevWeekElement);

  const prevMonthElement = document.createElement('p');
  prevMonthElement.setAttribute('class', 'past-price hidden');
  prevMonthElement.textContent = 'Prev. Month: ';
  const spanPrevMonth = document.createElement('span');
  spanPrevMonth.textContent = '$' + crypto.pastPrices.oneMonth;
  prevMonthElement.appendChild(spanPrevMonth);
  cardTextDiv.appendChild(prevMonthElement);

  const threeMonthsElement = document.createElement('p');
  threeMonthsElement.setAttribute('class', 'past-price hidden');
  threeMonthsElement.textContent = '3 Months Ago: ';
  const spanThreeMonths = document.createElement('span');
  spanThreeMonths.textContent = '$' + crypto.pastPrices.threeMonths;
  threeMonthsElement.appendChild(spanThreeMonths);
  cardTextDiv.appendChild(threeMonthsElement);

  const sixMonthsElement = document.createElement('p');
  sixMonthsElement.setAttribute('class', 'past-price hidden');
  sixMonthsElement.textContent = '6 Months Ago: ';
  const spanSixMonths = document.createElement('span');
  spanSixMonths.textContent = '$' + crypto.pastPrices.sixMonths;
  sixMonthsElement.appendChild(spanSixMonths);
  cardTextDiv.appendChild(sixMonthsElement);

  const oneYearElement = document.createElement('p');
  oneYearElement.setAttribute('class', 'past-price hidden');
  oneYearElement.textContent = '1 Year Ago: ';
  const spanOneYear = document.createElement('span');
  spanOneYear.textContent = '$' + crypto.pastPrices.oneYear;
  oneYearElement.appendChild(spanOneYear);
  cardTextDiv.appendChild(oneYearElement);

  const fiveYearsElement = document.createElement('p');
  fiveYearsElement.setAttribute('class', 'past-price hidden');
  fiveYearsElement.textContent = '5 Years Ago: ';
  const spanFiveYears = document.createElement('span');
  spanFiveYears.textContent = '$' + crypto.pastPrices.fiveYears;
  fiveYearsElement.appendChild(spanFiveYears);
  cardTextDiv.appendChild(fiveYearsElement);

  const heartIconElement = document.createElement('i');
  heartIconElement.setAttribute('class', 'fas fa-heart main');
  miniCardsH4 = document.querySelectorAll('.mini-crypto-card-text > h4');
  for (let i = 0; i < miniCardsH4.length; i++) {
    if (miniCardsH4[i].textContent.split(' (')[0] === crypto.name) {
      heartIconElement.setAttribute('class', 'fas fa-heart main favorited');
      favorite = true;
    }
  }
  cardDiv.appendChild(heartIconElement);

  return cardDiv;
}

function miniCardCreator(cryptoID) {
  const miniCardDiv = document.createElement('div');
  miniCardDiv.setAttribute('class', 'mini-card');

  const expandIcon = document.createElement('i');
  expandIcon.setAttribute('class', 'fas fa-expand mini');
  miniCardDiv.appendChild(expandIcon);

  const cardTextDiv = document.createElement('div');
  cardTextDiv.setAttribute('class', 'mini-crypto-card-text');
  miniCardDiv.appendChild(cardTextDiv);

  const horizontalRule1 = document.createElement('hr');
  horizontalRule1.setAttribute('class', 'hidden');
  cardTextDiv.appendChild(horizontalRule1);

  const h4Element = document.createElement('h4');
  h4Element.textContent = favorites[cryptoID].name;
  const span = document.createElement('span');
  span.setAttribute('class', 'symbol');
  span.textContent = ' (' + favorites[cryptoID].symbol + ' - USD)';
  h4Element.appendChild(span);
  cardTextDiv.appendChild(h4Element);

  const horizontalRule2 = document.createElement('hr');
  horizontalRule2.setAttribute('class', 'hidden');
  cardTextDiv.appendChild(horizontalRule2);

  const pElement = document.createElement('p');
  pElement.setAttribute('class', 'price');
  pElement.textContent = 'Current Price: ';
  const spanElement = document.createElement('span');
  spanElement.textContent = '$' + favorites[cryptoID].price;
  pElement.appendChild(spanElement);
  cardTextDiv.appendChild(pElement);

  const prevWeekElement = document.createElement('p');
  prevWeekElement.setAttribute('class', 'past-price hidden');
  prevWeekElement.textContent = 'Prev. Week: ';
  const spanPrevWeek = document.createElement('span');
  spanPrevWeek.textContent = '$' + favorites[cryptoID].pastPrices.oneWeek;
  prevWeekElement.appendChild(spanPrevWeek);
  cardTextDiv.appendChild(prevWeekElement);

  const prevMonthElement = document.createElement('p');
  prevMonthElement.setAttribute('class', 'past-price hidden');
  prevMonthElement.textContent = 'Prev. Month: ';
  const spanPrevMonth = document.createElement('span');
  spanPrevMonth.textContent = '$' + favorites[cryptoID].pastPrices.oneMonth;
  prevMonthElement.appendChild(spanPrevMonth);
  cardTextDiv.appendChild(prevMonthElement);

  const threeMonthsElement = document.createElement('p');
  threeMonthsElement.setAttribute('class', 'past-price hidden');
  threeMonthsElement.textContent = '3 Months Ago: ';
  const spanThreeMonths = document.createElement('span');
  spanThreeMonths.textContent = '$' + favorites[cryptoID].pastPrices.threeMonths;
  threeMonthsElement.appendChild(spanThreeMonths);
  cardTextDiv.appendChild(threeMonthsElement);

  const sixMonthsElement = document.createElement('p');
  sixMonthsElement.setAttribute('class', 'past-price hidden');
  sixMonthsElement.textContent = '6 Months Ago: ';
  const spanSixMonths = document.createElement('span');
  spanSixMonths.textContent = '$' + favorites[cryptoID].pastPrices.sixMonths;
  sixMonthsElement.appendChild(spanSixMonths);
  cardTextDiv.appendChild(sixMonthsElement);

  const oneYearElement = document.createElement('p');
  oneYearElement.setAttribute('class', 'past-price hidden');
  oneYearElement.textContent = '1 Year Ago: ';
  const spanOneYear = document.createElement('span');
  spanOneYear.textContent = '$' + favorites[cryptoID].pastPrices.oneYear;
  oneYearElement.appendChild(spanOneYear);
  cardTextDiv.appendChild(oneYearElement);

  const fiveYearsElement = document.createElement('p');
  fiveYearsElement.setAttribute('class', 'past-price hidden');
  fiveYearsElement.textContent = '5 Years Ago: ';
  const spanFiveYears = document.createElement('span');
  spanFiveYears.textContent = '$' + favorites[cryptoID].pastPrices.fiveYears;
  fiveYearsElement.appendChild(spanFiveYears);
  cardTextDiv.appendChild(fiveYearsElement);

  const heartIconElement = document.createElement('i');
  heartIconElement.setAttribute('class', 'fas fa-heart mini shrunk');
  miniCardDiv.appendChild(heartIconElement);

  return miniCardDiv;
}

function viewSwapper(event) {
  const searchedItem = document.querySelector('.container.searched-item');
  const homeLink = document.querySelector('.nav-item.home');
  const favoritesLink = document.querySelector('.nav-item.favorites');
  miniCards = document.querySelectorAll('.mini-card');
  toggleNav();
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

function toggleNav() {
  navOpen = !navOpen;
  if (navOpen) {
    navBar.className = 'nav-bar opened';
    navContent[0].className = 'nav-row item';
    navContent[1].className = 'nav-row item';
  } else {
    navBar.className = 'nav-bar';
    navContent[0].className = 'nav-row item hidden';
    navContent[1].className = 'nav-row item hidden';
  }
}

function toggleFullScreen() {
  miniCards = document.querySelectorAll('.mini-card');
  prevPrices = document.querySelectorAll('.past-price');
  expandIcon = document.querySelector('i.fa-expand');
  if (!cardFullScreen) {
    if (favorite) {
      heartIcon.setAttribute('class', 'fas fa-heart main heart-full-screen favorited');
    } else {
      heartIcon.setAttribute('class', 'fas fa-heart main heart-full-screen');
    }
    expandIcon.setAttribute('class', 'fas fa-expand expand-full-screen');
    mainCard.setAttribute('class', 'col card card-full-screen');
    cryptoCardText.setAttribute('class', 'crypto-card-text text-full-screen');
    horizontalRules[0].setAttribute('class', '');
    horizontalRules[1].setAttribute('class', '');
    prevPrices.forEach(el => el.setAttribute('class', 'past-price'));
    miniCards.forEach(el => el.setAttribute('class', 'mini-card hidden'));
    cardFullScreen = true;
  } else {
    if (favorite) {
      heartIcon.setAttribute('class', 'fas fa-heart main favorited');
    } else {
      heartIcon.setAttribute('class', 'fas fa-heart main');
    }
    expandIcon.setAttribute('class', 'fas fa-expand');
    mainCard.setAttribute('class', 'col card');
    cryptoCardText.setAttribute('class', 'crypto-card-text');
    horizontalRules[0].setAttribute('class', 'hidden');
    horizontalRules[1].setAttribute('class', 'hidden');
    prevPrices.forEach(el => el.setAttribute('class', 'past-price hidden'));
    miniCards.forEach(el => el.setAttribute('class', 'mini-card'));
    cardFullScreen = false;
  }
}

function toggleMiniFullScreen(event) {
  miniExpandIcons = document.querySelectorAll('.fa-expand.mini');
  miniCards = document.querySelectorAll('.mini-card');
  miniCardsH4 = document.querySelectorAll('.mini-crypto-card-text > h4');
  if (!miniCardFullScreen) {
    if (event.target.className.includes(miniExpandIcons[0].className)) {
      miniCards.forEach(el => el.setAttribute('class', 'mini-card hidden'));
      event.target.closest('.mini-card').setAttribute('class', 'mini-card-full-screen');
      prevPrices = document.querySelectorAll('.mini-card-full-screen .past-price');
      prevPrices.forEach(el => el.setAttribute('class', 'past-price'));
      miniExpandIcons.forEach(el => el.setAttribute('class', 'fas fa-expand mini expand-full-screen'));
      event.target.nextElementSibling.nextElementSibling.setAttribute('class', 'fas fa-heart mini heart-full-screen');
      event.target.nextElementSibling.children[0].setAttribute('class', '');
      event.target.nextElementSibling.children[2].setAttribute('class', '');
      miniCardFullScreen = true;
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
      miniExpandIcons.forEach(el => el.setAttribute('class', 'fas fa-expand mini'));
      event.target.nextElementSibling.nextElementSibling.setAttribute('class', 'fas fa-heart mini shrunk');
      event.target.nextElementSibling.children[0].setAttribute('class', 'hidden');
      event.target.nextElementSibling.children[2].setAttribute('class', 'hidden');
      miniCardFullScreen = false;
    } else {
      const miniCardFullScreenElement = document.querySelector('div.mini-card-full-screen');
      if (miniCardFullScreenElement) {
        miniCards.forEach(el => el.setAttribute('class', 'mini-card'));
        miniCardFullScreenElement.setAttribute('class', 'mini-card');
        prevPrices = document.querySelectorAll('.mini-card .past-price');
        prevPrices.forEach(el => el.setAttribute('class', 'past-price hidden'));
        miniExpandIcons.forEach(el => el.setAttribute('class', 'fas fa-expand mini'));
        const allHearts = document.querySelectorAll('.fa-heart');
        allHearts.forEach(el => el.setAttribute('class', 'fas fa-heart mini shrunk'));
        const allHR = document.querySelectorAll('hr');
        allHR.forEach(el => el.setAttribute('class', 'hidden'));
        miniCardFullScreen = false;
      }
    }
  }

  if (event.target.className.includes('fas fa-heart mini')) {
    if (event.target.previousSibling.children[1].textContent.split(' (')[0] === 'Alpha Token') {
      delete favorites['alpha-platform'];
    } else {
      delete favorites[event.target.previousSibling.children[1].textContent.split(' (')[0].toLowerCase().replaceAll(' ', '-')];
    }

    if (event.target.closest('.mini-card')) {
      event.target.closest('.mini-card').remove();
      const noFavorites = document.querySelector('.no-favorites');
      if (Object.keys(favorites).length === 0 && !noFavorites) {
        miniCardRow.appendChild(noFavoritesTextCreator());
      }
    }
  }
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
      const noFavorites = document.querySelector('.no-favorites');
      if (noFavorites) {
        miniCardRow.removeChild(noFavorites);
      }
    }
  } else {
    if (heartIcon.className.includes('heart-full-screen')) {
      heartIcon.setAttribute('class', 'fas fa-heart main heart-full-screen');
    } else {
      heartIcon.setAttribute('class', 'fas fa-heart main');
    }
    miniCards = document.querySelectorAll('.mini-card');
    miniCardsH4 = document.querySelectorAll('.mini-crypto-card-text > h4');
    for (let i = 0; i < miniCardsH4.length; i++) {
      if (miniCardsH4[i].textContent.split(' (')[0] === crypto.name) {
        miniCards[i].remove();
        delete favorites[crypto.id];
      }
    }
    const noFavorites = document.querySelector('.no-favorites');
    if (Object.keys(favorites).length === 0 && !noFavorites) {
      miniCardRow.appendChild(noFavoritesTextCreator());
    }
  }
}

function dateGenerator(daysAgo) {
  const millisecondsAgo = daysAgo * 86400000;
  const currentMilliseconds = Date.now();
  const resultMilliseconds = currentMilliseconds - millisecondsAgo;
  const date = new Date(resultMilliseconds);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const fullDate = day + '-' + month + '-' + year;

  return fullDate;
}

function errorTextCreator() {
  errorText = document.createElement('h3');
  errorText.setAttribute('class', 'not-found');
  errorText.textContent = 'Cryptocurrency not found.';

  return errorText;
}

function networkErrorTextCreator() {
  errorText = document.createElement('h3');
  errorText.setAttribute('class', 'not-found');
  errorText.textContent = 'Network Error. Please Try Again.';

  return errorText;
}

function noFavoritesTextCreator() {
  const h4Element = document.createElement('h4');
  h4Element.setAttribute('class', 'no-favorites');
  h4Element.textContent = 'No Favorites';

  return h4Element;
}
