'use strict';

import request from 'request';
/**
 * Retrieves data from the webservice based on the parameters given
 *
 * @param {Object} params Parameters for the request
 * @param {string} service
 * @return {Promise}
 */
function sendRequest(uri, qs, logger = console) {
  return new Promise((resolve, reject) => {
    logger.log('suggest client request with params', qs);
    request.get({uri, qs}, (err, response, body) => {
      if (err) {
        logger.error('suggest client responded with an error', {err});
        reject(err);
      }
      else if (response.statusCode !== 200) {
        logger.error('uri responds with fail statusCode', {path: uri, statusCode: response.statusCode});
        reject(response);
      }
      else {
        const data = JSON.parse(body);
        data.params = qs;
        resolve(data);
        logger.info('suggest client responded with data', {path: uri, params: qs, data: data});
      }
    });
  });
}

/**
 * Method for requesting Subject entities
 * @param {Object} params Takes the following parameters query, rs, hl, hr
 */
function getSubjectSuggestions(config, params) {
  return sendRequest(`${config.uri}/subject`, params, config.logger);
}

/**
 * Method for requesting Subject entities
 * @param {Object} params Takes the following parameters query, rs, hl, hr
 */
function getCreatorSuggestions(config, params) {
  return sendRequest(`${config.uri}/creator`, params, config.logger);
}

/**
 * Method for requesting Subject entities
 * @param {Object} params Takes the following parameters query, rs, hl, hr
 */
function getLibrarySuggestions(config, params) {
  return sendRequest(`${config.uri}/library`, params, config.logger);
}

/**
 * Setting the necessary paramerters for the client to be usable.
 * The endpoint is only set if endpoint is null to allow setting it through
 * environment variables.
 *
 * @param {Object} config Config object with the necessary parameters to use
 * the webservice
 */
export function init(config) {
  if (!config) {
    throw new Error('no config object provided');
  }

  if (!config.endpoint) {
    throw new Error('no endpoint provided in config');
  }

  if (!config.port) {
    throw new Error('no port provided in config');
  }
  config.uri = `${config.endpoint}:${config.port}/${config.method}`;
  config.logger = config.logger || console;

  return {
    getSubjectSuggestions: getSubjectSuggestions.bind(null, config),
    getCreatorSuggestions: getCreatorSuggestions.bind(null, config),
    getLibrarySuggestions: getLibrarySuggestions.bind(null, config)
  };
}
