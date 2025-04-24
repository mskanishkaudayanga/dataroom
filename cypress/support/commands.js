import 'cypress-wait-until';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })




Cypress.Commands.add('login', (email, password) => {

    cy.fixture('loginData.json').then(function(userData) {

        cy.visit('http://localhost:5173/login')

        cy.wait(2000)

        // Check the URL to see if we were redirected
        cy.url().then(currentUrl => {
            if (currentUrl !== 'http://localhost:5173/') {
                cy.get('.text').type(userData.email)
                cy.get('.password').type(userData.password)
                cy.get('.submit').click()
            }
        })

        cy.closePatchNotesPopup()

    })

})


Cypress.Commands.add('closePatchNotesPopup', (email, password) => {

    cy.document().then((doc) => {
        const titleElem = doc.querySelector('.modal-header > .title');
        if (titleElem && titleElem.is(':visible')) {
            const titleText = titleElem.textContent.toLowerCase();
            if (titleText.includes('patch notes')) {
                // Perform your action here if the element is visible and contains 'patch notes'
                cy.get('.modal-header > .fa-solid').click();
            }
        }
    });

})


Cypress.Commands.add('openLatestReservation', (email, password) => {

    // Wait for api request finished
    cy.intercept('GET', '**/v1/**').as('getOnDemand');

    cy.wait('@getOnDemand', {timeout: 60000})

    cy.get('.dashboard-body .cards > div:first-of-type').click()

    cy.wait('@getOnDemand', {timeout: 60000})

    cy.get('.loading-screen-init',  {timeout: 25000}).should('not.exist');

})

Cypress.Commands.add('checkForSuccessNotification', (email, password) => {

    cy.get('.notification-banner', {timeout: 60000}).should('have.class', 'active');

    cy.get('.notification-banner .alert-message', {timeout: 60000}).should('have.class', 'success');

})

Cypress.Commands.add('checkForSuccessNotification2Mins', (email, password) => {

    cy.get('.notification-banner', {timeout: 60000}).should('have.class', 'active');

    cy.get('.notification-banner .alert-message', {timeout: 60000}).should('have.class', 'success');

})
