// Redirect to canonical domain while preserving path, query, and hash
(function () {
  const { hostname, pathname, search, hash } = window.location;
  if (!hostname.startsWith('www.')) {
    const target = `https://www.bridgeniagara.org${pathname}${search}${hash}`;
    window.location.replace(target);
  }
})();
