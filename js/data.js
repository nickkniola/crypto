/* exported data */
// eslint-disable-next-line no-unused-vars
var favorites = {};
// eslint-disable-next-line no-unused-vars
var crypto = {
  id: '',
  name: '',
  symbol: '',
  price: '',
  pastPrices: {
    oneWeek: '',
    oneMonth: '',
    threeMonths: '',
    sixMonths: '',
    oneYear: '',
    fiveYears: ''
  }
};

var savedFavorites = localStorage.getItem('favoritesData');
if (savedFavorites !== null && savedFavorites !== 'undefined') {
  favorites = JSON.parse(savedFavorites);
}

window.addEventListener('beforeunload', function () {
  var favoritesJSON = JSON.stringify(favorites);
  localStorage.setItem('favoritesData', favoritesJSON);
});
