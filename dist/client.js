'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _lodash = require('lodash');

/**
 * Retrieves data from the webservice based on the parameters given
 *
 * @param {Object} params Parameters for the request
 * @param {string} service
 * @return {Promise}
 */
function sendRequest(logger, uri, qs) {
  return new Promise(function (resolve, reject) {
    logger.log('suggest client request with params', qs);
    _request2['default'].get({ uri: uri, qs: qs }, function (err, response, body) {
      if (err) {
        logger.error('suggest client responded with an error', { err: err });
        reject(err);
      } else if (response.statusCode !== 200) {
        logger.error('uri responds with fail statusCode', { path: uri, statusCode: response.statusCode });
        reject(response);
      } else {
        var data = JSON.parse(body);
        resolve(data);
        logger.info('suggest client responded with data', { path: uri, params: qs, data: data });
      }
    });
  });
}

/**
 * Initializes client and return api functions
 *
 * @param {Object} config Requires endpoint and port
 * @returns {{getSubjectSuggestions, getCreatorSuggestions, getLibrarySuggestions}}
 */

function init(config) {
  if (!config) {
    throw new Error('no config object provided');
  }

  if (!config.endpoint) {
    throw new Error('no endpoint provided in config');
  }

  if (!config.method) {
    throw new Error('no method provided in config');
  }

  if (!config.port) {
    throw new Error('no port provided in config');
  }
  var uri = config.endpoint + ':' + config.port + '/' + config.method;
  var logger = config.logger || console;

  return {
    getSubjectSuggestions: (0, _lodash.curry)(sendRequest)(logger)(uri + '/subject'),
    getCreatorSuggestions: (0, _lodash.curry)(sendRequest)(logger)(uri + '/creator'),
    getLibrarySuggestions: (0, _lodash.curry)(sendRequest)(logger)(uri + '/library')
  };
}