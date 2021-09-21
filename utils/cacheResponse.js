const { config } = require('../config');

function cacheResponse( res, seconds ) {
    if ( !config.dev ) {
        res.set('Cache-Control', `public-maxage=${ seconds }`);
    }
}

module.exports = cacheResponse;