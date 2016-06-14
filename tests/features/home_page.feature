Feature: Home Page

  As a visitor to the site
  I want to see a map
  So I can find business near me

  @watch
  Scenario: Visit home page as a signed out user
    Given I am on the homepage
    And   I am signed out
    Then  I see a map

  @watch
  Scenario: Sign in
    Given I am authenticated
    Then  I see my name in the profile section
