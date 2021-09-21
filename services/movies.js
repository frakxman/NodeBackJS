// const { moviesMock } = require('../utils/mocks/movies');

// class MoviesServices { // Whit Mocks

//     // All movies with Mocks
//     async getMovies() {
//         const movies = await Promise.resolve( moviesMock );
//         return movies || [];
//     }

//     // One movie with Mocks
//     async getMovie() {
//         const movie = await Promise.resolve( moviesMock[0] );
//         return movie || {};
//     }

//     // Create movie with Mocks
//     async createMovie() {
//         const createMovie = await Promise.resolve( moviesMock[0].id );
//         return createMovie;
//     }

//     // Update movie with Mocks
//     async updateMovie() {
//         const updateMovie = await Promise.resolve( moviesMock[0].id );
//         return updateMovie;
//     }

//     // Delete movie with Mocks
//     async deleteMovie() {
//         const deleteMovie = await Promise.resolve( moviesMock[0].id );
//         return deleteMovie;
//     }
// }

const MongoLib = require('../lib/mongo');

class MoviesServices {

    constructor() {
        this.collection = 'movies';
        this.mongoDB = new MongoLib();
    }

    // All movies 
    async getMovies({ tags }) {
        const query = tags && { tags: { $in: tags }};
        const movies = await this.mongoDB.getAll( this.collection, query );
        return movies || [];
    }

    // One movie
    async getMovie({ id }) {
        const movie = await this.mongoDB.get( this.collection, id );
        return movie || {};
    }

    // Create movie
    async createMovie({ movie }) {
        const createMovie = await this.mongoDB.create( this.collection, movie );
        return createMovie;
    }

    // Update movie
    async updateMovie({ id, movie } = {}) {
        const updateMovie = await this.mongoDB.update( this.collection, id, movie );
        return updateMovie;
    }

    // Delete movie
    async deleteMovie({ id }) {
        const deleteMovie = await this.mongoDB.delete( this.collection, id );
        return deleteMovie;
    }
}


module.exports = MoviesServices;