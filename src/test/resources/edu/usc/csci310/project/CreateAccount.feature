Feature: test the create account functionality of website
  Scenario: successful creation of account
    Given I am on the create account page
    When I enter the username "Anika"
    And I enter the email "anika@example.com"
    And I enter the password "happygolucky"
    And I confirm the password "happygolucky"
    And I press the Create Account button
    Then I should get an alert saying "Successful Account Creation"
    And I should be redirected to the Landing Page


  Scenario: username exists
    Given I am on the create account page
    When I enter the username "Anika"
    And I enter the email "jainee@example.com"
    And I enter the password "happygolucky"
    And I confirm the password "happygolucky"
    And I press the Create Account button
    Then I should get a "Failed to create account: User already exists with this username" message

  Scenario: email exists
    Given I am on the create account page
    When I enter the username "Jainee"
    And I enter the email "anika@example.com"
    And I enter the password "happygolucky"
    And I confirm the password "happygolucky"
    And I press the Create Account button
    Then I should get a "Failed to create account: User already exists with this email" message