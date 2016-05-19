const test = require('ava')
const path = require('path')
const Spike = require('spike-core')
const PushState = require('..')

const fixtures = path.join(__dirname, 'fixtures')

test.cb('basic', (t) => {
  const project = new Spike({
    root: path.join(fixtures, 'basic'),
    entry: { main: ['./main.js'] },
    plugins: [new PushState()]
  })

  project.on('error', t.end)
  project.on('warning', t.end)
  project.on('compile', () => {
    console.log('compiled!')
    t.end()
  })

  project.compile()
})
