'use strict';
/* eslint-disable */

import * as PopSuggest from '../client.js';
import {assert, expect} from 'chai';
import sinon from 'sinon';
import request from 'request'


describe('Test methods in client.js', () => {
  before(function (done) {
    sinon
      .stub(request, 'get')
      .yields(null, {
        statusCode: 200,
      }, JSON.stringify({
        response: true
      }));
    done();
  });

  after(function (done) {
    request.get.restore();
    done();
  });

  it('Test init method', () => {
    expect(PopSuggest.init).is.not.null;

    const init = PopSuggest.init;
    assert.isFunction(init, 'init is a function');

    expect(init).to.throw('no config object provided');

    let config = {};
    expect(() => init(config)).to.throw('no endpoint provided in config');

    config = {endpoint: 'test'};
    expect(() => init(config)).to.throw('no port provided in config');

    config = {endpoint: 'test', port: 1234};
    expect(() => init(config)).to.not.throw(Error);

    const methods = init(config);
    assert.property(methods, 'getSubjectSuggestions');
    assert.property(methods, 'getCreatorSuggestions');
    assert.property(methods, 'getLibrarySuggestions');
  });

  it('Test getSubjectSuggestions Methods', (done) => {
    let suggest = PopSuggest.init({
      method: 'entity-suggest',
      endpoint: 'http://xp-p02.dbc.dk',
      port: 8015
    });

    const Promise = suggest.getSubjectSuggestions({query: 'display.title', rs: 5});
    return Promise.then((data) => {
      assert(request.get.firstCall.calledWith({
        uri: 'http://xp-p02.dbc.dk:8015/entity-suggest/subject',
        qs: {query: 'display.title', rs: 5}
      }));
      assert(request.get.calledOnce);
      assert.isObject(data, 'got object');
      assert.property(data, 'response');
      done();
    }).catch((err) => {
        done(err);
      }
    );
  });

  it('Test getCreatorSuggestions Methods', (done) => {
    let suggest = PopSuggest.init({
      method: 'entity-suggest',
      endpoint: 'http://xp-p02.dbc.dk',
      port: 8015
    });

    const Promise = suggest.getCreatorSuggestions({query: 'display.title', rs: 5});
    return Promise.then((data) => {
      assert(request.get.calledWith({
        uri: 'http://xp-p02.dbc.dk:8015/entity-suggest/creator',
        qs: {query: 'display.title', rs: 5}
      }));
      assert.isObject(data, 'got object');
      assert.property(data, 'response');
      done();
    }).catch((err) => {
        done(err);
      }
    );
  });

  it('Test getLibrarySuggestions Methods', (done) => {
    let suggest = PopSuggest.init({
      method: 'entity-suggest',
      endpoint: 'http://xp-p02.dbc.dk',
      port: 8015
    });

    const Promise = suggest.getLibrarySuggestions({query: 'display.title', rs: 5});
    return Promise.then((data) => {
      assert(request.get.calledWith({
        uri: 'http://xp-p02.dbc.dk:8015/entity-suggest/library',
        qs: {query: 'display.title', rs: 5}
      }));
      assert.isObject(data, 'got object');
      assert.isObject(data, 'got object');
      assert.property(data, 'response');
      done();
    }).catch((err) => {
        done(err);
      }
    );
  });
});
