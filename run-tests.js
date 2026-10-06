import { runClassificationTests } from './frontend/src/tests/classificationTests.js';

const res = runClassificationTests();
console.log(JSON.stringify(res, null, 2));

if (res.failedCount > 0) {
  process.exit(1);
}
