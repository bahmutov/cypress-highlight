/**
 * Highlights all elements on the page with good test selectors
 * like "data-cy" by injecting a CSS rule.
 * @example
 *  import { highlight } from 'cypress-highlight'
 *  cy.visit('/')
 *  highlight()
 *  cy.screenshot('highlighted', { capture: 'runner'} )
 */
function highlight() {
  cy.wrap(null, { log: false }).then(() => {
    // @ts-ignore
    const doc = cy.state('document')
    const head = doc.head
    const hasStyle = Cypress._.find(head.styleSheets, { title: 'highlight' })
    if (hasStyle) {
      return
    }

    const style = doc.createElement('style')
    style.title = 'highlight'
    style.type = 'text/css'
    style.appendChild(
      document.createTextNode(`
        [data-cy] {
          outline: 1px solid red !important;
        }
      `),
    )
    head.appendChild(style)
  })
}

module.exports = { highlight }
