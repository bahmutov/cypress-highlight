/// <reference types="cypress" />
// @ts-check

import { highlightMissingTestIds } from '../../src'

beforeEach(() => {
  cy.visit('/')
  cy.get('.todo-list').should('be.visible')
})

it('highlights input elements without data-cy attribute', () => {
  cy.get('input[data-cy=new-todo]').invoke('removeAttr', 'data-cy')
  // confirm there are input elements without data-cy attribute
  cy.get('input:not([data-cy])')
  highlightMissingTestIds()
})
