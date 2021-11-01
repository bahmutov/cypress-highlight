/// <reference types="cypress" />

import { highlight } from '../..'

it('loads an app', () => {
  cy.visit('/')
  cy.get('[data-cy]').should('have.length.gt', 2)
  highlight()
  cy.screenshot('highlights', { capture: 'runner' })
})

it('highlights specific selectors', () => {
  cy.visit('/')
  cy.get('[data-cy]').should('have.length.gt', 2)
  // you can highlight different elements
  highlight('button[data-cy]')
  cy.screenshot('highlights-buttons', { capture: 'runner' })
})
