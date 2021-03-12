import '@testing-library/cypress/add-commands';

Cypress.Commands.add('isIFrameReady', () => {
    return cy.window().then({ timeout: 10 * 1000 }, window => {
        return new Cypress.Promise(resolve => {
            window.addEventListener('message', () => {
               resolve();
            })
        })
    })
})

Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe, callback = () => {}) => {
    // For more info on targeting inside iframes refer to this GitHub issue:
    // https://github.com/cypress-io/cypress/issues/136
    cy.log('Getting iframe body')

    return cy
        .wrap($iframe)
        .should(iframe => expect(iframe.contents().find('body')).to.exist)
        .then(iframe => cy.wrap(iframe.contents().find('body')))
        .within({}, callback)
})