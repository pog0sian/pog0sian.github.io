import { config } from "../config.js";

export async function getMovieTrailer(movieTitle) {
    const query = `${movieTitle} official trailer`;
    const encodedQuery = encodeURIComponent(query);
    const url = `${config.YOUTUBE_API_URL}?part=snippet&maxResults=1&q=${encodedQuery}&key=${config.YOUTUBE_API_KEY}&type=video`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const videoId = data.items[0].id.videoId;
            return `https://www.youtube.com/watch?v=${videoId}`;
        }
        return null;
    } catch (error) {
        console.error("Error fetching YouTube trailer:", error);
        return null;
    }
}