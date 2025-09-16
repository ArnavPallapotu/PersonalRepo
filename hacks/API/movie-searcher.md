---
title: Movie Searcher (OMDb)
description: A simple Movie Searcher web app using the OMDb API (single-file HTML you can copy and run).
comments: false
layout: opencs
permalink: /movie-searcher
menu: nav/javascript_project.html
---

# Movie Searcher (OMDb)


<!-- Input box and button for filter -->
<div>
  <input type="text" id="searchInput" placeholder="Enter movie title (e.g. The Matrix)">
  <button onclick="fetchSearchResults()">Search</button>
</div>

<!-- HTML table fragment for page -->
<table>
  <thead>
    <tr>
      <th>Poster</th>
      <th>Title</th>
      <th>Year</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody id="result">
    <!-- generated rows -->
  </tbody>
</table>

<!-- Details section -->
<div id="movieDetails"></div>

<style>
  table{width:100%;border-collapse:collapse}
  th,td{padding:8px;border-bottom:1px solid #e6e6e6}
  img.poster{width:80px;height:120px;object-fit:cover}
  .message{padding:12px;background:#fff;border-radius:8px;border:1px solid #eee;margin-top:14px}
</style>

<script>
  // API key and elements
  const API_KEY = '8309a392';
  const resultContainer = document.getElementById('result');
  const detailsEl = document.getElementById('movieDetails');

  // placeholder image when Poster is N/A
  const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect width="100%" height="100%" fill="%23eef2ff"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239aa4c6" font-size="16">No Poster</text></svg>';

  function fetchSearchResults() {
    // clear previous
    resultContainer.innerHTML = '';
    detailsEl.innerHTML = '';

    const filterInput = document.getElementById('searchInput');
    const query = filterInput.value.trim();
    if (!query) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 4;
      td.innerText = 'Please enter a movie title to search.';
      td.style.padding = '12px';
      tr.appendChild(td);
      resultContainer.appendChild(tr);
      return;
    }

    const url = 'https://www.omdbapi.com/?apikey=' + API_KEY + '&s=' + encodeURIComponent(query);
    fetch(url)
      .then(response => {
        if (response.status !== 200) {
          const tr = document.createElement('tr');
          const td = document.createElement('td');
          td.colSpan = 4;
          td.innerText = 'Database response error: ' + response.status;
          td.style.padding = '12px';
          tr.appendChild(td);
          resultContainer.appendChild(tr);
          return;
        }
        return response.json();
      })
      .then(data => {
        if (!data) return;
        if (data.Response === 'False') {
          const tr = document.createElement('tr');
          const td = document.createElement('td');
          td.colSpan = 4;
          td.innerText = 'No movies found.';
          td.style.padding = '12px';
          tr.appendChild(td);
          resultContainer.appendChild(tr);
          return;
        }
        renderResults(data.Search || []);
      })
      .catch(err => {
        console.error(err);
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 4;
        td.style.padding = '12px';
        td.innerText = 'Error fetching search results: ' + err;
        tr.appendChild(td);
        resultContainer.appendChild(tr);
      });
  }

  function renderResults(items) {
    resultContainer.innerHTML = '';
    for (const movie of items) {
      const tr = document.createElement('tr');

      const tdPoster = document.createElement('td');
      const img = document.createElement('img');
      img.className = 'poster';
      img.src = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER;
      img.alt = movie.Title + ' poster';
      tdPoster.appendChild(img);

      const tdTitle = document.createElement('td');
      tdTitle.innerText = movie.Title;

      const tdYear = document.createElement('td');
      tdYear.innerText = movie.Year;

      const tdActions = document.createElement('td');
      const btn = document.createElement('button');
      btn.innerText = 'More Info';
      btn.onclick = function() { fetchMovieDetails(movie.imdbID); };
      tdActions.appendChild(btn);

      tr.appendChild(tdPoster);
      tr.appendChild(tdTitle);
      tr.appendChild(tdYear);
      tr.appendChild(tdActions);

      resultContainer.appendChild(tr);
    }
  }

  function fetchMovieDetails(imdbID) {
    detailsEl.innerHTML = '<div class="message">Loading details...</div>';
    const url = 'https://www.omdbapi.com/?apikey=' + API_KEY + '&i=' + encodeURIComponent(imdbID) + '&plot=full';
    fetch(url)
      .then(res => {
        if (res.status !== 200) throw new Error('Network response error: ' + res.status);
        return res.json();
      })
      .then(data => {
        if (data.Response === 'False') {
          detailsEl.innerHTML = '<div class="message">Details not found.</div>';
          return;
        }
        renderMovieDetails(data);
      })
      .catch(err => {
        console.error(err);
        detailsEl.innerHTML = '<div class="message">Error loading details: ' + err + '</div>';
      });
  }

  function renderMovieDetails(movie) {
    const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER;
    detailsEl.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = '12px';

    const imgWrap = document.createElement('div');
    const img = document.createElement('img');
    img.src = poster;
    img.alt = movie.Title + ' poster';
    img.style.width = '200px';
    img.style.height = '300px';
    img.style.objectFit = 'cover';
    imgWrap.appendChild(img);

    const info = document.createElement('div');
    info.innerHTML = `
      <h2>${movie.Title} <small style="color:#6b7280">(${movie.Year})</small></h2>
      <p><strong>Genre:</strong> ${movie.Genre || '—'}</p>
      <p><strong>Director:</strong> ${movie.Director || '—'}</p>
      <p><strong>Actors:</strong> ${movie.Actors || '—'}</p>
      <p><strong>IMDb Rating:</strong> ${movie.imdbRating || '—'}</p>
      <p><strong>Plot:</strong> ${movie.Plot || '—'}</p>
    `;

    wrapper.appendChild(imgWrap);
    wrapper.appendChild(info);
    detailsEl.appendChild(wrapper);
  }
</script>

## Notes


