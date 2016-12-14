/* global history, window */

if (window.history) {
  var links = document.querySelectorAll('a')

  window.onpopstate = function (e) {
    var matchedTpl = _getTemplate(e.target.location.pathname)
    if (matchedTpl) {
      document.write(matchedTpl)
      document.close()
    } else {
      window.location = e.target.location
    }
  }

  for (var i = 0; i < links.length; i++) {
    var el = links[i]
    el.onclick = function (e) {
      e.preventDefault()
      var parser = document.createElement('a')
      parser.href = e.target.pathname
      var matchedTpl = _getTemplate(e.target.pathname)
      if (matchedTpl) {
        document.write(matchedTpl)
        document.close()
        history.pushState({}, '', e.target)
      } else {
        window.location = e.target
      }
    }
  }
}

function _getTemplate (href) {
  var hrefPath = href
  if (href[href.length - 1] === '/') { hrefPath = href + 'index.html' }
  hrefPath = hrefPath.substring(1).replace(/.html$/, '')
  return exports[hrefPath]
}
