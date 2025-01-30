/**
 * Options to the highlight function
 * @typedef {Object} HighlightOptions
 * @property {string|string[]} selectors - list of selectors to highlight
 * @property [failIfFound] boolean - if true, the test fails if the selector is found
 * @property [failIfNotFound] boolean - if true, the test fails if the selector is not found
 */

/**
 * @param {string} stylesheetTitle
 * @param {string} css
 */
function addStyles(stylesheetTitle, css) {
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

    style.appendChild(document.createTextNode(css))
    head.appendChild(style)
  })
}

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
 * @param {string[]|HighlightOptions[]} selectors (optional) List of selectors to highlight
 * @example highlight('[data-testid]', '[data-cy]')
 */
function highlight(...selectors) {
  let failIfFound = false
  let failIfNotFound = false

  if (selectors.length === 1 && typeof selectors[0] === 'object') {
    // using an options object
    const options = selectors[0]
    selectors = options.selectors || options.selector
    if (typeof selectors === 'string') {
      selectors = [selectors]
    }

    failIfFound = Boolean(options.failIfFound)
    failIfNotFound = Boolean(options.failIfNotFound)
  }

  if (failIfFound && failIfNotFound) {
    throw new Error('Cannot set both failIfFound and failIfNotFound')
  }

  if (Cypress._.isEmpty(selectors)) {
    selectors = ['[data-cy]']
  }

  const andSelectors = selectors.join(', ')
  cy.log(`cypress-highlight: ${andSelectors}`)
  const stylesheetTitle =
    'highlight-' + Cypress._.kebabCase(selectors.join('-'))
  const outline = 'outline: 1px solid red !important;\n'
  const css = selectors
    .map((selector) => `${selector} { ${outline} }`)
    .join('\n')
  addStyles(stylesheetTitle, css)

  if (failIfFound) {
    cy.get(andSelectors, { log: false }).should('not.exist')
  } else if (failIfNotFound) {
    cy.get(andSelectors, { log: false }).should('exist')
  }
}

/**
 * @param {boolean} failIfFound - if true, the test fails if the selector is found
 */
function highlightMissingTestIds(failIfFound = true) {
  const stylesheetTitle = 'highlight-missing-test-ids'
  const css = `
    input:not([data-cy]),button:not([data-cy]),a:not([data-cy]) { outline: 2px solid pink !important; }
  `
  addStyles(stylesheetTitle, css)
  if (failIfFound) {
    cy.document({ log: false }).then((doc) => {
      const input = doc.querySelector('input:not([data-cy])')
      if (input) {
        console.error('Found input elements without data-cy attribute')
        console.error(input)
        console.error(input.outerHTML)
        throw new Error(
          'Found input elements without data-cy attribute, see DevTools console for details',
        )
      }
      const button = doc.querySelector('button:not([data-cy])')
      if (button) {
        console.error('Found button elements without data-cy attribute')
        console.error(button)
        console.error(button.outerHTML)
        throw new Error(
          'Found button elements without data-cy attribute, see DevTools console for details',
        )
      }
      const a = doc.querySelector('a:not([data-cy])')
      if (a) {
        console.error('Found anchor elements without data-cy attribute')
        console.error(a)
        console.error(a.outerHTML)
        throw new Error(
          'Found anchor elements without data-cy attribute, see DevTools console for details',
        )
      }

      cy.log('**all important elements have data-cy attribute**')
    })
  }
}

module.exports = { highlight, highlightMissingTestIds }
