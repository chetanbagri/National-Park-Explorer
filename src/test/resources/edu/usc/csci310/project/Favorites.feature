Feature: Update and Review a Favorite Park List
  # Navigation
  Scenario: Navigate from this page to Search page
    Given I am on the "favorites" page
    When I click on the nav button with id "nav-search"
    Then I should be redirected to the "search" page
    And see that the page title is "Search Parks"

  Scenario: Navigate from this page to Compare page
    Given I am on the "favorites" page
    When I click on the nav button with id "nav-compare"
    Then I should be redirected to the "compare" page
    And see that the page title is "Compare Parks and Give Suggestions"

  Scenario: Logout from this page and go to Login page
    Given I am on the "favorites" page
    When I click on the nav button with id "nav-logout"
    Then I should be redirected to the "login" page
    And see that the page title is "Login"


  Scenario: User deletes a single park from their Favorites
    Given I am on the favorites page
    And the user has Alcatraz Island in their favorites
    When the user hovers over the name of the park "Alcataraz Island"
    Then a minus sign should appear
    When the user clicks the minus sign
    Then a confirmation popup should be displayed
    When the user clicks "Confirm"
    Then "Alcatraz Island" should be removed from their Favorites list

  Scenario: User cancels delete a single park from their Favorites
    Given I am on the favorites page
    And the user has Alcatraz Island in their favorites
    When the user hovers over the name of the park "Alcataraz Island"
    Then a minus sign should appear
    When the user clicks the minus sign
    Then a confirmation popup should be displayed
    When the user clicks "Cancel"
    Then the confirmation popup should disappear
    And their Favorites list should remain the same

  Scenario: User deletes all parks from Favorites
    Given I am on the favorites page
    And the user has at least 2 parks in their Favorites
    When the user clicks the "Delete All" button
    Then a confirmation popup should be displayed
    When the user clicks "Confirm"
    Then all parks should be removed from their Favorites

  Scenario: User cancels delete all parks from Favorites
    Given I am on the favorites page
    And the user has at least 2 parks in their Favorites
    When the user clicks the "Delete All" button
    Then a confirmation popup should be displayed
    When the user clicks "Cancel"
    Then the confirmation popup should disappear
    And their Favorites list should remain the same

  Scenario: User can view details of their Favorite parks
    Given I am on the favorites page
    And the user has at least 1 parks in their Favorites
    When the user clicks on a favorite park
    Then the inline window of details should appear
    When the user clicks on that park again
    Then the inline window of details should disappear

  Scenario: Favorites looks the same as Search page
    Given I am on the favorites page
    And the user has Alcatraz Island in their favorites
    Then the user should see Alcatraz Island in a list like format
