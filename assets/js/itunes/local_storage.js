
class LocalStorageManager {
    constructor(storageKey = 'likedMedia') {
        this.storageKey = storageKey;
    }

    likeMedia(mediaItem) {
        const liked = this.getLikedMedia();
        liked.push(mediaItem);
        localStorage.setItem(this.storageKey, JSON.stringify(liked));
    }

    getLikedMedia() {
        const liked = localStorage.getItem(this.storageKey);
        return liked ? JSON.parse(liked) : [];
    }

    isMediaLiked(mediaId) {
        const liked = this.getLikedMedia();
        return liked.some(item => item.id === mediaId);
    }

    unlikeMedia(mediaId) {
        const liked = this.getLikedMedia();
        const updated = liked.filter(item => item.id !== mediaId);
        localStorage.setItem(this.storageKey, JSON.stringify(updated));
    }
}

export { LocalStorageManager };