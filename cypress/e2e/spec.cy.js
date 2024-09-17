/// <reference types="cypress" />
// @ts-check

import { highlight } from '../..'

beforeEach(() => {
  cy.visit('/')
})

it('loads an app', () => {
  cy.get('[data-cy]').should('have.length.gt', 2)
  highlight()
  cy.screenshot('highlights', { capture: 'runner' })
})

it('highlights specific selectors', () => {
  cy.get('[data-cy]').should('have.length.gt', 2)
  // you can highlight different elements
  highlight('button[data-cy]')
  cy.screenshot('highlights-buttons', { capture: 'runner' })
})

it('allows passing options', () => {
  highlight({
    selectors: 'button[data-cy]',
  })
})

it.skip('fails on found element', () => {
  highlight({
    selectors: 'button[data-cy]',
    failIfFound: true,
  })
})
