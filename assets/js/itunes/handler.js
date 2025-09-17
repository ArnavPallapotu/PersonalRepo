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
        for (const row of data.results) {
            const tr = document.createElement("tr");

            const artist = document.createElement("td");
            artist.innerHTML = row.artistName;

            const track = document.createElement("td");
            track.innerHTML = row.trackName;

            const image = document.createElement("td");
            const img = document.createElement("img");
            img.src = row.artworkUrl100;
            image.appendChild(img);

            const preview = document.createElement("td");
            const audio = document.createElement("audio");
            audio.controls = true;
            const source = document.createElement("source");
            source.src = row.previewUrl;
            source.type = "audio/mp4";
            audio.appendChild(source);
            preview.appendChild(audio);

            tr.appendChild(artist);
            tr.appendChild(track);
            tr.appendChild(image);
            tr.appendChild(preview);

            this.resultContainer.appendChild(tr);
        }
    }

    handleResponse(response) {
        if (response.status !== 200) {
            this.displayError('Database response error: ' + response.status);
            return;
        }
        response.json().then(data => {
            this.displayResults(data);
        });
    }

    handleError(err) {
        this.displayError(err);
    }
}

export { Handler };

// Usage example:
// const handler = new Handler("result");
// function fetchData() {
//     handler.clearResults();
//     const filterInput = document.getElementById("filterInput");
//     const filter = filterInput.value;
//     const url = "https://itunes.apple.com/search?term=" + encodeURIComponent(filter);
//     fetch(url)
//         .then(response => handler.handleResponse(response))
//         .catch(err => handler.handleError(err));
// }