describe('Lab 4 e2e', () => {
  beforeEach(() => {
    cy.visit('/act3')
    cy.wait(5000)
  })

  describe('Page Rendering', () => {
    it('should render the page correctly', () => {
      cy.get('header').should('be.visible')
      cy.get('header h1').should('have.text', 'Member Management')
      cy.get('button').contains('Create Member').should('be.visible')
      cy.get('h2').should('have.text', 'Members List')
    })

    it('should show "No members found" when list is empty', () => {
      // Assuming you can clear the members list
      cy.get('p').contains('No members found.').should('be.visible')
    })
  })

  describe('Member Creation', () => {
    it('should create a new member successfully', () => {
      cy.get('button').contains('Create Member').click()
      
      // Fill in the form
      cy.get('input[name="firstName"]').type('John')
      cy.get('input[name="lastName"]').type('Doe')
      cy.get('input[name="groupName"]').type('Group A')
      cy.get('input[name="role"]').type('Developer')
      cy.get('input[name="expectedSalary"]').type('50000')
      cy.get('input[name="expectedDateOfDefense"]').type('2025-12-31')
      
      cy.get('button').contains('Add Member').click()
      
      // Verify the new member appears
      cy.contains('John').should('be.visible')
      cy.contains('Doe').should('be.visible')
      cy.contains('Group A').should('be.visible')
      cy.contains('Developer').should('be.visible')
      cy.contains('50000').should('be.visible')
    })

    it('should show validation errors for empty required fields', () => {
      cy.get('button').contains('Create Member').click()
      cy.get('button').contains('Add Member').click()
      
      // Check for required field validations
      cy.get('input[name="firstName"]').should('have.attr', 'required')
      cy.get('input[name="lastName"]').should('have.attr', 'required')
      cy.get('input[name="groupName"]').should('have.attr', 'required')
      cy.get('input[name="role"]').should('have.attr', 'required')
    })
  })

  describe('Member Editing', () => {
    it('should edit member successfully', () => {
      // Click edit button on first member
      cy.get('button').contains('Edit').first().click()
      
      // Update fields
      cy.get('input[name="firstName"]').clear().type('Jane')
      cy.get('input[name="lastName"]').clear().type('Smith')
      cy.get('input[name="groupName"]').clear().type('Group B')
      cy.get('input[name="role"]').clear().type('Designer')
      cy.get('input[name="expectedSalary"]').clear().type('60000')
      cy.get('input[name="expectedDateOfDefense"]').clear().type('2026-01-01')
      
      cy.get('button').contains('Update Member').click()
      
      // Verify updated info
      cy.contains('Jane').should('be.visible')
      cy.contains('Smith').should('be.visible')
      cy.contains('Group B').should('be.visible')
      cy.contains('Designer').should('be.visible')
      cy.contains('60000').should('be.visible')
    })

    it('should allow canceling edit operation', () => {
      cy.get('button').contains('Edit').first().click()
      cy.get('button').contains('Cancel').click()
      cy.get('form').should('not.exist')
    })
  })
})