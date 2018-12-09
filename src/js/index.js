import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';

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
        try {
            // search for recipes
            await state.search.getResults();
        
            // render UI with results
            clearLoader();
            searchView.renderResults(state.search.results);
        } catch (error) {
            alert('Something wrong with the search...');
            clearLoader();
        }
    }
};

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
});

// Recipe Controller

const controlRecipe = async () => {
    //  Get ID From URL
    const id = window.location.hash.replace('#', '');

    if ( id ) {

        // prepare UI
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // create recipe object
        state.recipe = new Recipe(id);

        try {
            // get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // render Recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            alert('Error processing recipe!');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// List Controller
const controlList = () => {
    // Create new list IF there is not yet
    if (!state.list) state.list = new List();

    // Add each ingredients to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle delete
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from state
        listView.deleteItem(id);

        // Handle Count Update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
})

// Handling recipe buttons
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            // Decrease button is clicked
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
        controlList();
    }
});