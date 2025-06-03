import {getMealByCategory} from "./api/mealDB.js";
import {findMovieByMeal} from "./api/tmdb.js";
import {getMovieTrailer} from "./api/youtube.js";

async function getMealAndMovieTrailer(category) {
    const meal = await getMealByCategory(category);
    const movie = await findMovieByMeal(meal);
    const trailer = await getMovieTrailer(movie.title);
    return {
        meal,
        movie,
        trailer
    };
}

console.log(await getMealAndMovieTrailer('Chicken'));