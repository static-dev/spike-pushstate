const test = require('ava')
const path = require('path')
const fs = require('fs')
const Spike = require('spike-core')
const PushState = require('..')

const fixtures = path.join(__dirname, 'fixtures')

test.cb('compiles correctly', (t) => {
  const project = new Spike({
    root: path.join(fixtures, 'string'),
    entry: { main: ['./main.js'] },
    plugins: [new PushState('**/foo.jade')]
  })

  project.on('error', t.end)
  project.on('warning', t.end)
  project.on('compile', () => {
    const build = fs.readFileSync(path.join(fixtures, 'string/public/main.js'), 'utf8')
    t.truthy(build.match(/<p>bar<\/p>/))
    t.truthy(build.match(/exports\['foo'\] =/))
    t.falsy(build.match(/exports\['index'\] =/))
    t.falsy(build.match(/<p>index<\/p>/))
    t.end()
  })

  project.compile()
})
