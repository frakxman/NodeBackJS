const express = require('express');

// Service
const UserMoviesService = require('../services/userMovies');

// Middleware
const validationHandler = require('../utils/middleware/validationHandler');

// Schemas
const { movieIdSchema } = require('../utils/schemas/movies');
const { userIdSchema } = require('../utils/schemas/user');
const { createUserMovieSchema } = require('../utils/schemas/userMovies');

function userMoviesApi( app ) {
    const router = express.Router();
    app.use('/api/user-movies', router );

    const userMoviesService = new UserMoviesService();

    // Listed user movies
    router.get('/', validationHandler({ userId: userIdSchema }, 'query'), async function ( req, res, next ) {
        const { userId } = req.query;
        try {
            const userMovies = await userMoviesService.getUserMovies({ userId });
            res.status( 200 ).json({
                data: userMovies,
                msg: 'user movies listed'
            });
        } catch ( err ) {
            next( err );
        };
    });

    // Create user movies
    router.post('/', validationHandler( createUserMovieSchema ), async function ( req, res, next ) {
        const { body: userMovie } = req;
        try {
            const createdUserMovieId = await userMoviesService.createUserMovie({ userMovie });
            res.status( 201 ).json({
                data: createdUserMovieId,
                msg: 'movie created'
            });
        } catch ( err ) {
            next( err );
        };
    });

    // Delete user movies 
    router.delete('/:userMovieId', validationHandler({ userMovieId: movieIdSchema }, 'params'), async function( req, res, next ) {
        const { userMovieId } = req.params;
        try {
            const deleteUserMovieId = await userMoviesService.deleteUserMovie({ userMovieId });
            res.status( 200 ).json({
                data: deleteUserMovieId,
                msg: 'movie deleted'
            });
        } catch ( err ) {
            next( err );
        };
    });
};

module.exports = userMoviesApi;