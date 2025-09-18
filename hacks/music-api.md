---
title: JS Itunes API
description: API's are a primary source for obtaining data from the internet. There is imformation in API's for almost any interest.
permalink: /music-api
---

<!-- Input box and button for filter -->
<div>
  <input type="text" id="filterInput" placeholder="Enter iTunes filter">
  <label style="margin-left:8px; font-weight:normal;"><input type="checkbox" id="genrePop"> Pop?</label>
  <button id="searchBtn">Search</button>
</div>

<!-- Suggestions will appear here -->
<div id="suggestions" style="margin: 10px 0;"></div>
<!-- Recent searches will appear here -->
<div id="recentSearches" style="margin: 10px 0;"></div>

<!-- HTML table fragment for page -->
<table>
  <thead>
    <tr>
      <th>Artist</th>
      <th>Track</th>
      <th>Images</th>
      <th>Preview</th>
      <th>Popularity Rank</th>
    </tr>
  </thead>
  <tbody id="result">
    <!-- generated rows -->
  </tbody>
</table>

<script type="module">
  import { Requestor } from '{{site.baseurl}}/assets/js/itunes/api.js';
  import { Handler } from '{{site.baseurl}}/assets/js/itunes/handler.js';

  const API_URL = "https://itunes.apple.com";
  const requestor = new Requestor(API_URL);
  // handler and DOM containers will be initialized once the DOM is ready
  let handler = null;
  let resultContainer = null;
  let suggestionsContainer = null;
  let recentSearchesContainer = null;

  const staticSuggestions = [
    "Taylor Swift", "Drake", "The Beatles", 
    "Eminem", "Billie Eilish", "Coldplay", 
    "Kanye West", "Ariana Grande", "Ed Sheeran"
  ];

  function getSuggestions(query) {
    if (!query) return staticSuggestions.slice();
    const q = query.toLowerCase();
    return staticSuggestions.filter(s => s.toLowerCase().includes(q));
  }

  function renderAllSuggestions() {
    suggestionsContainer.innerHTML = '';
    for (const s of staticSuggestions) {
      const btn = document.createElement('button');
      btn.innerText = s;
      btn.style.marginRight = '6px';
      btn.style.marginBottom = '6px';
      btn.className = 'suggest-chip';
      btn.onclick = () => {
        document.getElementById('filterInput').value = s;
        fetchDataWithSave(s);
        suggestionsContainer.innerHTML = '';
      };
      suggestionsContainer.appendChild(btn);
    }
  }

  function showSuggestions(query) {
    suggestionsContainer.innerHTML = "";
    const matches = getSuggestions(query);
    if (!matches.length) return;
    for (const match of matches) {
      const btn = document.createElement("button");
      btn.innerText = match;
      btn.style.marginRight = "5px";
      btn.onclick = () => {
        document.getElementById("filterInput").value = match;
        fetchDataWithSave(match);
        suggestionsContainer.innerHTML = "";
      };
      suggestionsContainer.appendChild(btn);
    }
  }

  // suggestion input handler will be attached after DOM is ready

  const RECENT_KEY = 'music_api_recent_searches';
  function loadRecentSearches() {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) { return []; }
  }

  function saveRecentSearch(term) {
    if (!term) return;
    const list = loadRecentSearches();
    const normalized = term.trim();
    const idx = list.findIndex(x => x.toLowerCase() === normalized.toLowerCase());
    if (idx !== -1) list.splice(idx, 1);
    list.unshift(normalized);
    while (list.length > 10) list.pop();
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch (e) { console.warn('Unable to save recent searches', e); }
    renderRecentSearches();
  }

  function renderRecentSearches() {
    if (!recentSearchesContainer) return;
    recentSearchesContainer.innerHTML = '';
    const list = loadRecentSearches();
    if (!list.length) return;
    const title = document.createElement('div');
    title.innerText = 'Recent searches:';
    title.style.marginBottom = '6px';
    recentSearchesContainer.appendChild(title);
    for (const s of list) {
      const btn = document.createElement('button');
      btn.innerText = s;
      btn.style.marginRight = '6px';
      btn.style.marginBottom = '6px';
      btn.onclick = () => fetchDataWithSave(s);
      recentSearchesContainer.appendChild(btn);
    }
    const clr = document.createElement('button');
    clr.innerText = 'Clear';
    clr.style.marginLeft = '8px';
    clr.onclick = () => { localStorage.removeItem(RECENT_KEY); renderRecentSearches(); };
    recentSearchesContainer.appendChild(clr);
  }

  async function fetchDataWithSave(term) {
    const t = (term || document.getElementById('filterInput').value || '').trim();
    if (!t) return;
    saveRecentSearch(t);
    try {
      // include genreId=14 when "Pop?" checkbox is checked
      const genrePopEl = document.getElementById('genrePop');
      const opts = { term: t, limit: 20 };
      if (genrePopEl && genrePopEl.checked) opts.genreId = 14;
      const results = await requestor.search(opts);
      handler.clearResults();
      handler.handleResponse(results);

      // Defensive post-processing: ensure results exist and are an array
      if (results && Array.isArray(results.results)) {
        const rows = resultContainer.querySelectorAll('tr');
        results.results.forEach((item, idx) => {
          const tr = rows[idx];
          if (!tr) return;

          // Make track name clickable (safe DOM creation)
          const titleCell = tr.children[1];
          if (titleCell) {
            const href = item.trackViewUrl || item.collectionViewUrl || '';
            const text = (titleCell.textContent && titleCell.textContent.trim()) || item.trackName || item.collectionName || '';
            if (href) {
              // clear existing content and append an anchor
              titleCell.textContent = '';
              const a = document.createElement('a');
              a.href = href;
              a.target = '_blank';
              a.rel = 'noopener noreferrer';
              a.textContent = text;
              titleCell.appendChild(a);
            }
          }

          // Add popularity rank column safely
          let rankCell = tr.children[4];
          if (!rankCell) {
            rankCell = document.createElement('td');
            tr.appendChild(rankCell);
          }
          rankCell.textContent = String(idx + 1);
        });
      } else {
        // no results to post-process
        console.warn('No results returned to post-process linking.');
      }

    } catch (e) {
      console.error("Search failed", e);
      handler.handleError(e);
    }
  }

  document.addEventListener('DOMContentLoaded', () => { 
    // Now that DOM is ready, wire up elements and handler
    resultContainer = document.getElementById("result");
    suggestionsContainer = document.getElementById("suggestions");
    recentSearchesContainer = document.getElementById("recentSearches");

    // instantiate handler with the id of the container
    try {
      handler = new Handler("result");
    } catch (e) {
      console.warn('Handler could not be instantiated on load', e);
    }

    // render static suggestions and recent searches
    renderAllSuggestions(); 
    renderRecentSearches(); 

    // input -> show suggestions as user types
    const filterInputEl = document.getElementById("filterInput");
    if (filterInputEl) {
      filterInputEl.addEventListener("input", (e) => {
        showSuggestions(e.target.value);
      });
      // Enter key triggers search
      filterInputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') fetchDataWithSave(); });
    }

    // Search button event listener
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.addEventListener('click', () => { fetchDataWithSave(); });
  });

</script>

## Hacks

The endpoint itunes.apple.com allows requests and they provide responses with their data.   Our formatting of the response provides the Input and Output interaction with the itunes data.  

We do not create or manage their data.  The itunes system has backend processes that create and store data.  

In this type of Website relationship we itunes could provide.

- A better starting screen.  Providing sample sample queries on screen.
- Provide local storage to show recent or liked queries by the user.
- Have interaction between this API and other functions on our site.  For instance, we could allow music selection to dictate background music while playing a game.

But, we would need backend help from itunes to..

- Show most popular queries.
- Show songs by genre.
- Show songs by era.

```
