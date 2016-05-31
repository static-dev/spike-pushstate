const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const SpikeUtil = require('spike-util')
const File = require('filewrap')

module.exports = class PushState {

  /**
   * @constructor
   * @param {Object} opts - options for configuration
   * @param {String} opts.root - project root
   * @param {Array} opts.dumpDirs - directories to dump to public
   */
  constructor (opts = {}) {
    this.files = opts.files || '**/*.jade'
  }

  apply (compiler) {
    if (!this.files) return
    const util = new SpikeUtil(compiler.options)
    const tempFile = path.join(util.conf.context, 'node_modules/spike-pushstate.js')

    compiler.plugin('make', (compilation, done) => {
      const jadeFiles = compiler.options.spike.files.jade

      // filter in files matching the user-defined matcher
      const matchingFiles = jadeFiles.filter((f) => {
        const file = new File(util.conf.context, f)
        return util.matchGlobs(file.relative, this.files).length
      })

      // now we are going to build the link injector script
      let mod = ''

      // first, we require in all the matching jade files so that we have the
      // contents ready to inject if needed
      matchingFiles.forEach((f) => {
        mod += `exports['${util.getOutputPath(f).relative.replace(/\.jade/, '')}'] = require('../${f.replace(`${util.conf.context}/`, '')}')\n`
      })

      // now we add the script that matches link clicks to templates
      mod += fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8')

      // then we write it all as a temporary file
      try {
        fs.accessSync(tempFile)
      } catch (err) {
        mkdirp.sync(path.dirname(tempFile))
      }

      fs.writeFileSync(tempFile, mod)

      // finally, we add that file as an entry to webpack so that it shows up
      util.addFilesAsWebpackEntries(compilation, [tempFile])
        .done(() => done(), done)
    })

    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('optimize-chunk-assets', (chunks, done) => {
        // once everything has been compiled, we remove the temp file
        fs.unlinkSync(tempFile)
        util.removeAssets(compilation, [tempFile])
        done()
      })
    })
  }

}
