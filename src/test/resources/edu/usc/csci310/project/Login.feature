Feature: test the login functionality of website
  Scenario: successful login
    Given I am on the login page
    When I enter the username "Alice" on login page
    And I enter the password "Happy1" on login page
    And I press the Login button
    Then I should be redirected to the landing page

  Scenario: three incorrect logins within 60 seconds
    Given I am on the login page
    And I have failed twice to log within the last 60 seconds
    When I enter the username "Alice" on login page
    And I enter the password "wrongPassword" on login page
    And I press the Login button
    Then I should get a login "You are locked out for 30 seconds!" message

  Scenario: login attempt with correct password while still on lockdown
    Given I am on the login page
    And I have gotten locked out
    When I enter the username "Alice" on login page
    And I enter the password "Happy1" on login page
    And I press the Login button
    Then I should get a login "You have to wait 30 seconds before trying to log in again. Lockout timer has been reset" message

  Scenario: login attempt with correct password after lockdown expires
    Given I am on the login page
    And I have gotten locked out
    And I wait 30 seconds
    When I enter the username "Alice" on login page
    And I enter the password "Happy1" on login page
    And I press the Login button
    Then I should be redirected to the landing page

  Scenario: three incorrect logins outside 60 seconds
    Given I am on the login page
    And I have failed my second login in the last 61 seconds
    When I enter the username "Alice" on login page
    And I enter the password "wrongPassword" on login page
    And I press the Login button
    Then I should get a login "Incorrect password. One more and you may get locked out" message

  #  Scenario: login attempt with incorrect password while still on lockout
#    Given I am on the login page
#    And I have gotten locked out
#    When I enter the username "Alice" on login page
#    And I enter the password "wrongPassword" on login page
#    And I press the Login button
#    Then I should get a "You have to wait 30 seconds before trying to log in again. Lockout timer has been reset" message

#  Do I have to simulate 3 unsuccessful logins outside 60 seconds YES

