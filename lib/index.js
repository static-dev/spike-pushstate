const mm = require('micromatch')
const path = require('path')
const fs = require('fs')
const SpikeUtil = require('spike-util')

module.exports = class PushState {

  /**
   * @constructor
   * @param {Object} opts - options for configuration
   * @param {String} opts.root - project root
   * @param {Array} opts.dumpDirs - directories to dump to public
   */
  constructor (opts) {
    this.files = opts
    if (this.files === true) this.files = '**/*.jade'
  }

  apply (compiler) {
    if (!this.files) return
    const util = SpikeUtil(compiler.options)
    const tempFile = path.join(util.conf.context, 'node_modules/iso.js')

    compiler.plugin('make', (compilation, done) => {
      const jadeFiles = compiler.options.spike.files.jade

      // filter in files matching the user-defined matcher
      const matchingFiles = jadeFiles.filter((f) => {
        return mm.isMatch(f.replace(`${util.conf.context}/`, ''), this.files)
      })

      // now we are going to build the link injector script
      let mod = ''

      // first, we require in all the matching jade files so that we have the
      // contents ready to inject if needed
      matchingFiles.forEach((f) => {
        mod += `exports['${util.getOutputPath(f).replace(/\.jade/, '')}'] = require('../${f.replace(`${util.conf.context}/`, '')}')\n`
      })

      // now we add the script that matches link clicks to templates
      mod += fs.readFileSync('./script', 'utf8')

      // then we write it all as a temporary file
      fs.writeFileSync(tempFile, mod)

      // finally, we add that file as an entry to webpack so that it shows up
      util.addFilesAsWebpackEntries(compilation, [tempFile])
      done()
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
