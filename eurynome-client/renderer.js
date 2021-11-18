const m = require('mithril')
const App = require('./min/component/App')

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

module.exports = () => m.mount(document.getElementById('eurynome'), App)
