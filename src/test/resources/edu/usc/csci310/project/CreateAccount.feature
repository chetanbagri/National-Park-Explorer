Feature: test the create account functionality of website
  Scenario: successful creation of account
    Given I am on the create account page
    When I enter the username "Anika5"
    And I enter the email "anika5@example.com"
    And I enter the password "passwordtwelvecharacters"
    And I confirm the password "passwordtwelvecharacters"
    And I press the Create Account button
    Then I should get a "Welcome, Anika" message

  Scenario: blank attempt
    Given I am on the create account page
    When I enter the username ""
    And I enter the email ""
    And I enter the password ""
    And I confirm the password ""
    And I press the Create Account button
    Then I should get a "Username cannot be empty" message


  Scenario: empty password
    Given I am on the create account page
    When I enter the username "Anika"
    And I enter the email "anika@example.com"
    And I enter the password ""
    And I confirm the password ""
    And I press the Create Account button
    Then I should get a "Password cannot be empty" message


  Scenario: empty username
    Given I am on the create account page
    When I enter the username ""
    And I enter the email "anika@example.com"
    And I enter the password "password"
    And I confirm the password "password"
    And I press the Create Account button
    Then I should get a "Username cannot be empty" message


  Scenario: empty email
    Given I am on the create account page
    When I enter the username "Anika"
    And I enter the email ""
    And I enter the password "password"
    And I confirm the password "password"
    And I press the Create Account button
    Then I should get a "Email cannot be empty" message

  Scenario: password confirmation incorrect
    Given I am on the create account page
    When I enter the username "Anika"
    And I enter the email "anika@example.com"
    And I enter the password "passwordtwelvecharacters"
    And I confirm the password "passwordtwelvecharactersss"
    And I press the Create Account button
    Then I should get a "Passwords do not match" message