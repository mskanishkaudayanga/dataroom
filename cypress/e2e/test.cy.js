// describe('Login Page', function() {


//   it('Loads the login page', function() {
//     cy.visit('http://localhost:5173/login')
//     cy.get('.view-title h1').should('have.text', 'Bestplace Cockpit')
//     cy.get('input[name="mail"]').should('exist')
//       .should('have.attr', 'placeholder', 'E-Mail')
//     cy.get('input[name="password"]').should('exist')
//       .should('have.attr', 'placeholder', 'Passwort')
//     cy.get('input[type="submit"]').should('exist')
//       .should('have.value', 'Einloggen')
//   })
//   it('Submits the login form', function() {
//     cy.visit('http://localhost:5173/login')
//     cy.get('.login-form-wrapper form', { timeout: 10000 }).should('be.visible');
//     cy.get('input[name="mail"]').type('development@azbow.com')
//     cy.get('input[name="password"]').should('exist');
//     cy.get('input[name="password"]').type('IcC*K13aIMCr4DBAO&qruh2Y', { force: true });
//     cy.get('.login-form-wrapper form', { timeout: 20000 }).should('exist');
//     cy.get('.login-form-wrapper form').submit();
//     cy.wait(2000);
//     cy.url().should('include', 'http://localhost:5173')
//     cy.wait(2000);
//   })

// })
//
// describe('Home Page', function() {
//
//   it('Loads the Home Page', function() {
//     cy.visit('http://localhost:5173/kaufpreis-list')
//   })
//
//   it('Verifies Einheit Typ Dropdown Data', function() {
//     const dropdownItems = ['Wohnen', 'Gewerbe', 'Parken'];
//     cy.get('#main-filter-dropdown-container').click();
//     dropdownItems.forEach(data => {
//     cy.contains('#main-filter-dropdown-container .kpl-dropdown-items li', data).should('exist');
//     });
//   })
//
//   it('Verifies Unternehmen Dropdown Data', function() {
//     const dropdownItems = ['Living', 'KG'];
//     cy.get('#company-dropdown-container').click();
//     cy.get('#company-dropdown-container .kpl-dropdown-items li').each(($li, index) => {
//         cy.wrap($li).find('span').invoke('text').then(text => {
//             expect(text.trim()).to.equal(dropdownItems[index]);
//         });
//     });
//   });
//
//   it('Verifies Immor Number', function() {
//     cy.get('#search-field-container .kpl-input-field').should('have.attr', 'placeholder', 'ImmoNr');
//   })
//
//   it('load projects',function(){
//     cy.visit('http://localhost:5173/login')
//
//     cy.get('input[name="mail"]').type('development@azbow.com')
//     cy.get('input[name="password"]').type('IcC*K13aIMCr4DBAO&qruh2Y', { force: true });
//     // cy.get('.login-form-wrapper form', { timeout: 20000 }).should('be.visible');
//     cy.get('.login-form-wrapper form').submit();
//     cy.wait(2000);
//     cy.url().should('include', 'http://localhost:5173')
//     cy.wait(2000);
//     cy.get('.navigation-wrapper .fa-list').click();
//     cy.wait(2000);
//     cy.url().should('include', 'http://localhost:5173/kaufpreis-list')
//     cy.wait(2000);
//     cy.get('.kpl-dropdown-input').should('have.attr', 'placeholder', 'Einheit Typ');
//     cy.contains('.kpl-dropdown-items li', 'Wohnen').should('have.class', 'selected');
//     cy.get('#main-filter-dropdown-container').click();
//     cy.contains('#main-filter-dropdown-container .kpl-dropdown-items li', 'Gewerbe').click({ force: true });
//     cy.contains('#main-filter-dropdown-container .kpl-dropdown-items li', 'Gewerbe').should('have.class', 'selected');
//     cy.get('#company-dropdown-container .kpl-dropdown-input').should('have.attr', 'placeholder', 'Unternehmen');
//     cy.wait(2000);
//     cy.get('#company-dropdown-container').click();
//     cy.contains('#company-dropdown-container .kpl-dropdown-items li', 'Living').click({ force: true });
//     cy.contains('#company-dropdown-container .kpl-dropdown-items li', 'Living').should('have.class', 'selected');
//     cy.wait(3000);
//     cy.get('#projekts-dropdown-container .kpl-dropdown-input').should('have.attr', 'placeholder', 'Projekt');
//     cy.get('#projekts-dropdown-container').click();
//     cy.wait(2000);
//     cy.contains('#projekts-dropdown-container .kpl-dropdown-items li','Leadverteiler 3 Living').click({ force: true });
//     cy.get('#projekts-dropdown-container .kpl-dropdown-items li.selected').should('contain', 'Leadverteiler 3 Living');
//     cy.get('#projekts-dropdown-container').click();
//     cy.wait(3000);
//     cy.get('.kpl-table-section .project-title ').should('contain', 'Stammobjekt : Leadverteiler 3 Living');
//     cy.get('th.kpl-table-header').should('contain', 'TE', { timeout: 10000 });
//     cy.get('.kpl-table-header').contains('Keller').should('exist');
//     cy.get('.kpl-table-row-view-only').should('contain', 'Leadverteiler3-WE04', { timeout: 10000 });
//     cy.get('.kpl-table-data').contains('WE 04').should('exist');
//     cy.get('.kpl-table-data').contains('teststraße').should('exist');
//
//
//   })
//
//
//   // it('Verifies Verwaltungsoptionen Dropdown', function() {
//   //   const dropdownItems = ['Benutzeransicht Wechseln','Benutzeransicht Bearbeiten','Daten Exportieren','Daten wiederherstellen'];
//   //   cy.get('.kpl-add-record-outline-button').should('contain', 'Verwaltungsoptionen');
//   //   cy.get('.kpl-add-record-outline-button').click();
//   // })
//
//
//   // it('Load Daten exportieren Page', function() {
//   //   cy.contains('.kpl-dropdown-items li', 'Daten exportieren').should('exist');
//   //   cy.contains('.kpl-dropdown-items li', 'Daten exportieren').click({ force: true });
//   //   cy.get('.top-header-container').should('contain', 'Daten Exportieren');
//   // })
//
//   // it('verifies Bearbeiten Button', function() {
//   //   cy.get('.kpl-edit-fill-button').should('exist');
//   //   cy.get('.kpl-edit-fill-button').should('contain', 'Bearbeiten');
//   // })
//
//   // it('verifies Ansicht leeren Button', function() {
//   //   cy.get('.kpl-edit-fill-button').should('exist');
//   //   cy.get('.kpl-edit-fill-button').should('contain', 'Ansicht leeren');
//   // })
//
//
//
//
//
//
//
//
// })














