import { config } from '../config.js';

const categoryGenreMap = {
    Dessert: 10749,       // Romance
    Seafood: 12,          // Adventure
    Beef: 28,             // Action
    Chicken: 10751,       // Family
    Vegetarian: 99,       // Documentary
    Pork: 80,             // Crime
    Lamb: 18,             // Drama
    Pasta: 35,            // Comedy
    Miscellaneous: 9648   // Mystery
};

export async function findMovieByMeal(meal) {
    const byMeal = await searchMovie(meal.strMeal);
    if (byMeal) return byMeal;

    const byArea = await searchMovie(meal.strArea);
    if (byArea) return byArea;

    const genreId = categoryGenreMap[meal.strCategory];
    if (genreId) {
        const byGenre = await searchMovieByGenre(genreId);
        if (byGenre) return byGenre;
    }

    return null;
}

async function searchMovie(query) {
    try {
        const res = await fetch(`${config.TMDB_API_URL}search/movie?api_key=${config.TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=ru-RU`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${config.TMDB_API_AUTH_KEY}`,
                accept: 'application/json',
            }
        });
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            return data.results[0];
        }
    } catch (err) {
        console.error('Error fetching movie by query:', err);
    }
    return null;
}

async function searchMovieByGenre(genreId) {
    try {
        const res = await fetch(`${config.TMDB_API_URL}discover/movie?api_key=${config.TMDB_API_KEY}&with_genres=${genreId}&language=ru-RU`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${config.TMDB_API_AUTH_KEY}`,
                accept: 'application/json',
            }
        });
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            return data.results[0];
        }
    } catch (err) {
        console.error('Error fetching movie by genre:', err);
    }
    return null;
}