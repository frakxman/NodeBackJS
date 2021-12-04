const express = require('express');
const passport = require('passport');

// Service
const UserMoviesService = require('../services/userMovies');

// Middleware
const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

// Schemas
const { movieIdSchema } = require('../utils/schemas/movies');
const { userIdSchema } = require('../utils/schemas/user');
const { createUserMovieSchema } = require('../utils/schemas/userMovies');

// JWT Strategy
require('../utils/auth/strategies/jwt');

function userMoviesApi( app ) {
    const router = express.Router();
    app.use('/api/user-movies', router );

    const userMoviesService = new UserMoviesService();

    // Listed user movies
    router.get(
        '/', 
        passport.authenticate('jwt', { session: false} ),
        scopesValidationHandler(['read: user-movies']),
        validationHandler({ userId: userIdSchema }, 'query'), 
        async function ( req, res, next ) {
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
        }
    );

    // Create user movies
    router.post(
        '/',
        passport.authenticate('jwt', { session: false} ),
        scopesValidationHandler(['create: user-movies']),
        validationHandler( createUserMovieSchema ),
        async function ( req, res, next ) {
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
        }
    );

    // Delete user movies 
    router.delete(
        '/:userMovieId',
        passport.authenticate('jwt', { session: false} ),
        scopesValidationHandler(['delete: user-movies']),
        validationHandler({ userMovieId: movieIdSchema }, 'params'),
        async function( req, res, next ) {
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
        }
    );
};

module.exports = userMoviesApi;