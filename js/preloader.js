window.addEventListener('load', function() {
    setTimeout(function() {
    const preloader = document.querySelector('.preloader');
    preloader.style.opacity = '0';
    setTimeout(() => preloader.style.display = 'none', 500);
  }, 1500); // Tiempo mínimo de visualización
});