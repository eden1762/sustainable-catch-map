(function () {
  'use strict';

  function currentLang() {
    return window.SCMLanguage && typeof window.SCMLanguage.current === 'function'
      ? window.SCMLanguage.current()
      : (localStorage.getItem('scm-language') === 'en' ? 'en' : 'zh');
  }

  function logoAlt() {
    return currentLang() === 'en'
      ? 'FishFull official trademark logo'
      : 'FishFull 漁有料官方商標';
  }

  function useOfficialHomeLogo() {
    document.querySelectorAll('.brand-mark .brand-sun').forEach(function (mark) {
      var holder = document.createElement('span');
      holder.className = 'fishfull-logo-mark home-brand-logo';
      holder.setAttribute('aria-hidden', 'true');
      holder.innerHTML = '<img src="/fishfull.jpg" width="44" height="44" loading="eager" decoding="async" alt="">';
      mark.replaceWith(holder);
    });

    document.querySelectorAll('.brand-mark .home-brand-logo img').forEach(function (img) {
      img.alt = logoAlt();
    });
  }

  document.addEventListener('DOMContentLoaded', useOfficialHomeLogo);
  document.addEventListener('scm-language-change', function () {
    window.requestAnimationFrame(useOfficialHomeLogo);
  });
})();
