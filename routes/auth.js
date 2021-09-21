const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');

// Service
const ApiKeysService = require('../services/apiKeys');

// Config
const { config } = require('../config');

// Basic Strategy
require('../utils/auth/strategies/basic');

function authApi( app ) {
    const router = express.Router();
    app.use('/api/auth', router );

    const apiKeysService = new ApiKeysService();

    router.post('/sign-in', async ( req, res, next ) => {
        const { apiKeyToken } = req.body;

        if ( !apiKeyToken ) {
            next( boom.unauthorized('apiKeyToken is required'));
        };

        passport.authenticate('basic', ( err, user ) => {
            try {
                if ( err || !user ) {
                    next( boom.unauthorized());
                };
                req.login( user, { sesion: false }, async ( err ) => {
                    if ( err ) {
                        next( err );
                    };
                    const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });
                    if ( !apiKey ) {
                        next( boom.unauthorized());
                    };

                    const { _id: id, name, email } = user;

                    const payload = {
                        sub: id,
                        name,
                        email,
                        scopes: apiKey.scopes
                    };

                    const token = jwt.sign( payload, config.authJtwSecret, {
                        expiresIn: '15m'
                    });

                    return res.status( 200 ).json({ token, user: { id, name, email }})
                });
            } catch ( err ) {
                next( err );
            };
        })( req, res, next );
    });
};

module.exports = authApi;