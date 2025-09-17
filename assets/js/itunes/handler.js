class Handler {
    constructor(resultContainerId) {
        this.resultContainer = document.getElementById(resultContainerId);
    }

    clearResults() {
        this.resultContainer.innerHTML = "";
    }

    displayError(message) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 4;
        td.innerHTML = message;
        tr.appendChild(td);
        this.resultContainer.appendChild(tr);
    }

    displayResults(data) {
        if (!data.results || data.results.length === 0) {
            this.displayError("No results found.");
            return;
        }
        for (const row of data.results) {
            const tr = document.createElement("tr");

            const artist = document.createElement("td");
            artist.innerHTML = row.artistName || "";

            const track = document.createElement("td");
            track.innerHTML = row.trackName || "";

            const image = document.createElement("td");
            if (row.artworkUrl100) {
                const img = document.createElement("img");
                img.src = row.artworkUrl100;
                image.appendChild(img);
            }

            const preview = document.createElement("td");
            if (row.previewUrl) {
                const audio = document.createElement("audio");
                audio.controls = true;
                const source = document.createElement("source");
                source.src = row.previewUrl;
                source.type = "audio/mp4";
                audio.appendChild(source);
                preview.appendChild(audio);
            }

            tr.appendChild(artist);
            tr.appendChild(track);
            tr.appendChild(image);
            tr.appendChild(preview);

            this.resultContainer.appendChild(tr);
        }
    }

    handleResponse(data) {
        this.displayResults(data);
    }

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