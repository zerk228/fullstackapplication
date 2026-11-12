/**
 * Minimal, dependency-free test runner for the sentiment analyzer so that
 * `npm test` (used by the CI workflow) has something real to run without
 * needing a test framework installed.
 */
const assert = require('assert');
const { analyzeSentiment } = require('../sentiment');

function test(description, fn) {
  try {
    fn();
    console.log(`  PASS: ${description}`);
  } catch (err) {
    console.error(`  FAIL: ${description}`);
    console.error(err);
    process.exitCode = 1;
  }
}

console.log('sentiment.js');

test('classifies clearly positive text as positive', () => {
  assert.strictEqual(
    analyzeSentiment('Great service, friendly staff, I love it!'),
    'positive'
  );
});

test('classifies clearly negative text as negative', () => {
  assert.strictEqual(
    analyzeSentiment('Terrible, rude staff, a complete waste of time.'),
    'negative'
  );
});

test('classifies neutral/empty text as neutral', () => {
  assert.strictEqual(analyzeSentiment('The dealership is located downtown.'), 'neutral');
  assert.strictEqual(analyzeSentiment(''), 'neutral');
  assert.strictEqual(analyzeSentiment(undefined), 'neutral');
});

if (process.exitCode === 1) {
  console.error('One or more sentiment tests failed.');
} else {
  console.log('All sentiment tests passed.');
}
