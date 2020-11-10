var navOpen = false;
var navButton = document.querySelector('i.fa-bars');
var navBar = document.querySelector('header.nav-bar');
var navRows = document.querySelectorAll('.nav-row.item');

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
