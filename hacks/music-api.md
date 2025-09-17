---
title: JS Itunes API
description: API's are a primary source for obtaining data from the internet.  There is imformation in API's for almost any interest.
permalink: /music-api
---

<!-- Input box and button for filter -->
<div>
  <input type="text" id="filterInput" placeholder="Enter iTunes filter">
  <button onclick="fetchDataWithSave()">Search</button>
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
  // Handler expects the id of the container it will render into
  const handler = new Handler("result");

  const resultContainer = document.getElementById("result");
  const suggestionsContainer = document.getElementById("suggestions");
  const recentSearchesContainer = document.getElementById("recentSearches");

  const staticSuggestions = [
    "Taylor Swift", "Drake", "The Beatles", 
    "Eminem", "Billie Eilish", "Coldplay", 
    "Kanye West", "Ariana Grande", "Ed Sheeran"
  ];

  // return suggestions that match the query (or all when query is empty)
  function getSuggestions(query) {
    if (!query) return staticSuggestions.slice();
    const q = query.toLowerCase();
    return staticSuggestions.filter(s => s.toLowerCase().includes(q));
  }

  // render all suggestion chips (initial view)
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

  // Show suggestions under input
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
  document.getElementById("filterInput").addEventListener("input", (e) => {
    showSuggestions(e.target.value);
  });

  // recent searches storage
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
    // dedupe
    const idx = list.findIndex(x => x.toLowerCase() === normalized.toLowerCase());
    if (idx !== -1) list.splice(idx, 1);
    list.unshift(normalized);
    // limit history
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

  // wrapper that saves search term then delegates
  async function fetchDataWithSave(term) {
    const t = (term || document.getElementById('filterInput').value || '').trim();
    if (!t) return;
    saveRecentSearch(t);
    try {
      const results = await requestor.search({ term: t, limit: 20 });
      // Use Handler's API to render results (we don't modify handler.js)
      handler.clearResults();
      handler.handleResponse(results);

      // Post-process created rows to link title to iTunes (trackViewUrl or collectionViewUrl)
      try {
        const rows = resultContainer.querySelectorAll('tr');
        results.results.forEach((item, idx) => {
          const tr = rows[idx];
          if (!tr) return;
          const titleCell = tr.children[1]; // handler renders: artist, title, image, preview
          if (!titleCell) return;
          const href = item.trackViewUrl || item.collectionViewUrl || '';
          const text = titleCell.textContent || item.trackName || item.collectionName || '';
          if (href) {
            titleCell.innerHTML = `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
          }
        });
      } catch (err) {
        // ignore post-processing errors but log for debugging
        console.warn('Post-process linking failed', err);
      }

    } catch (e) {
      console.error("Search failed", e);
      handler.handleError(e);
    }
  }

  // render chips & recent on initial load
  document.addEventListener('DOMContentLoaded', () => { renderAllSuggestions(); renderRecentSearches(); });

  // allow Enter to trigger saved search
  document.getElementById('filterInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') fetchDataWithSave(); });

  // tests
  runTests();
  async function runTests() {
    try {
      console.log("=== Test basic search ===");
      const result1 = await requestor.search({ term: 'jack johnson', limit: 10 });
      console.log("Basic search results:", result1);

      console.log("=== Test music specific search ===");
      const result2 = await requestor.searchMusic('taylor swift', { entity: 'album', limit: 5 });
      console.log("Music search results:", result2);

      console.log("=== Test advanced search ===");
      const result3 = await requestor.search({
        term: 'star wars',
        media: 'movie',
        country: 'US',
        limit: 25,
        explicit: 'No'
      });
      console.log("Advanced search results:", result3);
    } catch (error) {
      console.error('Test failed:', error);
    }
  }
</script>

## Hacks

The endpoint itunes.apple.com allows requests and they provide responses with their data.   Our formatting of the response provides the Input and Output interaction with the itunes data.  

We do not create or manage their data.  The itunes system has  backend processes that create and store data.  

In this type of Website relationship we itunes could provide.

- A better starting screen.  Providing sample sample queries on screen.
- Provide local storage to show recent or liked queries by the user.
- Have interaction between this API and other functions on our site.  For instance, we could allow music selection to dictate background music while playing a game.

But, we would need backend help from itunes to..

- Show most popular queries.
- Show songs by genre.
- Show songs by era.
