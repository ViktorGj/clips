describe('Clip', () => {
  it('should play clip', () => {
    // 1. visit homepage
    cy.visit('/');

    // 2. click on video player
    cy.get('app-clips-list > .grid a:first').click();

    // 3. Click on video player
    cy.get('.video-js').click();

    //  4. Wait 3 seconds
    cy.wait(3000);

    //  5. Click on video player
    cy.get('.video-js').click();

  //  6. Assert width of progress bar (gte > greater than or equal to)
    cy.get('.vjs-play-progress').invoke('width').should('gte', 0);

  });
});
