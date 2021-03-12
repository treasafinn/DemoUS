describe('Home', () => {
    beforeEach(() => {
        cy.visit('/salons/demo-us');
        cy.viewport(1200, 1200);
    });

    const selectGiftCard = value => {
        cy.findByText(`$${value}`)
            .should('have.attr', 'data-value', value)
            .click();
    };

    const verifyConfirmationPageUrl = () => {
        cy.url().should('include', '/salons/demo-us#confirm');
    };

    const completeIframeForm = () => {
        cy.isIFrameReady().then(() => {
            cy.get('iframe').iframe(() => {
                // Targets the input within the iframe element
                cy.get('#card-name').type('Firstname Surname');
                cy.get('#card-zip').type('92606');
                cy.get('#card-number').type('4111 1111 1111 1111');
                cy.get('#card-expiry').type('12/22');
                cy.get('#card-security').type('999');
                cy.get('#submitButton').click();
            })
        })
    };

    it('should Checkout button is disabled on page load', () => {
        cy.findAllByTestId('checkout.checkoutButton').first().click().should('have.class', 'btn-disabled')
    });

    it('should self-purchase when entering correct details', () => {
        const giftCardValue = '$50';
        selectGiftCard('50');

        const email = 'test@gmail.com';
        cy.findByTestId('email.purchaserEmailInput').type(email);
        cy.findByTestId('name.purchaserFirstNameInput').type('Firstname');
        cy.findByTestId('name.purchaserLastNameInput').type('Surname');
        cy.findAllByTestId('checkout.checkoutButton').first().click();

        verifyConfirmationPageUrl();
        cy.findByTestId('confirm.totalSpan').contains(giftCardValue);
        cy.findByTestId('confirm.purchaserEmailSpan').contains(email);
        cy.findByTestId('confirm.recipientEmailSpan').contains(email);
        cy.findByText('Confirm Details').click();
        cy.findByText('Payment details').should('be.visible');

        completeIframeForm();

        cy.findByText('Your gift card value is:').should('be.visible');
        cy.findByText(giftCardValue).should('be.visible');
        cy.findByText('Done').click();
        cy.findByText('Amount').should('be.visible');
    });

    it('should purchase for someone else when entering correct details', () => {
        cy.findByTestId('tabs.sendToOtherTab').should('be.visible').click();
        // seems to be a bug so click this twice
        cy.findByTestId('tabs.sendToOtherTab').should('be.visible').click();

        const giftCardValue = '$100';
        selectGiftCard('100')

        const senderEmail = 'test@gmail.com';
        const recipientEmail = 'test2@gmail.com';
        cy.findByTestId('email.purchaserEmailInput').type(senderEmail);
        cy.findByTestId('name.purchaserFirstNameInput').type('Firstname');
        cy.findByTestId('name.purchaserLastNameInput').type('Surname');
        cy.findByTestId('email.recipientEmailInput').type(recipientEmail);
        cy.findByTestId('email.recipientMessageInput').type('Hi');
        cy.findAllByTestId('checkout.checkoutButton').first().click();

        verifyConfirmationPageUrl();
        cy.findByTestId('confirm.totalSpan').contains(giftCardValue);
        cy.findByTestId('confirm.purchaserEmailSpan').contains(senderEmail);
        cy.findByTestId('confirm.recipientEmailSpan').contains(recipientEmail);
        cy.findByText('Confirm Details').click();
        cy.findByText('Payment details').should('be.visible');

        completeIframeForm();

        cy.findByText('Your gift card value is:').should('be.visible');
        cy.findByText(giftCardValue).should('be.visible');
        cy.findByText('Done').click();
        cy.findByText('Amount').should('be.visible');
    });

})