let favorites = {};

const crypto = {};
crypto.pastPrices = {};

const savedFavorites = localStorage.getItem('favoritesData');
if (savedFavorites !== null && savedFavorites !== 'undefined') {
  favorites = JSON.parse(savedFavorites);
}

window.addEventListener('beforeunload', function () {
  const favoritesJSON = JSON.stringify(favorites);
  localStorage.setItem('favoritesData', favoritesJSON);
});
