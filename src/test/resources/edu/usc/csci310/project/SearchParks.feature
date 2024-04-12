Feature: test the search page
  Background:
    Given I'm logged in

  # Navigation
  Scenario: Navigate from this page to Compare page
    Given I am on the "search" page
    When I click on the nav button with id "nav-compare"
    Then I should be redirected to the "compare" page
    And see that the page title is "Compare Parks and Give Suggestions"

  Scenario: Navigate from this page to Favorites page
    Given I am on the "search" page
    When I click on the nav button with id "nav-favorites"
    Then I should be redirected to the "Favorites" page
    And see that the page title is "My Favorite Parks"

  Scenario: Logout from this page and go to Login page
    Given I am on the "search" page
    When I click on the nav button with id "nav-logout"
    Then I should be redirected to the "login" page
    And see that the page title is "Login"

  Scenario: Search basic
    Given I'm on search and I enter some kind of search
    Then 10 results will be displayed

  Scenario: Search button
    Given I am on the search page
    And I press the Search button
    Then 10 results will be displayed

  Scenario: Search using enter key
    Given I am on the search page
    And I hit the enter key
    Then 10 results will be displayed

  Scenario: Default search by park name
    Given I am on the search page
    When the user enters "Yellowstone" into the search box
    And I press the Search button
    Then the search results for Yellowstone should be displayed

  Scenario: Enter empty park name
    Given I am on the search page
    When the user enters "" into the search box
    And I press the Search button
    Then 10 results will be displayed

  Scenario: Search by state
    Given I am on the search page
    When the user enters "CA" into the search box
    And I press the "State" radio button
    And I press the Search button
    Then 10 search results for "CA" should be displayed

  Scenario: Search by activity
    Given I am on the search page
    When the user enters "stargazing" into the search box
    And I press the "Activity" radio button
    And I press the Search button
    Then 10 search results for "stargazing" should be displayed

  Scenario: Search by amenity
    Given I am on the search page
    When the user enters "Picnic Table" into the search box
    And I press the "Amenities" radio button
    And I press the Search button
    Then 10 search results for "Picnic Table" should be displayed

  Scenario: View more results
    Given I am on the search page
    When the user enters "Park" into the search box
    And I press the Search button
    Then clicks the "load more results" button
    And 10 more results should be appended to the list

  Scenario: View more results
    Given I am on the search page
    When the user presses the favorites button at the top
    Then the user is navigated to the favorites page

  Scenario: navigate to compare and suggest
    Given I am on the search page
    When I click on the compare and suggest button
    Then the user is navigated to the compare and suggest screen

