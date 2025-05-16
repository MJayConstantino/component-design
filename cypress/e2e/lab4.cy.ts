describe('Lab 4 e2e', () => {
  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:3001/api/members') // Adjust the endpoint as necessary
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

    it('should allow canceling member creation', () => {
      cy.get('button').contains('Create Member').click()
      cy.get('button').contains('Cancel').click()
      cy.get('form').should('not.exist')
    })

it('should create a member with a long name', () => {
      cy.get('button').contains('Create Member').click()
      
      // Fill in form with long values
      cy.get('input[name="firstName"]').type('Johnathon Alexander Christopher')
      cy.get('input[name="lastName"]').type('Smith-Jones-Williams III')
      cy.get('input[name="groupName"]').type('Super Long Group Name That Should Still Work Fine')
      cy.get('input[name="role"]').type('Senior Software Development Engineer in Test')
      cy.get('input[name="expectedSalary"]').type('999999')
      cy.get('input[name="expectedDateOfDefense"]').type('2025-12-31')
      
      cy.get('button').contains('Add Member').click()

      // Verify long values are displayed
      cy.contains('Johnathon Alexander Christopher').should('be.visible')
      cy.contains('Smith-Jones-Williams III').should('be.visible')
      cy.contains('Super Long Group Name').should('be.visible')
    })

    it('should not create a member with empty required fields', () => {
      cy.get('button').contains('Create Member').click()
      cy.get('button').contains('Add Member').click()
      
      // Form should not submit and show required validation
      cy.get('form').should('exist')
      cy.get('input[name="firstName"]').should('have.attr', 'required')
      cy.get('input:invalid').should('have.length.at.least', 1)
    })
  })

  describe('Member Editing Edge Cases', () => {
    beforeEach(() => {
      // Create a test member first
      cy.get('button').contains('Create Member').click()
      cy.get('input[name="firstName"]').type('Test')
      cy.get('input[name="lastName"]').type('User')
      cy.get('input[name="groupName"]').type('Test Group')
      cy.get('input[name="role"]').type('Tester')
      cy.get('input[name="expectedSalary"]').type('50000')
      cy.get('input[name="expectedDateOfDefense"]').type('2025-12-31')
      cy.get('button').contains('Add Member').click()
    })

    it('should handle special characters in input fields', () => {
      cy.get('button').contains('Edit').first().click()
      
      // Try special characters
      cy.get('input[name="firstName"]').clear().type('Test@#$%')
      cy.get('input[name="lastName"]').clear().type('User!@#')
      cy.get('input[name="groupName"]').clear().type('Group &*()')
      
      cy.get('button').contains('Update Member').click()
      
      // Verify special characters are saved
      cy.contains('Test@#$%').should('be.visible')
      cy.contains('User!@#').should('be.visible')
      cy.contains('Group &*()').should('be.visible')
    })

    it('should handle extremely large salary numbers', () => {
      cy.get('button').contains('Edit').first().click()
      cy.get('input[name="expectedSalary"]').clear().type('999999999')
      cy.get('button').contains('Update Member').click()
      cy.contains('999999999').should('be.visible')
    })

    it('should handle past dates', () => {
      cy.get('button').contains('Edit').first().click()
      cy.get('input[name="expectedDateOfDefense"]').clear().type('2020-01-01')
      cy.get('button').contains('Update Member').click()
      cy.contains('2020').should('be.visible')
    })
  })

  describe('Member Deletion', () => {
    beforeEach(() => {
      // Create two test members
      for (let i = 1; i <= 2; i++) {
        cy.get('button').contains('Create Member').click()
        cy.get('input[name="firstName"]').type(`Test${i}`)
        cy.get('input[name="lastName"]').type(`User${i}`)
        cy.get('input[name="groupName"]').type(`Group${i}`)
        cy.get('input[name="role"]').type('Tester')
        cy.get('input[name="expectedSalary"]').type('50000')
        cy.get('input[name="expectedDateOfDefense"]').type('2025-12-31')
        cy.get('button').contains('Add Member').click()
      }
    })

    it('should delete a member and update the list', () => {
      // Count initial members
      cy.get('[class*="grid"]').children().should('have.length', 2)
      
      // Delete first member
      cy.get('button').contains('Delete').first().click()
      cy.get('button').contains('Confirm').click()
      
      // Verify member is deleted
      cy.get('[class*="grid"]').children().should('have.length', 1)
      cy.contains('Test1').should('not.exist')
    })

    it('should cancel member deletion', () => {
      // Count initial members
      cy.get('[class*="grid"]').children().should('have.length', 2)
      
      // Try to delete but cancel
      cy.get('button').contains('Delete').first().click()
      cy.get('button').contains('Cancel').click()
      
      // Verify member still exists
      cy.get('[class*="grid"]').children().should('have.length', 2)
    })
  })

  after(( ) => {
    // Clean up the members list if needed
    cy.request('DELETE', 'http://localhost:3001/api/members') // Adjust the endpoint as necessary
  })
})