function fadeOut(elem) {
  $(elem)[0].classList.add('fadeOut');
  setTimeout(() => {
    $(elem)[0].style.display = 'none';
  }, 510)
}