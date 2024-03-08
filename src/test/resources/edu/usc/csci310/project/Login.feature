Feature: test the login functionality of website
#  Scenario: successful login
#    Given I am on the login page
#    When I enter the username "Nick" on login page
#    And I enter the password "myPassword" on login page
#    And I press the Login button
#    Then I should get a "Login Successful" message displayed

  Scenario: an incorrect login
    Given I am on the login page
    When I enter the username "Nick" on login page
    And I enter the password "wrongPassword" on login page
    And I press the Login button
    Then I should get a "Login Unsuccessful" message displayed

  Scenario: blank login attempt
    Given I am on the login page
    When I enter the username "" on login page
    And I enter the password "" on login page
    And I press the Login button
    Then I should get a "Login Unsuccessful, username and password required" message displayed

  Scenario: empty password
    Given I am on the login page
    When I enter the username "Nick" on login page
    And I enter the password "" on login page
    And I press the Login button
    Then I should get a "Login Unsuccessful, password required" message displayed

  Scenario: empty username
    Given I am on the login page
    When I enter the username "" on login page
    And I enter the password "myPassword" on login page
    And I press the Login button
    Then I should get a "Login Unsuccessful, username required" message displayed

#  Scenario: two incorrect logins in a row
#    Given I am on the login page
#    And I have tried unsuccessfully to log in on the previous attempt
#    When I enter the username "Nick" on login page
#    And I enter the password "wrongPassword" on login page
#    And I press the Login button
#    Then I should get a "Login Unsuccessful, one more attempt to log in allowed" message

#  Scenario: three incorrect logins in a row
#    Given I am on the login page
#    And I have tried unsuccessfully to log in the two previous attempts
#    When I enter the username "Nick" on login page
#    And I enter the password "wrongPassword" on login page
#    And I press the Login button
#    Then I should be redirected to the Account Blocked page
#    And I should get a "Account Blocked" message displayed

#  Scenario: four incorrect logins in a row (login with account blocked)
#    Given I am on the login page
#    And I have tried unsuccessfully to log in the three previous attempts
#    When I enter the username "Nick" on login page
#    And I enter the password "wrongPassword" on login page
#    And I press the Login button
#    Then I should be redirected to the Account Blocked page
#    And I should get a "Account Blocked" message displayed

#  Scenario: three incorrect logins in a row plus 1 correct (login with account blocked)
#    Given I am on the login page
#    And I have tried unsuccessfully to log in the three previous attempts
#    When I enter the username "Nick" on login page
#    And I enter the password "myPassword" on login page
#    And I press the Login button
#    Then I should be redirected to the Account Blocked page
#    And I should get a "Account Blocked" message displayed

  Scenario: password is case-sensitive
    Given I am on the login page
    When I enter the username "Nick" on login page
    And I enter the password "mypassword" on login page
    And I press the Login button
    Then I should get a "Login Unsuccessful" message displayed

#  Scenario: successful login with complex password
#    Given I am on the login page
#    When I enter the username "NickAlt" on login page
#    And I enter the password "1234567890!@#$%^&*()qwErtyUIop-=_+[}]{;:\|/?'" on login page
#    And I press the Login button
#    Then I should get a "Login Successful" message displayed

#  Scenario: unsuccessful login with complex password and SQL Injection
#    Given I am on the login page
#    When I enter the username "NickAlt" on login page
#    And I enter the password "1234567890!@#$%^&*()qwErtyUIop-=_+[}]{;:\|/?' OR 1=1" on login page
#    And I press the Login button
#    Then I should get a "Login Successful" message displayed

  # May need more potential scenarios depending on stakeholder need
  # Potential feature: Do we want an eye icon to display password?