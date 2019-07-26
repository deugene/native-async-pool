'use strict';

const assert = require('assert');
const asyncPool = require('../index');

const asyncCallbackOk = ms => new Promise(resolve => setTimeout(() => resolve(ms), ms));
const asyncCallbackBad = () => Promise.reject(new Error('test error'));

const iterable = [100, 300, 50, 20];

(async() => {
  // Test assertions
  await assert.rejects(
    async () => asyncPool('', iterable, asyncCallbackOk),
    {message: 'First argument must be an integer'}
  );
  await assert.rejects(
    async () => asyncPool(0, iterable, asyncCallbackOk),
    {message: 'First argument must be greater than 0'}
  );
  await assert.rejects(
    async () => asyncPool(1, {}, asyncCallbackOk),
    {message: 'Second argument must be an iterable'}
  );
  await assert.rejects(
    async () => asyncPool(1, iterable, {}),
    {message: 'Third argument must be a function'}
  );

  // Test callback error
  await assert.rejects(
    async () => asyncPool(1, iterable, asyncCallbackBad),
    {message: 'test error'}
  );

  // Should return the right result
  await assert.deepStrictEqual(
    await asyncPool(1, iterable, asyncCallbackOk),
    iterable
  );
  await assert.deepStrictEqual(
    await asyncPool(3, iterable, asyncCallbackOk),
    iterable
  );
  await assert.deepStrictEqual(
    await asyncPool(10, iterable, asyncCallbackOk),
    iterable
  );
})();
