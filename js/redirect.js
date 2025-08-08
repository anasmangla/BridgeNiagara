// Redirect to canonical domain while preserving path, query, and hash
(function () {
  const { pathname, search, hash, href, hostname } = window.location;
  const isLocal = hostname === 'localhost' || hostname.endsWith('.local');
  if (isLocal) {
    return;
  }
  const target = `https://www.bridgeniagara.org${pathname}${search}${hash}`;
  if (href !== target) {
    window.location.replace(target);
  }
})();
