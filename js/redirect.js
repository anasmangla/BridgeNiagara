// Redirect root domain to canonical www subdomain
(function () {
  if (window.location.hostname === 'bridgeniagara.org') {
    const { pathname, search, hash } = window.location;
    window.location.replace(`https://www.bridgeniagara.org${pathname}${search}${hash}`);
  }
})();
