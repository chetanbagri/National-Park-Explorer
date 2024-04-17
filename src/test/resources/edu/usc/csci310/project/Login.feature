Feature: test the login functionality of website
  Scenario: successful login
    Given I am on the login page
    When I enter the username "Bob" on login page
    And I enter the password "Happy1" on login page
    And I press the Login button
    Then I should be redirected to the landing page

  Scenario: three incorrect logins within 60 seconds
    Given I am on the login page
    And I have failed twice to log within the last 60 seconds
    When I enter the username "Bob" on login page
    And I enter the password "wrongPassword" on login page
    And I press the Login button
    Then I should get a login "Error: You are locked out for 30 seconds"

  Scenario: login attempt with correct password while still on lockout
    Given I am on the login page
    And I have gotten locked out
    When I enter the username "Bob" on login page
    And I enter the password "Happy1" on login page
    And I press the Login button
    Then I should get a login "Error: Wait 30 seconds!"

  Scenario: login attempt with correct password after lockout expires
    Given I am on the login page
    And I have gotten locked out
    And I wait 30 seconds
    When I enter the username "Bob" on login page
    And I enter the password "Happy1" on login page
    And I press the Login button
    Then I should be redirected to the landing page

  Scenario: three incorrect logins outside 60 seconds
    Given I am on the login page
    And I have failed my second login in the last 61 seconds
    When I enter the username "Bob" on login page
    And I enter the password "wrongPassword" on login page
    And I press the Login button
    Then I should get a login "Error: One more fail may lockout"
