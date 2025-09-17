
class LocalStorageManager {
    /**
     * Initializes a new instance of LocalStorageManager
     * @param {string} [storageKey='likedMedia'] - the key where local storage prefs are stored
     */
    constructor(storageKey = 'likedMedia') {
        this.storageKey = storageKey;
    }

    /**
     * Likes a media item and appends it to local storage
     * @param {string} mediaItem - the item to be appended
     */
    likeMedia(mediaItem) {
        const liked = this.getLikedMedia();
        liked.push(mediaItem);
        localStorage.setItem(this.storageKey, JSON.stringify(liked));
    }

    /**
     * Fetches liked media from local storage
     * @returns liked media if it exists, a null array otherwise
     */
    getLikedMedia() {
        const liked = localStorage.getItem(this.storageKey);
        return liked ? JSON.parse(liked) : [];
    }

    /**
     * Checks if some media item is liked
     * @param {number} mediaId - the ID of the media in local storage
     * @returns true if the media item is in local storage, false otherwise
     */
    isMediaLiked(mediaId) {
        const liked = this.getLikedMedia();
        return liked.some(item => item.id === mediaId);
    }

    /**
     * Removes some media item from local storage
     * @param {number} mediaId - the ID of the media in local storage
     */
    unlikeMedia(mediaId) {
        const liked = this.getLikedMedia();
        const updated = liked.filter(item => item.id !== mediaId);
        localStorage.setItem(this.storageKey, JSON.stringify(updated));
    }
}

export { LocalStorageManager };