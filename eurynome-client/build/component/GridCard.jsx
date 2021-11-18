/* eslint-disable no-unused-vars */
const m = require('mithril')
const { Card } = require('construct-ui')
/* eslint-enable no-unused-vars */

module.exports = class GridCard {
  constructor () {
    this.id = 'GridCard'
  }

  view (vnode) {
    return (
      <div class={`${this.id} ${vnode.attrs.class}`}>
        <link href={`./min/css/${this.id}.css`} rel="stylesheet"></link>
        {vnode.children.map((value, index) => {
          let onclick
          if (value.attrs && value.attrs.onclick) onclick = value.attrs.onclick

          if (value.tag === 'a') {
            value.tag = 'div'
            return (
              <a key={index} href={value.attrs.href}>
                <Card
                  onclick={onclick}>
                  {value.children}
                </Card>
              </a>
            )
          } else {
            return (
              <Card
                onclick={onclick}
                key={index}>
                {value.children}
              </Card>
            )
          }
        })}
      </div>
    )
  }
}
