import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const key = "ec4616f31cc5cdd4d7cbc80ba4fdb1e8";
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.results = res.data.recipes;
        } catch (error) {
            console.log(error);
        }
    }
}