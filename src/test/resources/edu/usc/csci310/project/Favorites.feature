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

  #search page
#  Scenario: Navigate to Favorites page from Search page
#    Given I am on the search page
#    When the user clicks on "Favorites" in the nav bar
#    Then the user should be navigated to the Favorites page
#
#  Scenario: Navigate to Compare page from Search page
#    Given I am on the search page
#    When the user clicks on "Compare" in the nav bar
#    Then the user should be navigated to the Compare page
#
#
#  Scenario: User adds a park to their Favorites and sees success message
#    Given I am on the search page
#    And the search results for Alcatraz Island are displayed
#    When the user hovers over the name of the park "Alcataraz Island"
#    Then a plus sign should appear
#    When the user clicks the plus sign
#    Then a success message should be displayed
#
#  Scenario: User tries to add a park that is already in their Favorites
#    Given I am on the search page
#    And "Alcatraz Island" is already in the user's favorites
#    And the search results for Alcatraz Island are displayed
#    When the user hovers over the name of the park "Alcataraz Island"
#    Then a plus sign should appear
#    When the user clicks the plus sign
#    Then an error message should be displayed
#
#  Scenario: User adds a park to their Favorites and sees it in Favorites list
#    Given I am on the search page
#    And the user has added "Alcatraz Island" to their favorites
#    When the user navigates to the Favorites page
#    Then the user should see "Alcatraz Island"

    #favorites page
#  Scenario: Navigate to Search page from Favorites page
#    Given I am on the favorites page
#    When the user clicks on "Search" in the nav bar
#    Then the user should be navigated to the Search page
#
#  Scenario: Navigate to Compare page from Favorites page
#    Given I am on the favorites page
#    When the user clicks on "Compare" in the nav bar
#    Then the user should be navigated to the Compare page

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
    And the user has at least 1 parks in their Favorites
    Then their Favorites list should look the same as the Search results list
