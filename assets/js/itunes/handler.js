class Handler {
    /**
     * Constructs a new Handler instance
     * @param {string} resultContainerId - HTML DOM ID of the container where results are displayed
     */
    constructor(resultContainerId) {
        this.resultContainer = document.getElementById(resultContainerId);
    }

    /**
     * Clears the results from the HTML container
     */
    clearResults() {
        this.resultContainer.innerHTML = "";
    }

    /**
     * Displays an error message if encountered
     * @param {string} message - the error message
     */
    displayError(message) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 4;
        td.innerHTML = message;
        tr.appendChild(td);
        this.resultContainer.appendChild(tr);
    }

    /**
     * Displays results of the query according to their medium
     * @param {object} data - JSON object containing received data
     * @returns an error if the query fails
     */
    displayResults(data) {
        if (!data.results || data.results.length === 0) {
            this.displayError("No results found.");
            return;
        }
        for (const row of data.results) {
            const tr = document.createElement("tr");

            // Artist/Author/Creator
            const artist = document.createElement("td");
            artist.innerHTML = row.artistName || row.collectionName || row.trackCensoredName || row.collectionCensoredName || row.collectionArtistName || row.artistViewUrl || "";

            // Title/Track/Collection
            const title = document.createElement("td");
            title.innerHTML = row.trackName || row.collectionName || row.artistName || "";

            // Artwork/Image
            const image = document.createElement("td");
            if (row.artworkUrl100) {
                const img = document.createElement("img");
                img.src = row.artworkUrl100;
                img.alt = "Artwork";
                img.width = 60;
                img.height = 60;
                image.appendChild(img);
            }

            // Preview/Link
            const preview = document.createElement("td");
            if (row.previewUrl) {
                // Music/Podcast/Video preview
                const audio = document.createElement("audio");
                audio.controls = true;
                const source = document.createElement("source");
                source.src = row.previewUrl;
                source.type = "audio/mp4";
                audio.appendChild(source);
                preview.appendChild(audio);
            } else if (row.collectionViewUrl || row.trackViewUrl) {
                // For movies, etc.
                const link = document.createElement("a");
                link.href = row.collectionViewUrl || row.trackViewUrl;
                link.target = "_blank";
                link.textContent = "View";
                preview.appendChild(link);
            }

            tr.appendChild(artist);
            tr.appendChild(title);
            tr.appendChild(image);
            tr.appendChild(preview);

            this.resultContainer.appendChild(tr);
        }
    }

    /**
     * Abstraction layer for export; handles result display
     * @param {object} data 
     */
    handleResponse(data) {
        this.displayResults(data);
    }

    /**
     * Abstriction layer for error message; handles error display
     * @param {string} err - the error message
     */
    handleError(err) {
        this.displayError(typeof err === "string" ? err : err.message || "Unknown error");
    }
}

export { Handler };

// Usage example with Requestor:
// import { Requestor } from './api.js';
// import { Handler } from './handler.js';
// const handler = new Handler("result");
// const requestor = new Requestor("https://itunes.apple.com");
// async function fetchData() {
//     handler.clearResults();
//     const filterInput = document.getElementById("filterInput");
//     const filter = filterInput.value;
//     try {
//         const data = await requestor.searchMusic(filter, { limit: 20 });
//         handler.handleResponse(data);
//     } catch (err) {
//         handler.handleError(err);
//     }
// }