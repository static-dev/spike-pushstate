const test = require('ava')
const path = require('path')
const fs = require('fs')
const Spike = require('spike-core')
const PushState = require('..')

const fixtures = path.join(__dirname, 'fixtures')

test.cb('compiles correctly', (t) => {
  const project = new Spike({
    root: path.join(fixtures, 'basic'),
    entry: { main: ['./main.js'] },
    plugins: [new PushState()]
  })

  project.on('error', t.end)
  project.on('warning', t.end)
  project.on('compile', () => {
    const build = fs.readFileSync(path.join(fixtures, 'basic/public/main.js'), 'utf8')
    t.truthy(build.match(/<p>wow<\/p>/))
    t.truthy(build.match(/exports\['index'\] =/))
    t.end()
  })

  project.compile()
})

test.cb('string passed to files option', (t) => {
  const project = new Spike({
    root: path.join(fixtures, 'string'),
    entry: { main: ['./main.js'] },
    plugins: [new PushState({ files: '**/foo.jade' })]
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

test.cb('array of globs passed to files option', (t) => {
  const project = new Spike({
    root: path.join(fixtures, 'array'),
    entry: { main: ['./main.js'] },
    plugins: [new PushState({ files: ['foo.jade', 'bar.jade'] })]
  })

  project.on('error', t.end)
  project.on('warning', t.end)
  project.on('compile', () => {
    const build = fs.readFileSync(path.join(fixtures, 'array/public/main.js'), 'utf8')
    t.truthy(build.match(/exports\['foo'\] =/))
    t.truthy(build.match(/<p>foo<\/p>/))
    t.truthy(build.match(/exports\['bar'\] =/))
    t.truthy(build.match(/<p>bar<\/p>/))
    t.falsy(build.match(/exports\['index'\] =/))
    t.falsy(build.match(/<p>index<\/p>/))
    t.end()
  })

  project.compile()
})
