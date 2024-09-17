/**
 * Options to the highlight function
 * @typedef {Object} HighlightOptions
 * @property {string|string[]} selectors
 */

/**
 * Highlights all elements on the page with good test selectors
 * like "data-cy" by injecting a CSS rule.
 * @example
 *  import { highlight } from 'cypress-highlight'
 *  cy.visit('/')
 *  highlight()
 *  cy.screenshot('highlighted', { capture: 'runner'} )
 * @example
 *  highlight({ selectors: ['[data-cy]', '[data-testid]'] })
 * @param {string[]|HighlightOptions} selectors (optional) List of selectors to highlight
 * @example highlight('[data-testid]', '[data-cy]')
 */
function highlight(...selectors) {
  if (selectors.length === 1 && typeof selectors[0] === 'object') {
    // using an options object
    const options = selectors[0]
    selectors = options.selectors || options.selector
    if (typeof selectors === 'string') {
      selectors = [selectors]
    }
  }

  if (Cypress._.isEmpty(selectors)) {
    selectors = ['[data-cy]']
  }

  cy.log(`cypress-highlight: ${selectors.join(', ')}`)
  const stylesheetTitle =
    'highlight-' + Cypress._.kebabCase(selectors.join('-'))

  cy.wrap(null, { log: false }).then(() => {
    // @ts-ignore
    const doc = cy.state('document')
    const head = doc.head
    const hasStyle = Cypress._.find(head.styleSheets, {
      title: stylesheetTitle,
    })
    if (hasStyle) {
      return
    }

    const style = doc.createElement('style')
    style.title = stylesheetTitle
    style.type = 'text/css'
    const outline = 'outline: 1px solid red !important;\n'
    const css = selectors
      .map((selector) => `${selector} { ${outline} }`)
      .join('\n')
    style.appendChild(document.createTextNode(css))
    head.appendChild(style)
  })
}

module.exports = { highlight }
