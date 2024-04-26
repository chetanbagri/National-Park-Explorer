
Feature: Update and Review a Favorite Park List
  # Navigation
  Scenario: Navigate from this page to Search page
    Given I am on the "favorites" page
    When I click on the nav button with id "nav-search"
    Then I should be redirected to the "search" page
    And see the page title is "Search Parks"
    And I remove the user

  Scenario: Navigate from this page to Compare page
    Given I am on the "favorites" page
    When I click on the nav button with id "nav-compare"
    Then I should be redirected to the "compare" page
    And see the page title is "Compare Parks and Give Suggestions"
    And I remove the user

  Scenario: Logout from this page and go to Login page
    Given I am on the "favorites" page
    When I click on the nav button with id "nav-logout"
    Then I should be redirected to the "login" page
    And see the page title is "Login"
    And I remove the user


  Scenario: User deletes a single park from their Favorites
    Given I am on the favorites page
    And the user has "Alcatraz Island" in their favorites
    When the user hovers over the park button named "Alcatraz Island"
    Then a minus sign should appear
    When the user clicks the minus sign
    Then a confirmation popup should be displayed
    When the user clicks the Confirm button
    Then "Alcatraz Island" should not be in their Favorites list
    And I remove the user

  Scenario: User cancels delete a single park from their Favorites
    Given I am on the favorites page
    And the user has "Alcatraz Island" in their favorites
    When the user hovers over the park button named "Alcatraz Island"
    Then a minus sign should appear
    When the user clicks the minus sign
    Then a confirmation popup should be displayed
    When the user clicks the Cancel button
    Then the confirmation popup should disappear
    And the user still has "Alcatraz Island" in their favorites
    And I remove the user

  Scenario: User deletes all parks from Favorites
    Given I am on the favorites page
    And the user has "Alcatraz Island" in their favorites
    And the user has "Acadia National Park" in their favorites
    When the user clicks "Delete All"
    Then a confirmation popup should be displayed
    When the user clicks "Confirm"
    Then the user has 0 parks in their favorites
    And I remove the user

  Scenario: User cancels delete all parks from Favorites
    Given I am on the favorites page
    And the user has "Alcatraz Island" in their favorites
    And the user has "Acadia National Park" in their favorites
    When the user clicks "Delete All"
    Then a confirmation popup should be displayed
    When the user clicks "Cancel"
    Then the user still has "Alcatraz Island" in their favorites
    And the user still has "Acadia National Park" in their favorites
    And I remove the user

  Scenario: User can view details of their Favorite parks
    Given I am on the favorites page
    And the user has "Alcatraz Island" in their favorites
    When the user clicks on "Alcatraz Island"
    Then an inline window of park details appears
    When the user clicks on "Alcatraz Island" again
    Then the inline window is closed
    And I remove the user

  Scenario: Favorites show up in a list-like format
    Given I am on the favorites page
    And the user has Alcatraz Island in their favorites
    Then the user should see Alcatraz Island in a list like format
    And I remove the user

  Scenario: Rank a park higher using the up arrow
    Given I am on the favorites page
    And the user has "Alcatraz Island" at rank 1 in their favorites
    And the user has "Acadia National Park" at rank 2 in their favorites
    When the user hovers over the park button "Acadia National Park"
    Then an up arrow should appear
    When the user clicks the up arrow for rank 2
    Then "Alcatraz Island" should be rank 2
    And "Acadia National Park" should be rank 1
    And I remove the user


  Scenario: Rank a park lower using the down arrow
    Given I am on the favorites page
    And the user has "Alcatraz Island" at rank 1 in their favorites
    And the user has "Acadia National Park" at rank 2 in their favorites
    When the user hovers over the park button "Alcatraz Island"
    Then a down arrow should appear
    When the user clicks the down arrow for rank 1
    Then "Alcatraz Island" should be rank 2
    And "Acadia National Park" should be rank 1
    And I remove the user

  Scenario: Change ranking and it should persist
    Given I am on the favorites page
    And the user has "Alcatraz Island" at rank 1 in their favorites
    And the user has "Acadia National Park" at rank 2 in their favorites
    When the user hovers over the park button "Alcatraz Island"
    Then a down arrow should appear
    When the user clicks the down arrow for rank 1
    Then "Alcatraz Island" should be rank 2
    And "Acadia National Park" should be rank 1
    When I click the nav button with id "nav-search"
    And I click the nav button with id "nav-favorites"
    Then "Alcatraz Island" should be rank 2
    And "Acadia National Park" should be rank 1
    And I remove the user


  Scenario: default private favorites
    Given I am on the favorites page
    And the user has 0 parks in their favorites
    Then the favorites list is set to private by default
    And I remove the user

  Scenario: set favorites to public
    Given I am on the favorites page
    And the favorites list is set to private by default
    When I click Make Favorites Public
    Then the favorites list should be public
    And I remove the user

  Scenario: set favorites to public & persist
    Given I am on the favorites page
    And the favorites list is set to private by default
    When I click Make Favorites Public
    Then the favorites list should be public
    When I click the nav button with id "nav-search"
    And I click the nav button with id "nav-favorites"
    Then the favorites list should be public
    And I remove the user




