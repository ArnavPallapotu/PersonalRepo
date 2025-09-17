class Requestor {
    constructor(api_url) {
        this.api_url = api_url;
    }

    buildQueryString(params) {
        const queryParams = new URLSearchParams();

        for (const [key, value] of Object.entries(params)) {
            if (value !== null && value !== undefined && value !== '') {
                queryParams.append(key, value);
            }
        }

        return queryParams.toString();
    }

    async search(filters = {}) {
        const defaultFilters = {
            term: '',
            country: 'US',
            media: 'all',
            entity: '',
            attribute: '',
            callback: '',
            limit: 50,
            lang: 'en_us',
            version: 2,
            explicit: 'Yes'
        };

        const searchParams = { ...defaultFilters, ...filters };

        const queryString = this.buildQueryString(searchParams);
        const endpoint = `/search?${queryString}`;

        return this.request(endpoint);
    }

    async lookup(ids, entity = '') {
        const params = {
            id: Array.isArray(ids) ? ids.join(',') : ids,
            entity: entity
        };

        const queryString = this.buildQueryString(params);
        const endpoint = `/lookup?${queryString}`;

        return this.request(endpoint);
    }

    async request(endpoint, options = {}) {
        try {
            const url = `${this.api_url}${endpoint}`;
            const defaultOptions = {
                method: 'GET',
                mode: 'cors',
                cache: 'default',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const fetchOptions = { ...defaultOptions, ...options };

            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);
            return result;
        } catch (error) {
            console.error('API Error:', error.message);
            throw error;
        }
    }

    // Helper methods for common search types
    async searchMusic(term, filters = {}) {
        return this.search({
            term: term,
            media: 'music',
            ...filters
        });
    }

    async searchMovies(term, filters = {}) {
        return this.search({
            term: term,
            media: 'movie',
            ...filters
        });
    }

    async searchPodcasts(term, filters = {}) {
        return this.search({
            term: term,
            media: 'podcast',
            ...filters
        });
    }

    async searchApps(term, filters = {}) {
        return this.search({
            term: term,
            media: 'software',
            entity: 'software',
            ...filters
        });
    }

    // Method to get available filter options
    getAvailableFilters() {
        return {
            media: ['movie', 'podcast', 'music', 'musicVideo', 'audiobook', 'shortFilm', 'tvShow', 'software', 'ebook', 'all'],
            entity: {
                movie: ['movieArtist', 'movie'],
                podcast: ['podcastAuthor', 'podcast'],
                music: ['musicArtist', 'musicTrack', 'album', 'musicVideo', 'mix', 'song'],
                musicVideo: ['musicArtist', 'musicVideo'],
                software: ['software', 'iPadSoftware', 'macSoftware'],
                ebook: ['ebook'],
                audiobook: ['audiobookAuthor', 'audiobook']
            },
            attribute: {
                movie: ['actorTerm', 'genreIndex', 'artistTerm', 'shortFilmTerm', 'producerTerm', 'ratingTerm', 'directorTerm', 'releaseYearTerm', 'featureFilmTerm', 'movieArtistTerm', 'movieTerm', 'ratingIndex', 'descriptionTerm'],
                podcast: ['titleTerm', 'languageTerm', 'authorTerm', 'genreIndex', 'artistTerm', 'ratingIndex', 'keywordsTerm', 'descriptionTerm'],
                music: ['mixTerm', 'genreIndex', 'artistTerm', 'composerTerm', 'albumTerm', 'ratingIndex', 'songTerm'],
                musicVideo: ['genreIndex', 'artistTerm', 'albumTerm', 'ratingIndex', 'songTerm'],
                software: ['softwareDeveloper'],
                ebook: ['titleTerm', 'authorTerm', 'genreIndex', 'ratingIndex'],
                audiobook: ['titleTerm', 'authorTerm', 'genreIndex', 'ratingIndex']
            },
            countries: ['US', 'CA', 'GB', 'AU', 'FR', 'DE', 'JP', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK', 'FI', 'BR', 'MX']
        };
    }
}

export { Requestor };