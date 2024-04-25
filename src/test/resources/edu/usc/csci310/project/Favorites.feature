
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
    And the user has "Alcatraz Island" in their favorites
    When the user hovers over the name of the park "Alcatraz Island"
    Then a minus sign should appear
    When the user clicks the minus sign
    Then a confirmation popup should be displayed
    When the user clicks the Confirm button
    Then "Alcatraz Island" should not be in their Favorites list

  Scenario: User cancels delete a single park from their Favorites
    Given I am on the favorites page
    And the user has "Alcatraz Island" in their favorites
    When the user hovers over the name of the park "Alcatraz Island"
    Then a minus sign should appear
    When the user clicks the minus sign
    Then a confirmation popup should be displayed
    When the user clicks the Cancel button
    Then the confirmation popup should disappear
    And the user has "Alcatraz Island" in their favorites

  Scenario: User deletes all parks from Favorites
    Given I am on the favorites page
    And the user has "Alcatraz Island" in their favorites
    And the user has "Acadia National Park" in their favorites
    When the user clicks "Delete All"
    Then a confirmation popup should be displayed
    When the user clicks "Confirm"
    Then the user has 0 parks in their favorites

  Scenario: User cancels delete all parks from Favorites
    Given I am on the favorites page
    And the user has "Alcatraz Island" in their favorites
    And the user has "Acadia National Park" in their favorites
    When the user clicks "Delete All"
    Then a confirmation popup should be displayed
    When the user clicks "Cancel"
    Then the user has "Alcatraz Island" in their favorites
    And the user has "Acadia National Park" in their favorites

  Scenario: User can view details of their Favorite parks
    Given I am on the favorites page
    And the user has "Alcatraz Island" in their favorites
    When the user clicks on "Alcatraz Island"
    Then an inline window showing the details of the park is appended
    When the user clicks on "Alcatraz Island" again
    Then the inline window is closed


  Scenario: Favorites show up in a list-like format
    Given I am on the favorites page
    And the user has Alcatraz Island in their favorites
    Then the user should see Alcatraz Island in a list like format


  Scenario: Rank a park higher using the up arrow
    Given I am on the favorites page
    And the user has "Alcatraz Island" at rank 1 in their favorites
    And the user has "Acadia National Park" at rank 2 in their favorites
    When the user hovers over the name of the park "Acadia National Park"
    Then an up arrow should appear
    When the user clicks the up arrow
    Then "Alcatraz Island" should be rank 2
    And "Acadia National Park" should be rank 1


  Scenario: Rank a park lower using the down arrow
    Given I am on the favorites page
    And the user has "Alcatraz Island" at rank 1 in their favorites
    And the user has "Acadia National Park" at rank 2 in their favorites
    When the user hovers over the name of the park "Alcatraz Island"
    Then a down arrow should appear
    When the user clicks the down arrow
    Then "Alcatraz Island" should be rank 2
    And "Acadia National Park" should be rank 1

  Scenario: Change ranking and it should persist
    Given I am on the favorites page
    And the user has "Alcatraz Island" at rank 1 in their favorites
    And the user has "Acadia National Park" at rank 2 in their favorites
    When the user hovers over the name of the park "Alcatraz Island"
    Then a down arrow should appear
    When the user clicks the down arrow
    Then "Alcatraz Island" should be rank 2
    And "Acadia National Park" should be rank 1
    When I click on the nav button with id "nav-search"
    And I click on the nav button with id "nav-favorites"
    Then "Alcatraz Island" should be rank 2
    And "Acadia National Park" should be rank 1


  Scenario: default private favorites
    Given I am on the favorites page
    And the user has 0 parks in their favorites
    Then the favorites list should be set to private by default

  Scenario: set favorites to public
    Given I am on the favorites page
    And the favorites list is set to private
    When I click "Make Favorites Public"
    Then the favorites list should be public

  Scenario: set favorites to public & persist
    Given I am on the favorites page
    And the favorites list is set to private
    When I click "Make Favorites Public"
    Then the favorites list should be public
    When I click on the nav button with id "nav-search"
    And I click on the nav button with id "nav-favorites"
    Then the favorites list should be public




