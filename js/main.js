import { getMealByCategory } from "./api/mealDB.js";
import { findMovieByMeal } from './api/tmdb.js';
import { getMovieTrailer } from "./api/youtube.js";
import { translateText } from "./api/translate.js";


window.addEventListener('DOMContentLoaded', () => {
    // Greeting → Offer
    const greetingBlock = document.querySelector('.greeting-block');
    const greetingBtn = document.querySelector('.greeting-btn');
    const eveningOfferText = document.querySelector('.evening-offer-text');
    const eveningOfferBtn = document.querySelector('.evening-offer-btn');
    const eveningOfferBlock = document.querySelector('.evening-offer-block');
    const categoryBlock = document.querySelector('.category-block');
    const movieMealBlock = document.querySelector('.movie-meal-block');
    const restartBtn = document.querySelector('.movie-meal-restart-btn');

    if (greetingBtn) {
        greetingBtn.addEventListener('click', function() {
            greetingBlock.classList.add('slide-to-top');
        });
    }
    if (greetingBlock) {
        greetingBlock.addEventListener('animationend', function(e) {
            if (e.animationName === 'slideToTop') {
                greetingBlock.remove();
                eveningOfferText.classList.remove('hidden');
                eveningOfferBtn.classList.remove('hidden');
                eveningOfferText.classList.add('slide-up');
                eveningOfferBtn.classList.add('slide-up');
            }
        });
    }
    // Offer → Category
    if (eveningOfferBtn) {
        eveningOfferBtn.addEventListener('click', function() {
            eveningOfferBlock.classList.add('slide-to-top');
        });
    }
    if (eveningOfferBlock) {
        eveningOfferBlock.addEventListener('animationend', function(e) {
            if (e.animationName === 'slideToTop') {
                eveningOfferBlock.remove();
                categoryBlock.classList.remove('hidden');
                categoryBlock.classList.add('slide-up');
                restartMarqueeAnimation();
            }
        });
    }

    // Category → Result
    let selectedCategory = null;
    if (categoryBlock) {
        categoryBlock.addEventListener('animationend', async function(e) {
            if (e.animationName === 'slideToTop') {
                categoryBlock.style.display = 'none';
                movieMealBlock.classList.remove('hidden');
                movieMealBlock.classList.add('slide-up');
                if (selectedCategory) {
                    const data = await getMealAndMovieTrailer(selectedCategory);
                    renderMealAndMovie(data);
                }
            }
        });
    }

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedCategory = btn.dataset.category;
            categoryBlock.classList.remove('slide-to-top');
            categoryBlock.style.display = 'block';
            void categoryBlock.offsetWidth; 
            categoryBlock.classList.add('slide-to-top');
        });
    });

    restartBtn.addEventListener('click', async function() {
        document.querySelector('.meal-block').classList.add('hidden');
        document.querySelector('.movie-block').classList.add('hidden');

        if (selectedCategory) {
            const data = await getMealAndMovieTrailer(selectedCategory);
            renderMealAndMovie(data);
        }
    });

    const input = document.getElementById('name-input');
    const greeting = document.querySelector('.greeting-text');
    const headerTitle = document.querySelector('.hello-text');
    if (input && greeting && headerTitle) {
        input.addEventListener('input', (e) => {
            const name = e.target.value || '{name}';
            greeting.textContent = `Привет, ${name}!`;
            headerTitle.textContent = `${name !== '{name}' ? ` — Привет, ${name}` : ''}`;
        });
    }
});

async function getMealAndMovieTrailer(category) {
    const meal = await getMealByCategory(category);
    const movie = await findMovieByMeal(meal);
    const trailerUrl = await getMovieTrailer(movie.title);
    return { meal, movie, trailerUrl };
}

async function renderMealAndMovie({ meal, movie, trailerUrl }) {
    const mealBlock = document.querySelector('.meal-block');
    const mealName = mealBlock.querySelector('.meal-name');
    
    try {
        
        const translatedName = await translateText(meal.strMeal);
        mealName.textContent = translatedName;
        
        let recipeHtml = `<img src="${meal.strMealThumb}" alt="${translatedName}" style="max-width:200px;display:block;margin-bottom:10px;">`;
        
        
        const translatedInstructions = await translateText(meal.strInstructions);
        recipeHtml += `<p><b>Рецепт:</b> ${translatedInstructions}</p>`;
        
        mealName.insertAdjacentHTML('beforeend', recipeHtml);
    } catch (error) {
        console.error('Translation error:', error);
        mealName.textContent = meal.strMeal;
        let recipeHtml = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="max-width:200px;display:block;margin-bottom:10px;">`;
        recipeHtml += `<p><b>Рецепт:</b> ${meal.strInstructions}</p>`;
        mealName.insertAdjacentHTML('beforeend', recipeHtml);
    }
    
    mealBlock.classList.remove('hidden');

    const movieBlock = document.querySelector('.movie-block');
    const movieName = movieBlock.querySelector('.movie-name');
    movieName.textContent = movie ? movie.title : 'Фильм не найден';
    const iframe = movieBlock.querySelector('iframe');
    if (trailerUrl) {
        const url = new URL(trailerUrl);
        const videoId = url.searchParams.get('v');
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.width = 400;
        iframe.height = 225;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.classList.remove('hidden');
    } else {
        iframe.src = '';
        iframe.classList.add('hidden');
    }
    movieBlock.classList.remove('hidden');
}

function restartMarqueeAnimation() {
    const track = document.querySelector('.categories-track');
    if (track) {
        track.style.animation = 'none';
        void track.offsetWidth;
        track.style.animation = '';
    }
}
