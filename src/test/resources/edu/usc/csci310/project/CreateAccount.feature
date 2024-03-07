Feature: test the create account functionality of website
  Scenario: successful creation of account
    Given I am on the create account page
    When I enter the username "Anika"
    And I enter the email "anika@example.com"
    And I enter the password "password"
    And I confirm the password "password"
    And I press the Create Account button
    Then I should get a "Successful Account Creation" message


  Scenario: blank attempt
    Given I am on the create account page
    When I enter the username ""
    And I enter the email ""
    And I enter the password ""
    And I confirm the password ""
    And I press the Create Account button
    Then I should get a "Failed to create account: username and password required" message


  Scenario: empty password
    Given I am on the create account page
    When I enter the username "Anika"
    And I enter the email "anika@example.com"
    And I enter the password ""
    And I confirm the password ""
    And I press the Create Account button
    Then I should get a "Failed to create account: password required" message


  Scenario: empty username
    Given I am on the create account page
    When I enter the username ""
    And I enter the email "anika@example.com"
    And I enter the password "password"
    And I confirm the password "password"
    And I press the Create Account button
    Then I should get a "Failed to create account: username required" message


  Scenario: empty email
    Given I am on the create account page
    When I enter the username "Anika"
    And I enter the email ""
    And I enter the password "password"
    And I confirm the password "password"
    And I press the Create Account button
    Then I should get a "Failed to create account: email required" message

  Scenario: password confirmation incorrect
    Given I am on the create account page
    When I enter the username "Anika"
    And I enter the email ""
    And I enter the password "password"
    And I confirm the password "passworf"
    And I press the Create Account button
    Then I should get a "Failed to create account: email required" message