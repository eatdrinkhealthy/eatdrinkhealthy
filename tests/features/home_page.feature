Feature: Home Page

  As a visitor to the site
  I want to see a map
  So I can find businesses near me

  Scenario: Visit home page as a signed out user
    Given I am on the homepage
    And   I am signed out
    Then  I see a map

  Scenario: View the filter page as a signed out user
    Given I am on the homepage
    When  I view the filter page
    Then  I see the default search filters set

  Scenario: Sign in
    Given I am authenticated
    Then  I see my name in the profile section

