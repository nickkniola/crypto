var favorites = {};

var crypto = {};
crypto.pastPrices = {};

var savedFavorites = localStorage.getItem('favoritesData');
if (savedFavorites !== null && savedFavorites !== 'undefined') {
  favorites = JSON.parse(savedFavorites);
}

window.addEventListener('beforeunload', function () {
  var favoritesJSON = JSON.stringify(favorites);
  localStorage.setItem('favoritesData', favoritesJSON);
});

window.addEventListener('load', function () {
  getPrice('bitcoin');
});
