const express = require('express');
const app = express();

// Config 
const { config } =  require('./config/index');

// Routes import
const authApi = require('./routes/auth');
const moviesApi = require('./routes/movies');
const userMoviesApi = require('./routes/userMovies');

// Middlewares
const { logErrors, errorHandler, wrapErrors } = require('./utils/middleware/errorHandler');
const notFoundHandler = require('./utils/middleware/notFoundHandler');

// Body parser
app.use( express.json() );

// Routes
authApi( app );
moviesApi( app );
userMoviesApi( app );

// Catch error 404
app.use( notFoundHandler );

// Errors middleware
app.use( logErrors );
app.use( wrapErrors );
app.use( errorHandler );


app.listen( config.port, () => {
    console.log(`Listening http://localhost:${ config.port }`);
});