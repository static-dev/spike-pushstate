# Spike PushState

[![npm](http://img.shields.io/npm/v/spike-pushstate.svg?style=flat)](https://badge.fury.io/js/spike-pushstate) [![tests](http://img.shields.io/travis/static-dev/spike-pushstate/master.svg?style=flat)](https://travis-ci.org/static-dev/spike-pushstate) [![dependencies](http://img.shields.io/david/static-dev/spike-pushstate.svg?style=flat)](https://david-dm.org/static-dev/spike-pushstate) [![coverage](http://img.shields.io/coveralls/static-dev/spike-pushstate.svg?style=flat)](https://coveralls.io/github/static-dev/spike-pushstate)

:zap: immediate page loads using pushState

> **Note:** This project is in early development, and versioning is a little different. [Read this](http://markup.im/#q4_cRZ1Q) for more details.

## Why should you care?

If you are building a static site with multiple pages, which is a perfectly reasonable and straightforward way to build a site, you may be thinking "hey, how could I get my pages to load immediately like in a single page app, but without a buttload of javascript?" Well good news my friend, this is just the plugin for you!

Here's what it does. You install it into a spike project, then start it up. Now any link on the page that you have another template for will render immediately using javascript and update the url with pushState, instead of loading normally through http. These loads are just about immediate, making the site seems very very fast. If a link is clicked that does not map to another html page in your output directory, it will behave as usual. Pretty cool, right?

## Installation

`npm install spike-pushstate -S`

## Usage

Just initialize it in your spike project as a plugin as such:

```javascript
const PushState = require('spike-pushstate')

module.exports = {
  // rest of your config
  plugins: [new PushState()]
}
```

Then, in your main javascript file, require it up top:

```js
// assets/js/index.js
require('spike-pushstate-client')
```

That will do it! By default it will match any file with a `.html` extension, and use the pushState override on it. However, if you want it to match a different pattern, like maybe sugarml files instead, you can just pass a string with a glob matcher as such (string or array):

```javascript
new PushState({ files: '**/*.sgr' })
```

Note that all matches are made relative to the project root.

## Caveats

- Because of [an unfortunate webpack issue](https://github.com/webpack/webpack/issues/2515), you cannot use the globally installed spike CLI with this plugin. Instead, you must install spike locally (`npm i spike -S`), then execute that version. Typically adding an npm script that runs `spike watch` is the best approach.

- This plugin will cause a crash if used with the source map option in your app.js file. Make sure the source map option is removed before running!

- If you add a new file in development mode and are using webpack-hard-source for cacheing, you will need to clear your cache before the new page works with spike-pushstate.

## License & Contributing

- Details on the license [can be found here](LICENSE.md)
- Details on running tests and contributing [can be found here](contributing.md)
