// import '../../support/index'
//
// describe('Canban - create lead and work with canban', function() {
//
//   beforeEach(function() {
//
//     // Wait for api request finished
//     cy.intercept('GET', '**/v1/**').as('getOnDemand');
//
//     cy.login() // for blind tests nessesary
//
//     cy.wait('@getOnDemand', {timeout: 10000})
//
//     cy.get('[data-cy="canban-button"]').click()
//
//     cy.contains('Lead erstellen').should('be.visible')
//
//     cy.wait('@getOnDemand', {timeout: 10000})
//
//   })
//
//   it('fill out lead form and submit', () => {
//
//     cy.intercept('POST', '**/v1/**').as('createNewLeadRequest');
//
//     cy.get('[data-cy="create-lead"]').click()
//     cy.contains('Neuen Lead erstellen').should('be.visible')
//
//     cy.get('.search > .text').type('koll@eck3.de')
//     cy.get('.search > .dropdown > ul > :nth-child(1) > span', {timeout: 60000}).click()
//     cy.get(':nth-child(8) > .valid > .text').click()
//     cy.get(':nth-child(8) > .valid > .dropdown > ul > :nth-child(1)').click()
//     cy.get(':nth-child(9) > :nth-child(2) > .text').click()
//     cy.get(':nth-child(9) > :nth-child(2) > .dropdown > ul > :nth-child(3)').click()
//     cy.get(':nth-child(9) > :nth-child(1) > .text').click()
//     cy.get(':nth-child(9) > :nth-child(1) .dropdown > ul').contains('li', 'Patrick Koll').click()
//     cy.get('[data-cy="submit"]').click()
//
//     cy.checkForSuccessNotification2Mins()
//   })
//
//
//   it('search latest lead and send to followup', () => {
//
//     cy.get('[data-cy="testlead"]').first().find('.actions > .next').click()
//
//     cy.get('.modal-body .actions [data-cy="submit-lead-to-follow-up"]', {timeout: 40000})
//         .should('be.visible')
//         .click()
//
//     cy.checkForSuccessNotification()
//
//   })
//
//   it('search latest lead in followup col and send to unqualified', () => {
//     cy.get('[data-cy="col-followup"] [data-cy="testlead"]').first().find('.actions > .delete').click()
//     cy.get('.modal-body input[name="Source"]').click()
//     cy.get('.dropdown.active ul > :nth-child(1)').click()
//     cy.get('.modal-body .actions > .button.blue').click()
//     cy.get('.modal-body .actions > .button.blue').click()
//     cy.checkForSuccessNotification()
//   })
//
// })
