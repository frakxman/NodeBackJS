const boom = require('@hapi/boom');
const joi = require('@hapi/joi');

function validate( data, schema ) {
    const { err } = joi.object( schema ).validate( data );
    return err;
}

function validationHandler( schema, check = "body" ) {
    return ( req, res, next ) => {
        const error = validate( req[check], schema );

        error ? next( boom.badRequest( error ) ) : next();
    }
}

module.exports = validationHandler;