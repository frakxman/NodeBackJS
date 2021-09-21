const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');

const UsersService = require('../../services/users');
const { config } = require('../../config');

passport.use(
    new Strategy({
        secretOrKey: config.authJtwSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async ( tokenPayload, cb ) => {
        const userService = new UsersService();
        try {
            const user = await userService.getUser({ email: tokenPayload.email });
            if ( !user ) {
                return cb( boom.unauthorized(), false );
            }

            delete user.password;

            cb( null, { ...user, scopes: tokenPayload.scopes });
        } catch ( err ) {
            return cb( err );
        }
    })
);
