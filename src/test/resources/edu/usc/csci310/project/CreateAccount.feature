Feature: test the create account functionality of website
  Scenario: successful creation of account
    Given I am on the create account page
    When I enter the username "Anika"
    And I enter the password "password"
    And I enter the email "anika@example.com"
    And I press the Create Account button
    Then I should get a "Account Created" message


  Scenario: blank attempt
    Given I am on the create account page
    When I enter the username ""
    And I enter the password ""
    And I press the Create Account button
    Then I should get a "Account cannot be created, username and password required" message


  Scenario: empty password
    Given I am on the create account page
    When I enter the username "Anika"
    And I enter the password ""
    And I press the Create Account button
    Then I should get a "Account cannot be created, password required" message


  Scenario: empty username
    Given I am on the create account page
    When I enter the username ""
    And I enter the password "password"
    And I press the Create Account button
    Then I should get a "Account cannot be created, username required" message
