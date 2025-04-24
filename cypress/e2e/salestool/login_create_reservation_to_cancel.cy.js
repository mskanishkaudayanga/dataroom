import '../../support/index'
import 'cypress-file-upload'

describe('Cockpit - create reservation', function() {

  const loginAndInitialSetup = () => {
    cy.intercept('GET', '**/v1/**').as('getOnDemand');

    cy.login() // for blind tests nessesary

    cy.wait('@getOnDemand', {timeout: 10000})
  };

  it('create a reservation', function() { // replace () => with function()

    loginAndInitialSetup()
    cy.get('.left > a > .button').click()

    cy.get('.real-estate-insert > :nth-child(1) > .text').type('lead')
    cy.get('.real-estate-insert > :nth-child(1) > .dropdown > ul > li:first-of-type', {timeout: 30000}).click()
    cy.get('.real-estate-insert > .button').click()
    cy.get('.inner-button-wrapper > .button').click()

    cy.get('.customer-data > :nth-child(1) > .text').type('koll@eck3.de')
    cy.get('.customer-data > :nth-child(1) > .button', {timeout: 20000}).click()
    cy.get('.customer-data > :nth-child(1) > .dropdown > ul > li').contains('koll@eck3.deZAUN-WE18').click()
    cy.get('.inner-button-wrapper > .full').click()

    cy.get('.inner-button-wrapper > .full').click()

    cy.get('.inner-button-wrapper > .full').click()

    cy.get('.inner-button-wrapper > .full').click() // Create reservation

    cy.url({timeout: 60000}).should('eq', 'http://localhost:5173/')

  })


  it('open reservation tab content and save reservation webform link', function() { // replace () => with function()

    loginAndInitialSetup()

    cy.openLatestReservation()

    cy.wait('@getOnDemand', {timeout: 60000}) // wait for single view

    cy.get('.process-tabs-wrapper > div:first-of-type').click()

    cy.wait('@getOnDemand', {timeout: 60000})

    cy.get('.process-tab-content > ul > :nth-child(1) a')
        .invoke('attr', 'href')
        .then((href) => {
          cy.writeFile('cypress/fixtures/urls.json', { url: href.replace('https://staging.cockpit.bestplace-living.de', '') })
        })
  })

  it('fill out reservation webform and submit it', function() { // replace () => with function()

    cy.readFile('cypress/fixtures/urls.json').then((data) => {
      expect(data).to.have.property('url')

      cy.log('https://staging.cockpit.bestplace-living.de/'+data.url);

      cy.visit('https://staging.cockpit.bestplace-living.de/'+data.url);

      cy.get('.page-selection > .button').click()

      cy.get('.step-2-wrapper > .page-content > .page-selection > .buttons-wrapper > .button-next').click()

      cy.get('.step-3-wrapper > .page-content > .page-selection > .buttons-wrapper > .button-next').click()

      cy.get('.step-4-wrapper > .page-content > .page-selection > .buttons-wrapper > .button-next').click()

      cy.get('#iban').type('DE75512108001245126199')

      cy.get('.step-6-wrapper > .page-content > .page-selection > .buttons-wrapper > .button-next').click()

      cy.get('.step-7-wrapper > .page-content > .page-selection > .buttons-wrapper > .button-next').click() // Submit

      cy.get('#page', {timeout: 60000}).should('have.css', 'opacity', '1');

    })

  })

  it('upload reservation report', function() {

    loginAndInitialSetup()

    cy.intercept('POST', '**/v1/**').as('postOnDemand');

    cy.openLatestReservation()

    cy.wait('@getOnDemand', {timeout: 60000}) // wait for single view

    cy.get('.actions > .full').click()

    cy.get('.dropzone-container input[type=file]').attachFile({ filePath: 'reservation_agreement.pdf', encoding: 'binary' });

    cy.get('.actions > .blue').click()

    cy.checkForSuccessNotification()

  })

  it('cancel reservation', function() { // replace () => with function()

    loginAndInitialSetup()

    cy.openLatestReservation()

    cy.wait('@getOnDemand', {timeout: 60000}) // wait for single view

    cy.get('.subheadline .button-cancel > .button').click()

    cy.get('input[name="selectedCancelUnit-0"]').click()

    cy.get('.dropdown-input[name="CancelReason0"]').click()

    cy.get('.dropdown.active ul li').first().click()

    cy.get('textarea[name="reasonText"]').type('Das ist eine Test-Reservierung')

    cy.get('.actions:last-of-type .button.full').click()

    cy.get('.actions:last-of-type .button.full').click()

    cy.checkForSuccessNotification()

  })

})
