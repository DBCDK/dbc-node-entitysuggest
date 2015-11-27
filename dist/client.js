'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = EntitySuggestClient;

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
function sendRequest(defaults, method, query) {
  var url = defaults.url;
  var logger = defaults.logger;
  var lt = defaults.lt;

  return new Promise(function (resolve, reject) {
    var uri = url + '/' + method;
    var qs = (0, _lodash.extend)({ lt: lt }, query);
    logger.log('entity-suggest client request with params', qs);
    _request2['default'].get({ uri: uri, qs: qs }, function (err, response, body) {
      if (err) {
        logger.error('suggest client responded with an error', { err: err });
        reject(err);
      } else if (response.statusCode !== 200) {
        logger.error('uri responds with fail statusCode', { path: uri, statusCode: response.statusCode });
        reject(response);
      } else {
        var data = JSON.parse(body);
        var params = {
          service: 'entity-suggest',
          method: method,
          qs: qs,
          url: url
        };
        var responseData = (0, _lodash.extend)(data, { params: params });
        resolve(responseData);
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

function EntitySuggestClient(config) {
  if (!config) {
    throw new Error('no config object provided');
  }

  if (!config.endpoint) {
    throw new Error('no endpoint provided in config');
  }

  if (!config.port) {
    throw new Error('no port provided in config');
  }

  var defaults = {
    lt: config.libraryType || 'folkebibliotek',
    url: config.endpoint + ':' + config.port + '/entity-suggest',
    logger: config.logger || console
  };

  return {
    getSubjectSuggestions: (0, _lodash.curry)(sendRequest)(defaults)('subject'),
    getCreatorSuggestions: (0, _lodash.curry)(sendRequest)(defaults)('creator'),
    getLibrarySuggestions: (0, _lodash.curry)(sendRequest)(defaults)('library')
  };
}

module.exports = exports['default'];