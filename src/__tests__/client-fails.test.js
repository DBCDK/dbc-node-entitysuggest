'use strict';
/* eslint-disable */

import * as PopSuggest from '../client.js';
import {assert, expect} from 'chai';
import sinon from 'sinon';
import request from 'request'

describe('Test Failing scenarius in client.js', () => {
  afterEach(function (done) {
    request.get.restore();
    done();
  });

  it('Test getSubjectSuggestions Method on bad URL', (done) => {
    sinon
      .stub(request, 'get')
      .yields(null, {
        statusCode: 404,
      }, '<html></html>'
    );

    const suggest = PopSuggest.init({
      method: 'fail',
      endpoint: 'http://xp-p02.dbc.dk',
      port: 8017
    });

    const Promise = suggest.getSubjectSuggestions({query: 'display.title', rs: 5});

    return Promise.then((data) => {
      done(new Error('This promise should fail'));
    }).catch((err) => {
      assert.isObject(err, 'got error object');

      assert.isDefined(err.statusCode, 'statusCode is defined');
      assert.notEqual(err.statusCode, 200, 'statusCode is not 200');
      done();
    });
  });

  it('Test getSubjectSuggestions Method with failing promise', (done) => {
    sinon
      .stub(request, 'get').yields({err: 'failure'});

    const suggest = PopSuggest.init({
      method: 'fail',
      endpoint: 'http://xp-p02.dbc.dk',
      port: 8017
    });

    const Promise = suggest.getSubjectSuggestions({query: 'display.title', rs: 5});

    return Promise.then((data) => {
      done(new Error('This promise should fail'));
    }).catch((err) => {
      assert.isObject(err, 'got error object');
      done();
    });
  });
});
