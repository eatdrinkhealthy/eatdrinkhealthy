Feature: Lists

  As a logged-in user,
  I want to be able to see and manage a list of lists
  So I can view the lists I've created

  Scenario: Visit home page as a signed in user
    Given I am authenticated
    When  I click the menu
    Then  I see a list of lists

  Scenario: Create a new list of businesses
    Given I am authenticated
    When  I create a new list called "my test list"
    Then  The list of lists will contain "my test list"

  Scenario: Delete a list of businesses
    Given I am authenticated
    And   I have the demo lists set up
    When  I delete the list "Vegan Shops"
    Then  There will not be a list called "Vegan Shops"

  Scenario: As a signed in user I can remove businesses from a list, or delete a list, I can edit the name, and description https://trello.com/c/Uu6Zmgd8/27-1-edit-a-list
    Then a test needs to be written

  Scenario: As a signed in user I can add a business to an existing custom list that I created from the business info page, so that I can include that business to my list https://trello.com/c/dK1ZhNGL/26-0-5-add-a-business-to-a-user-list
    Then a test needs to be written

  Scenario: As a signed in user, I can share a list to friends, so that they can see my custom lists https://trello.com/c/6xcB8cHW/24-1-share-a-list
    Then a test needs to be written




