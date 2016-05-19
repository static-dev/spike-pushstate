const example = require('../lib/example')
const test = require('ava')

test('example exports correctly', (t) => {
  t.is(example, 'wow es6!')
})
