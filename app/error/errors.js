'use strict';

/**
 * Return different function for constructing predefined client errors.
 * Each function takes a msg and provides a predefined status.
 */

function getTypes () {
    return {
        serviceUnavailable (msg) {
            return createError(503, msg || 'Service unavailable');
        },

        serverError (msg) {
            return createError(500, msg || 'Internal server error');
        },

        unauthorized (msg) {
            return createError(401, msg || 'Access unauthorized');
        },

        notFound (msg) {
            return createError(404, msg || 'Resource not found');
        },

        forbidden (msg) {
            return createError(403, msg || 'Unauthorized');
        },

        badRequest (msg) {
            return createError(400, msg || 'Bad request');
        },

        timeout (msg) {
            return createError(408, msg || 'Timeout Error');
        }
    };
}

/**
 * Function for construction a generic error. Should only be used if the error
 * does not fit any predefined types.
 */

//message, status
function createError (status, message) {
    return {
        message: message,
        status: status,
        safeError: true
    };
}

module.exports = {
  getTypes,
  createError
};
