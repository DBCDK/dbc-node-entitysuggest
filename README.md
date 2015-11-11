# dbc-node-entitysuggest

[![David](https://img.shields.io/david/DBCDK/dbc-node-entitysuggest.svg?style=flat-square)](https://david-dm.org/DBCDK/dbc-node-entitysuggest#info=dependencies)
[![David](https://img.shields.io/david/dev/DBCDK/dbc-node-entitysuggest.svg?style=flat-square)](https://david-dm.org/DBCDK/dbc-node-entitysuggest#info=devDependencies)

##Client for the DBC entity suggestion service

Implements the suggest method that based on query parameters gives suggestions
for continued search.

##How to use:
```javascript
import * as EntitySuggest from 'dbc-node-entitysuggest';


// Initialize service whit required paramters
const entitySuggest = EntitySuggest.init({
  method: 'entity-suggest',
  endpoint: 'http://xp-p02.dbc.dk',
  port: 8015
});

// make a query to e.g. subject index. This returns a promise.
entitySuggest.getSubjectSuggestions({query: 'display.title', rs: 5})
.then((result) => {
  console.log(result)
});
};
```

##Methods:

### entitySuggest.getSubjectSuggestions({query, rs, hl, hr, n})

* **query:** The prefix or word to get subject suggestions for
* **rs:** Right searches. Performs additinal right-truncated searches based on a left truncated search. The arguments decides how many of these searches are performed. Performance will go down, when number of searches are increased
* **hl:** Highlight-left. If highlight is wanted, both hl and hr must be set. In the returned results the prefix is highlighted with strings provided in hl and hr.
* **hr:** Highlight-right. If highlight is wanted, both hl and hr must be set. In the returned results the prefix is highlighted with strings provided in hl and hr.
* **n:** Maximum number of returned results. Default is 20

```javascript
entitySuggest.getSubjectSuggestions({query: 'dan', rs: 5, hl: '_', hr: '_'})
  .then((result) => {
    console.log(result)
  });

```


### entitySuggest.getCreatorSuggestions({query, rs, hl, hr, n})

* **query:** The prefix or word to get subject suggestions for
* **hl:** Highlight-left. If highlight is wanted, both hl and hr must be set. In the returned results the prefix is highlighted with strings provided in hl and hr.
* **hr:** Highlight-right. If highlight is wanted, both hl and hr must be set. In the returned results the prefix is highlighted with strings provided in hl and hr.
* **n:** Maximum number of returned results. Default is 20

```javascript
entitySuggest.getCreatorSuggestions({query: 'lennon', hl: '_', hr: '_'})
  .then((result) => {
    console.log(result)
  });
```

### entitySuggest.getLibrarySuggestions({query, lt, gl, n})

* **query:** The prefix or word to get library suggestions for
* **lt:** Library-type. If used, the result only contains of libraries of the given type..
* **gl:** Geolocation. If set, The suggested libraries are ranked according to their distance to this location.The format is json (example {"lat": 55.5932207, "lng": 11.8575913}).
* **n:** Maximum number of returned results. Default is 20

```javascript
entitySuggest.getLibrarySuggestions({query: 'val', gl: JSON.stringify({lat: 55.5932207, lng: 11.8575913})})
  .then((result) => {
    console.log(result)
  });
```
