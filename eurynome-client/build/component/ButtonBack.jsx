/* eslint-disable no-unused-vars */
const m = require('mithril')
const { Button } = require('construct-ui')
/* eslint-enable no-unused-vars */

module.exports = class ButtonBack {
  constructor () {
    this.id = 'ButtonBack'
  }

  view (vnode) {
    const buttonSfx = window.$eu.sfx.get('button')

    const onclick = vnode.attrs.onclick || (() => {
      buttonSfx.play()
      m.route.set(vnode.attrs.route)
    })

    return (
      <Button class="back" label="back" onclick={onclick}/>
    )
  }
}
