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
    throw new Error('First argument should be an integer');
  } else if (concurrency < 1) {
    throw new Error('First argument should be greater than 0');
  } else if (!isIterable(iterable)) {
    throw new Error('Second argument should be an iterable');
  } else if (typeof callback !== 'function') {
    throw new Error('Third argument should be a function');
  }

  let results = [];
  let queue = new Set();

  for (const item of iterable) {
    if (concurrency === 1) {
      // Run promises one by one
      results.push(await callback(item, iterable));
    } else {
      // Implement a queue
      const exec = Promise.resolve()
        .then(() => callback(item, iterable))
        .then(result => {
          results.push(result);
          queue.delete(exec);
        });

      queue.add(exec);

      if (queue.size >= concurrency) {
        // Wait until one of the promises in the queue is fulfilled
        await Promise.race(queue);
      }
    }
  }

  // Run unexecuted promises
  if (queue.size) {
    await Promise.all(queue);
  }

  return results;
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
