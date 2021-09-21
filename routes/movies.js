const express = require('express');
const MoviesServices = require('../services/movies');

const  { movieIdSchema, createMovieSchema, updateMovieSchema } = require('../utils/schemas/movies');
const validationHandler = require('../utils/middleware/validationHandler');

const cacheResponse = require('../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../utils/time');

function moviesApi( app ) {
    const router = express.Router();
    app.use("/api/movies", router );

    const moviesService = new MoviesServices();

    // All movies directly
    // router.get("/", async ( req, res, next ) => {
    //     try {
    //         const movies = await Promise.resolve( moviesMock );
    //         res.status( 200 ).json({
    //             data: movies,
    //             msg: 'movies listed'
    //         })
    //     } catch ( err ) {
    //         next( err );
    //     }
    // });

    // One movie directly
    // router.get("/:id", async ( req, res, next ) => {
    //     try {
    //         const movie = await Promise.resolve( moviesMock[0] );
    //         res.status( 200 ).json({
    //             data: movie,
    //             msg: 'movie retrieved'
    //         })
    //     } catch ( err ) {
    //         next( err );
    //     }
    // });

    // Create movie directly
    // router.post("/", async ( req, res, next ) => {
    //     try {
    //         const createdMovie = await Promise.resolve( moviesMock[0].id );
    //         res.status( 201 ).json({
    //             data: createdMovie,
    //             msg: 'movie created'
    //         })
    //     } catch ( err ) {
    //         next( err );
    //     }
    // });

    // Update movie directly
    // router.put("/:id", async ( req, res, next ) => {
    //     try {
    //         const updatedMovie = await Promise.resolve( moviesMock[0].id );
    //         res.status( 200 ).json({
    //             data: updatedMovie,
    //             msg: 'movies updated'
    //         })
    //     } catch ( err ) {
    //         next( err );
    //     }
    // });

    // Delete movie directly
    // router.delete("/:id", async ( req, res, next ) => {
    //     try {
    //         const deletedMovie = await Promise.resolve( moviesMock[0].id );
    //         res.status( 200 ).json({
    //             data: deletedMovie,
    //             msg: 'movies created'
    //         })
    //     } catch ( err ) {
    //         next( err );
    //     }
    // });

    // All movies with Services
    router.get("/", async ( req, res, next ) => {
        cacheResponse( res, FIVE_MINUTES_IN_SECONDS );
        const { tags } = req.query;
        try {
            const movies = await moviesService.getMovies( { tags } );
            // throw new Error('Error getting movies');
            
            res.status( 200 ).json({
                data: movies,
                msg: 'movies listed'
            });
        } catch ( err ) {
            next( err );
        }
    });

    // One movie with Services
    router.get("/:id", validationHandler({ id: movieIdSchema}, 'params'), async ( req, res, next ) => {
        cacheResponse( res, SIXTY_MINUTES_IN_SECONDS );
        const { id } = req.params;
        try {
            const movie = await moviesService.getMovie( { id } );
            res.status( 200 ).json({
                data: movie,
                msg: 'movie retrieved'
            })
        } catch ( err ) {
            next( err );
        }
    });

    // Create movie with Services
    router.post("/", validationHandler( createMovieSchema ), async ( req, res, next ) => {
        const { body: movie  } = req;
        try {
            const createdMovie = await moviesService.createMovie( { movie } );
            res.status( 201 ).json({
                data: createdMovie,
                msg: 'movie created'
            })
        } catch ( err ) {
            next( err );
        }
    });

    // Update movie with Services
    router.put("/:id", validationHandler({ id: movieIdSchema}, 'params'), validationHandler( updateMovieSchema ), async ( req, res, next ) => {
        const { id } = req.params;
        const { body: movie  } = req;
        try {
            const updatedMovie = await moviesService.updateMovie( { id, movie });
            res.status( 200 ).json({
                data: updatedMovie,
                msg: 'movie updated'
            })
        } catch ( err ) {
            next( err );
        }
    });

    // Delete movie with Services
    router.delete("/:id", validationHandler({ id: movieIdSchema}, 'params'), async ( req, res, next ) => {
        const { id } = req.params;
        try {
            const deletedMovie = await moviesService.deleteMovie( { id } );
            res.status( 200 ).json({
                data: deletedMovie,
                msg: 'movie deleted'
            })
        } catch ( err ) {
            next( err );
        }
    });

}


module.exports = moviesApi;