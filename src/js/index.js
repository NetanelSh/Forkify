import Search from './models/Search';
import Recipe from './models/Recipe';

import * as searchView from './views/searchView';

import { elements, renderLoader, clearLoader } from './views/base';

// Global State of the app
// Search
// Recipe
// Shopping List
// Liked

const state = {};


// Search Controller
const controlSearch = async () => {
    // Get query from view
    const query = searchView.getInput();

    if (query) {
        // New search object and add to state
        state.search = new Search(query);

        // Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // search for recipes
        await state.search.getResults();
    
        // render UI with results
        clearLoader();
        searchView.renderResults(state.search.results);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if ( btn ) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
    }
})

// Recipe Controller

const controlRecipe = async () => {
    //  Get ID From URL
    const id = window.location.hash.replace('#', '');

    if ( id ) {

        // prepare UI

        // create recipe object
        state.recipe = new Recipe(id);

        // get recipe data
        await state.recipe.getRecipe();

        // calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        // render Recipe
        console.log(state.recipe);
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));