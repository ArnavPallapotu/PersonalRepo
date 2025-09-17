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

    runTests();
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
