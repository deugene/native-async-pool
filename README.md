# nativeAsyncPool

## Description

Tiny library that uses only native async functions to run promises with concurrency (limited amount of promises simultaneously).

## Features

- zero-dependency
- super fast
- vanilla js

## Compatibility

Supports v8 version >= 5.5.372.40 (node.js >= 7.6.0, chrome >= 56).

## Installation

```bash
npm install --save native-async-pool
```

## Usage

```js
let asyncPool = require('native-async-pool');
// or import asyncPool from 'native-async-pool'

// the number of promises to process simultaneously (integer > 0)
let concurrency = 3;
// any iterable object (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)
let iterable = [1000, 200, 500, 300];
// async callback (function)
let asyncCallback = ms => new Promise(resolve => setTimeout(() => resolve(ms), ms));

(async() => {
  console.log(await asyncPool(concurrency, iterable, asyncCallback));
  // [500, 200, 1000, 300]
})();
```

## License

MIT © [Yevhen Samoilenko](https://github.com/deugene)
