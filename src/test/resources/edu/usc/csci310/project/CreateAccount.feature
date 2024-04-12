Feature: test the create account functionality of website
  Scenario: Password doesn't contain uppercase
    Given I start at the login page
    And I click the create account link
    Then I should be on the create account page

  Scenario: Passwords field is empty
    Given I am on the create account page
    When I enter the username "Alice"
    And I enter the password ""
    And I confirm the password "Happy1"
    And I press the Create User button
    Then I should get "Error: Password field cannot be empty" message

  Scenario: Passwords doesn't match
    Given I am on the create account page
    When I enter the username "Alice"
    And I enter the password "Happy1"
    And I confirm the password "Sad1"
    And I press the Create User button
    Then I should get "Error: Password and confirm password must match" message

  Scenario: Password doesn't contain uppercase
    Given I am on the create account page
    When I enter the username "Alice"
    And I enter the password "happy1"
    And I confirm the password "happy1"
    And I press the Create User button
    Then I should get "Error: Password must have one uppercase character" message

  Scenario: Password doesn't contain lowercase
    Given I am on the create account page
    When I enter the username "Alice"
    And I enter the password "HAPPY1"
    And I confirm the password "HAPPY1"
    And I press the Create User button
    Then I should get "Error: Password must have one lowercase character" message

  Scenario: Password doesn't contain number character
    Given I am on the create account page
    When I enter the username "Alice"
    And I enter the password "Happy"
    And I confirm the password "Happy"
    And I press the Create User button
    Then I should get "Error: Password must have one numerical character" message

  Scenario: successful creation of account
    Given I am on the create account page
    When I enter the username "Alice"
    And I enter the password "Happy1"
    And I confirm the password "Happy1"
    And I press the Create User button
    Then I should be redirected to the Login Page

  Scenario: username exists
    Given I am on the create account page
    When I enter the username "Alice"
    And I enter the password "Happy1"
    And I confirm the password "Happy1"
    And I press the Create User button
    Then I should get "Error: Username exists" message

  Scenario: Cancel button and Don't Cancel
    Given I am on the create account page
    When I enter the username "Alice"
    And I enter the password "Happy1"
    And I press the Cancel button
    And I press the No button
    Then I should be on the create account page
    And I should see the username field filled with the name "Alice"

  Scenario: Cancel button and Cancel
    Given I am on the create account page
    When I enter the username "Alice"
    And I press the Cancel button
    And I press the Yes button
    Then I should be redirected to the Login Page
