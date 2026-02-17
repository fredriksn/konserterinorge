/**
 * Laster og viser konsertarenaer fra data/arenaer.json på forsiden
 */
(function () {
  'use strict';

  var listEl = document.getElementById('arenaer-list');
  if (!listEl) return;

  var bySlug = {
    Oslo: 'oslo',
    Bergen: 'bergen',
    Trondheim: 'trondheim',
    Stavanger: 'stavanger',
    Tromsø: 'tromso',
    Kristiansand: 'kristiansand',
    Tønsberg: 'tonsberg',
    Ålesund: 'alesund'
  };

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function getArenaUrl(arena) {
    var byPath = bySlug[arena.by] || arena.by.toLowerCase().replace(/\s/g, '-').replace(/ø/g, 'o').replace(/å/g, 'a');
    return 'byer/' + byPath + '/' + (arena.slug || '') + '/';
  }

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'data/arenaer.json', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return;
    var data;
    try {
      data = JSON.parse(xhr.responseText);
    } catch (e) {
      listEl.innerHTML = '<p class="text-muted">Kunne ikke laste arenaer. Sjekk at data/arenaer.json finnes.</p>';
      return;
    }
    var arenaer = data.arenaer || [];
    arenaer.forEach(function (a) {
      var url = getArenaUrl(a);
      var card = document.createElement('article');
      card.className = 'card';
      var cap = a.kapasitet_tekst || (a.kapasitet ? 'ca. ' + Number(a.kapasitet).toLocaleString('nb-NO') : '');
      var byLabel = a.by ? ' · ' + escapeHtml(a.by) : '';
      card.innerHTML =
        '<h3><a href="' + escapeHtml(url) + '">' + escapeHtml(a.navn) + '</a></h3>' +
        '<p>' + escapeHtml(a.beskrivelse || '') + (cap ? ' Kapasitet: ' + escapeHtml(cap) : '') + byLabel + '.</p>';
      listEl.appendChild(card);
    });
  };
  xhr.send();
})();
