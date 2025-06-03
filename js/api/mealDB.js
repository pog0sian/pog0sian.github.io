import { config } from '../config.js';

export async function getRandomMeal() {
    try {
        const response = await fetch(`${config.THEMEALDB_API_URL}random.php`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching random meal:', error);
        throw error;
    }
}

export async function getMealInfoById(id) {
    try {
        const response = await fetch(`${config.THEMEALDB_API_URL}lookup.php?i=${id}`);
        const data = await response.json();
        return data.meals[0];
    } catch (error) {
        console.error(`Error fetching meal info by ID ${id}:`, error);
        throw error;
    }
}

export async function getMealByCategory(category) {
    try {
        const response = await fetch(`${config.THEMEALDB_API_URL}filter.php?c=${category}`);
        const data = await response.json();
        const meal = data.meals[Math.floor(Math.random() * data.meals.length)];
        return getMealInfoById(meal.idMeal);
    } catch (error) {
        console.error(`Error fetching meals by category ${category}:`, error);
        throw error;
    }
}