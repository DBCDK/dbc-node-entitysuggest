'use strict';

import request from 'request';
import {curry} from 'lodash';
/**
 * Retrieves data from the webservice based on the parameters given
 *
 * @param {Object} params Parameters for the request
 * @param {string} service
 * @return {Promise}
 */
function sendRequest(logger, uri, qs) {
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
        resolve(data);
        logger.info('suggest client responded with data', {path: uri, params: qs, data: data});
      }
    });
  });
}

/**
 * Setting the necessary parameters for the client to be usable.
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
  const uri = `${config.endpoint}:${config.port}/${config.method}`;
  const logger = config.logger || console;

  return {
    getSubjectSuggestions: curry(sendRequest)(logger)(uri + '/subject'),
    getCreatorSuggestions: curry(sendRequest)(logger)(uri + '/creator'),
    getLibrarySuggestions: curry(sendRequest)(logger)(uri + '/library')
  };
};
