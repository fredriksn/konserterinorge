/**
 * Laster og viser festivaler fra data/festivaler.json med filtrering,
 * paginering (24 per side), URL-sync, hurtigfiltre og store festivaler.
 */
(function () {
  'use strict';

  var PAGE_SIZE = 24;
  var filterSearch = document.getElementById('filter-search');
  var filterMonth = document.getElementById('filter-month');
  var filterRegion = document.getElementById('filter-region');
  var filterSjanger = document.getElementById('filter-sjanger');
  var resetBtn = document.getElementById('reset-filters');
  var filterToggle = document.getElementById('filter-toggle');
  var filterDropdownFields = document.getElementById('filter-dropdown-fields');
  var listEl = document.getElementById('festival-list');
  var featuredEl = document.getElementById('festival-featured');
  var featuredSection = document.getElementById('festival-featured-section');
  var otherSection = document.getElementById('festival-other-section');
  var otherHeading = document.getElementById('other-heading');
  var countEl = document.getElementById('result-count');
  var loadMoreWrap = document.getElementById('festival-load-more-wrap');
  var loadMoreBtn = document.getElementById('load-more-btn');
  var chipsEl = document.getElementById('filter-chips');
  var allFestivaler = [];
  var sjangere = [];
  var currentPage = 1;
  var lastFiltered = [];

  /** Slugs for «store festivaler» som vises øverst */
  var storeFestivalSlugs = [
    'oyafestivalen', 'oyafest', 'slottsfjell', 'bergenfest', 'tons-of-rock', 'tonsof-rock',
    'stavernfestivalen', 'stavemfestivalen', 'palmesus', 'inferno-metal-festival',
    'notodden-blues', 'moldejazz', 'kongsberg-jazzfestival', 'vossa-jazz',
    'fordefestivalen', 'buktafestivalen', 'nattjazz', 'malakoff', 'bylarm'
  ];

  var regionDisplay = {
    'Øst': 'Øst (Oslo, Viken, Østfold)',
    'Vest': 'Vest (Vestland)',
    'Sør': 'Sør (Rogaland, Agder)',
    'Nord': 'Nord (Nord-Norge)',
    'Midt': 'Trøndelag',
    'Innlandet': 'Innlandet (Hedmark, Oppland)',
    'Diverse': 'Diverse'
  };

  var regionValues = ['Øst', 'Vest', 'Sør', 'Nord', 'Midt', 'Innlandet'];

  function slug(s) {
    return String(s).toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[æå]/g, 'a')
      .replace(/ø/g, 'o')
      .replace(/[^a-z0-9-]/g, '');
  }

  function parseFestivalNavn(raw) {
    var s = String(raw || '').trim();
    var stedMatch = s.match(/\s*\(([^)]+)\)\s*/);
    var sted = stedMatch ? stedMatch[1].trim() : null;
    var displayName = s
      .replace(/\s*\([^)]+\)\s*/g, '')
      .replace(/\s*\[[^\]]*\]?\s*$/, '')
      .replace(/\s*[–\-]\s*[A-Za-z0-9\s]*$/, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!displayName) displayName = s;
    return { displayName: displayName, sted: sted };
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function renderCards(container, festivaler) {
    if (!container) return;
    container.innerHTML = '';
    festivaler.forEach(function (f) {
      var url = slug(f.navn) + '/';
      var parsed = parseFestivalNavn(f.navn);
      var regionText = regionDisplay[f.region] || f.region;
      var meta = [parsed.sted, regionText, f.sjanger].filter(Boolean).join(' · ');
      var article = document.createElement('article');
      article.className = 'card';
      article.innerHTML =
        '<h3><a href="' + url + '">' + escapeHtml(parsed.displayName) + '</a></h3>' +
        (meta ? '<p class="card-meta">' + escapeHtml(meta) + '</p>' : '');
      container.appendChild(article);
    });
  }

  function updateCount(filteredN, total) {
    if (!countEl) return;
    total = total || filteredN;
    if (filteredN === 0) {
      countEl.textContent = '0 treff';
      countEl.classList.add('result-count-zero');
    } else {
      countEl.classList.remove('result-count-zero');
      if (filteredN === total) {
        countEl.textContent = total + ' festivaler';
      } else {
        countEl.textContent = 'Viser ' + filteredN + ' av ' + total;
      }
    }
  }

  function setHeroTotal(n) {
    var el = document.getElementById('hero-total');
    if (el && n) el.textContent = n + ' festivaler fra hele Norge';
  }

  function getFilterState() {
    return {
      q: filterSearch ? filterSearch.value.trim() : '',
      month: filterMonth ? filterMonth.value : '',
      region: filterRegion ? filterRegion.value : '',
      sjanger: filterSjanger ? filterSjanger.value : ''
    };
  }

  function applyState(state) {
    if (filterSearch) filterSearch.value = state.q || '';
    if (filterMonth) filterMonth.value = state.month || '';
    if (filterRegion) filterRegion.value = state.region || '';
    if (filterSjanger) filterSjanger.value = state.sjanger || '';
  }

  function readUrlState() {
    var params = new URLSearchParams(window.location.search);
    return {
      q: params.get('q') || '',
      month: params.get('month') || '',
      region: params.get('region') || '',
      sjanger: params.get('sjanger') || ''
    };
  }

  function writeUrlState(state) {
    var params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    if (state.month) params.set('month', state.month);
    if (state.region) params.set('region', state.region);
    if (state.sjanger) params.set('sjanger', state.sjanger);
    var qs = params.toString();
    var url = qs ? window.location.pathname + '?' + qs : window.location.pathname;
    window.history.replaceState({}, '', url);
  }

  function getFilteredList() {
    var state = getFilterState();
    var searchLower = (state.q || '').toLowerCase();
    var filtered = allFestivaler.filter(function (f) {
      if (searchLower) {
        var parsed = parseFestivalNavn(f.navn);
        var searchText = (f.navn + ' ' + (parsed.sted || '') + ' ' + (f.sjanger || '')).toLowerCase();
        if (searchText.indexOf(searchLower) === -1) return false;
      }
      if (state.month && f.måned !== state.month) return false;
      if (state.region && f.region !== state.region) return false;
      if (state.sjanger && f.sjanger !== state.sjanger) return false;
      return true;
    });
    return filtered;
  }

  function isStoreFestival(f) {
    var s = slug(f.navn);
    return storeFestivalSlugs.some(function (key) {
      return s.indexOf(key) !== -1 || key.indexOf(s) !== -1;
    });
  }

  function applyFilters() {
    currentPage = 1;
    var state = getFilterState();
    writeUrlState(state);

    var searchLower = (state.q || '').toLowerCase();
    var filtered = allFestivaler.filter(function (f) {
      if (searchLower) {
        var parsed = parseFestivalNavn(f.navn);
        var searchText = (f.navn + ' ' + (parsed.sted || '') + ' ' + (f.sjanger || '')).toLowerCase();
        if (searchText.indexOf(searchLower) === -1) return false;
      }
      if (state.month && f.måned !== state.month) return false;
      if (state.region && f.region !== state.region) return false;
      if (state.sjanger && f.sjanger !== state.sjanger) return false;
      return true;
    });
    lastFiltered = filtered;

    var featured = filtered.filter(isStoreFestival);
    var other = filtered.filter(function (f) { return !isStoreFestival(f); });

    if (featured.length > 0) {
      featuredSection.hidden = false;
      renderCards(featuredEl, featured);
      otherHeading.textContent = 'Andre festivaler';
    } else {
      featuredSection.hidden = true;
      otherHeading.textContent = 'Festivaler';
    }

    if (otherSection) otherSection.hidden = other.length === 0 && featured.length > 0;

    var toShow = other.slice(0, PAGE_SIZE * currentPage);
    renderCards(listEl, toShow);
    updateCount(filtered.length, allFestivaler.length);

    if (other.length > PAGE_SIZE) {
      if (loadMoreWrap) loadMoreWrap.hidden = false;
      if (loadMoreBtn) {
        loadMoreBtn.textContent = 'Last inn flere (' + Math.min(other.length - toShow.length, PAGE_SIZE) + ' igjen)';
        loadMoreBtn.disabled = false;
      }
    } else {
      if (loadMoreWrap) loadMoreWrap.hidden = true;
    }

    var emptyEl = document.getElementById('festival-empty');
    if (filtered.length === 0) {
      if (emptyEl) emptyEl.hidden = false;
      if (featuredSection) featuredSection.hidden = true;
      if (otherSection) otherSection.hidden = true;
    } else {
      if (emptyEl) emptyEl.hidden = true;
      if (otherSection) otherSection.hidden = false;
    }
    updateChipsActive();
  }

  function loadMore() {
    var state = getFilterState();
    var filtered = lastFiltered;
    var other = filtered.filter(function (f) { return !isStoreFestival(f); });
    currentPage += 1;
    var toShow = other.slice(0, PAGE_SIZE * currentPage);
    renderCards(listEl, toShow);
    loadMoreBtn.textContent = toShow.length >= other.length ? 'Alle vist' : 'Last inn flere (' + (other.length - toShow.length) + ' igjen)';
    loadMoreBtn.disabled = toShow.length >= other.length;
  }

  function makeChip(label, type, value, clickFn) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-chip';
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = label;
    btn.dataset.type = type;
    btn.dataset.value = value;
    btn.addEventListener('click', clickFn);
    return btn;
  }

  function buildChips() {
    if (!chipsEl) return;
    chipsEl.innerHTML = '';

    /* Gruppe 1: Område */
    var regionGroup = document.createElement('div');
    regionGroup.className = 'chip-group';
    var regionLabel = document.createElement('span');
    regionLabel.className = 'chip-group-label';
    regionLabel.textContent = 'Område';
    regionGroup.appendChild(regionLabel);

    regionValues.forEach(function (r) {
      var label = r === 'Midt' ? 'Trøndelag' : r;
      var chip = makeChip(label, 'region', r, function () {
        filterRegion.value = filterRegion.value === r ? '' : r;
        applyFilters();
      });
      regionGroup.appendChild(chip);
    });
    chipsEl.appendChild(regionGroup);

    /* Gruppe 2: Sjanger */
    var genreGroup = document.createElement('div');
    genreGroup.className = 'chip-group';
    var genreLabel = document.createElement('span');
    genreLabel.className = 'chip-group-label';
    genreLabel.textContent = 'Sjanger';
    genreGroup.appendChild(genreLabel);

    var topGenres = sjangere.filter(function (s) { return s !== 'Diverse/Kultur'; }).slice(0, 10);
    topGenres.forEach(function (s) {
      var chip = makeChip(s, 'sjanger', s, function () {
        filterSjanger.value = filterSjanger.value === s ? '' : s;
        applyFilters();
      });
      genreGroup.appendChild(chip);
    });
    chipsEl.appendChild(genreGroup);
  }

  function updateChipsActive() {
    if (!chipsEl) return;
    var region = filterRegion ? filterRegion.value : '';
    var sjanger = filterSjanger ? filterSjanger.value : '';
    var chips = chipsEl.querySelectorAll('.filter-chip');
    chips.forEach(function (btn) {
      var type = btn.dataset.type;
      var value = btn.dataset.value;
      var active = (type === 'region' && value === region) || (type === 'sjanger' && value === sjanger);
      btn.classList.toggle('is-active', !!active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function fillSjangerOptions() {
    if (!filterSjanger) return;
    var opts = filterSjanger.querySelectorAll('option:not([value=""])');
    for (var i = 0; i < opts.length; i++) opts[i].remove();
    sjangere.sort();
    sjangere.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      filterSjanger.appendChild(opt);
    });
  }

  function loadFestivaler() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../data/festivaler.json', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      var data;
      try {
        data = JSON.parse(xhr.responseText);
      } catch (e) {
        if (listEl) listEl.innerHTML = '<p class="text-muted">Kunne ikke laste festivaldata.</p>';
        return;
      }
      allFestivaler = data.festivaler || [];
      setHeroTotal(allFestivaler.length);
      var seen = {};
      allFestivaler.forEach(function (f) {
        if (f.sjanger && !seen[f.sjanger]) {
          seen[f.sjanger] = true;
          sjangere.push(f.sjanger);
        }
      });
      fillSjangerOptions();
      buildChips();
      var state = readUrlState();
      applyState(state);
      applyFilters();
      updateChipsActive();
    };
    xhr.send();
  }

  if (filterSearch) {
    filterSearch.addEventListener('input', applyFilters);
    filterSearch.addEventListener('search', applyFilters);
  }
  if (filterMonth) filterMonth.addEventListener('change', applyFilters);
  if (filterRegion) filterRegion.addEventListener('change', applyFilters);
  if (filterSjanger) filterSjanger.addEventListener('change', applyFilters);
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (filterSearch) filterSearch.value = '';
      if (filterMonth) filterMonth.value = '';
      if (filterRegion) filterRegion.value = '';
      if (filterSjanger) filterSjanger.value = '';
      writeUrlState({});
      applyFilters();
      updateChipsActive();
      if (filterSearch) filterSearch.focus();
    });
  }
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMore);
  }

  if (filterToggle && filterDropdownFields) {
    filterToggle.addEventListener('click', function () {
      var open = filterDropdownFields.classList.toggle('is-open');
      filterToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      filterToggle.textContent = open ? 'Lukk filter' : 'Vis filter';
    });
  }

  var emptyReset = document.getElementById('empty-reset');
  if (emptyReset) {
    emptyReset.addEventListener('click', function () {
      if (resetBtn) resetBtn.click();
    });
  }

  window.addEventListener('popstate', function () {
    applyState(readUrlState());
    applyFilters();
    updateChipsActive();
  });

  loadFestivaler();
})();
