/**
 * Søk på tvers av byer, festivaler, arenaer og artister.
 * Brukes på forsiden og på søk-siden. Base-URL bestemmes ut fra pathname.
 */
(function () {
  'use strict';

  var searchInput = document.getElementById('sok-input');
  var searchResults = document.getElementById('sok-resultater');
  if (!searchInput) return;

  var base = (typeof window !== 'undefined' && window.location.pathname.indexOf('sok') !== -1) ? '../' : '';
  var byer = [
    { navn: 'Oslo', url: base + 'byer/oslo/', type: 'By' },
    { navn: 'Bergen', url: base + 'byer/bergen/', type: 'By' },
    { navn: 'Trondheim', url: base + 'byer/trondheim/', type: 'By' },
    { navn: 'Stavanger', url: base + 'byer/stavanger/', type: 'By' },
    { navn: 'Tromsø', url: base + 'byer/tromso/', type: 'By' },
    { navn: 'Kristiansand', url: base + 'byer/kristiansand/', type: 'By' },
    { navn: 'Tønsberg', url: base + 'byer/tonsberg/', type: 'By' },
    { navn: 'Ålesund', url: base + 'byer/alesund/', type: 'By' }
  ];

  var searchIndex = [];
  var loaded = { arenaer: false, festivaler: false, artister: false };

  function slug(s) {
    return String(s).toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[æå]/g, 'a')
      .replace(/ø/g, 'o')
      .replace(/[^a-z0-9-]/g, '');
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function normalize(q) {
    return String(q).toLowerCase().trim().replace(/\s+/g, ' ');
  }

  function matchQuery(item, q) {
    var n = normalize(item.searchText || item.navn);
    var parts = q.split(/\s+/);
    for (var i = 0; i < parts.length; i++) {
      if (n.indexOf(parts[i]) === -1) return false;
    }
    return true;
  }

  function addToIndex(items, type, urlFn) {
    items.forEach(function (item) {
      var name = item.navn;
      var url = typeof urlFn === 'function' ? urlFn(item) : (item.url || '#');
      var searchText = name + ' ' + (item.by || '') + ' ' + (item.region || '') + ' ' + (item.sjanger || '') + ' ' + (item.beskrivelse || '');
      searchIndex.push({ navn: name, url: url, type: type, searchText: normalize(searchText) });
    });
  }

  function buildByerIndex() {
    addToIndex(byer, 'By', function (b) { return b.url; });
  }

  function loadArenaer() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', base + 'data/arenaer.json', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      try {
        var data = JSON.parse(xhr.responseText);
        var arenaer = data.arenaer || [];
        var bySlug = { Oslo: 'oslo', Bergen: 'bergen', Trondheim: 'trondheim', Stavanger: 'stavanger', Tromsø: 'tromso', Kristiansand: 'kristiansand', Tønsberg: 'tonsberg', Ålesund: 'alesund' };
        addToIndex(arenaer, 'Arena', function (a) {
          var byPath = bySlug[a.by] || (a.by && a.by.toLowerCase().replace(/\s/g, '-').replace(/ø/g, 'o').replace(/å/g, 'a')) || 'oslo';
          return base + 'byer/' + byPath + '/' + (a.slug || slug(a.navn)) + '/';
        });
        loaded.arenaer = true;
      } catch (e) {}
    };
    xhr.send();
  }

  function loadFestivaler() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', base + 'data/festivaler.json', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      try {
        var data = JSON.parse(xhr.responseText);
        var festivaler = data.festivaler || [];
        addToIndex(festivaler, 'Festival', function (f) {
          return base + 'festivaler/' + slug(f.navn) + '/';
        });
        loaded.festivaler = true;
      } catch (e) {}
    };
    xhr.send();
  }

  function loadArtister() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', base + 'data/artister.json', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      try {
        var data = JSON.parse(xhr.responseText);
        var artister = (data.artister || []).map(function (a) {
          return { navn: a.navn, url: base + 'artister/#artist' };
        });
        addToIndex(artister, 'Artist', function (a) { return a.url; });
        loaded.artister = true;
      } catch (e) {
        loaded.artister = true;
      }
    };
    xhr.send();
  }

  function runSearch(query) {
    var q = normalize(query);
    if (q.length < 2) {
      if (searchResults) searchResults.innerHTML = '';
      return;
    }
    var hits = searchIndex.filter(function (item) {
      return matchQuery(item, q);
    });
    hits = hits.slice(0, 15);
    renderResults(hits);
  }

  function renderResults(hits) {
    if (!searchResults) return;
    if (hits.length === 0) {
      searchResults.innerHTML = '<p class="sok-ingen">Ingen treff. Prøv by, festival, arena eller artist.</p>';
      searchResults.classList.add('is-open');
      return;
    }
    var html = '<ul class="sok-liste" role="list">';
    hits.forEach(function (h) {
      html += '<li><a href="' + escapeHtml(h.url) + '"><span class="sok-navn">' + escapeHtml(h.navn) + '</span> <span class="sok-type">' + escapeHtml(h.type) + '</span></a></li>';
    });
    html += '</ul>';
    searchResults.innerHTML = html;
    searchResults.classList.add('is-open');
  }

  function hideResults() {
    if (searchResults) {
      searchResults.classList.remove('is-open');
    }
  }

  buildByerIndex();
  loadArenaer();
  loadFestivaler();
  loadArtister();

  searchInput.addEventListener('input', function () {
    runSearch(searchInput.value);
  });
  searchInput.addEventListener('focus', function () {
    if (searchInput.value.trim().length >= 2) runSearch(searchInput.value);
  });
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hideResults();
  });
  document.addEventListener('click', function (e) {
    if (searchResults && !searchInput.contains(e.target) && !searchResults.contains(e.target)) hideResults();
  });
})();
