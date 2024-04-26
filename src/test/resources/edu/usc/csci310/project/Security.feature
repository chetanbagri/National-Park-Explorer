Feature: Test security features
  Scenario: Logged out if inactive
    Given I am logged in and on the search page
    And I am inactive for sixty one seconds
    Then I am logged out and redirected to the login page

  Scenario: HTTP access for login
    Given I try to access "login" page using http
    Then I should get a message:
      """
      Bad Request
      This combination of host and port requires TLS.
      """

  Scenario: HTTP access for create-account
    Given I try to access "create-account" page using http
    Then I should get a message:
      """
      Bad Request
      This combination of host and port requires TLS.
      """

  Scenario: HTTP access for search
    Given I try to access "search" page using http
    Then I should get a message:
      """
      Bad Request
      This combination of host and port requires TLS.
      """

  Scenario: HTTP access for Favorites
    Given I try to access "Favorites" page using http
    Then I should get a message:
      """
      Bad Request
      This combination of host and port requires TLS.
      """

  Scenario: HTTP access for compare
    Given I try to access "compare" page using http
    Then I should get a message:
      """
      Bad Request
      This combination of host and port requires TLS.
      """

  Scenario: Unable to access search page while not logged in
    Given I start on the "create-account" page
    And I try to access the "search" page without logging in
    Then I should be directed to the "login" page

  Scenario: User can access Login page while not logged in
    Given I start on the "create-account" page
    And I try to access the "login" page without logging in
    Then I should be directed to the "login" page

  Scenario: User can access create-account page while not logged in
    Given I start on the "login" page
    And I try to access the "create-account" page without logging in
    Then I should be directed to the "create-account" page

