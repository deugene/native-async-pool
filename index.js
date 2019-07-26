'use strict';

/**
 * Run async callback for each iterable's item with concurrency
 *
 * @param   {number}     concurrency
 * @param   {*}          iterable
 * @param   {function}   callback
 * @returns {Promise}
 */
async function asyncPool(concurrency, iterable, callback) {
  /**
   * Validate arguments
   */
  if (!Number.isInteger(concurrency)) {
    throw new TypeError('First argument must be an integer');
  } else if (concurrency < 1) {
    throw new Error('First argument must be greater than 0');
  } else if (!isIterable(iterable)) {
    throw new TypeError('Second argument must be an iterable');
  } else if (typeof callback !== 'function') {
    throw new TypeError('Third argument must be a function');
  }

  let results = [];

  if (concurrency === 1) {
    // Run promises one by one
    for (let item of iterable) {
      results.push(await callback(item, iterable));
    }

    return results;
  }

  // Implement a queue if concurrency is > 1
  let queue = new Set();

  for (let item of iterable) {
    let pending = Promise.resolve().then(() => callback(item, iterable));
    results.push(pending);
    let exec = pending.then(result => {
      pending.__result = result;
      queue.delete(exec);
    });
    queue.add(exec);

    if (queue.size >= concurrency) {
      // Wait until one of the promises in the queue is fulfilled
      await Promise.race(queue);
    }
  }

  // run rest of the pending promises
  if (queue.size) {
    await Promise.all(queue);
  }

  return results.map(({__result}) => __result);
}

/**
 * Check if value is iterable
 *
 * @param   {*}   value
 * @returns {boolean}
 */
function isIterable(value) {
  if (value === null || value === undefined) {
    return false;
  }

  return typeof value[Symbol.iterator] === 'function';
}

module.exports = asyncPool;
module.exports.default = asyncPool;
